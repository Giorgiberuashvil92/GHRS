import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Questionnaire, QuestionnaireDocument } from '../schemas/questionnaire.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Set, SetDocument } from '../schemas/set.schema';
import { SubmitQuestionnaireDto } from './dto/submit-questionnaire.dto';
import { CONDITION_GROUPS, findCatalogSection } from './conditions';
const label = (name: { en?: string; ru?: string; ka?: string }) => ({ en: name.en || name.ru || name.ka || '', ru: name.ru || name.en || name.ka || '' });
@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectModel(Questionnaire.name) private readonly questionnaires: Model<QuestionnaireDocument>,
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    @InjectModel(Category.name) private readonly categories: Model<CategoryDocument>,
    @InjectModel(Set.name) private readonly sets: Model<SetDocument>,
  ) {}
  async options() {
    const categories = await this.categories.find({ isActive: true, isPublished: true }).select('_id name parentId').lean();
    const ids = categories.map(category => category._id);
    const sets = await this.sets.find({ isActive: true, isPublished: true, categoryId: { $in: ids } }).select('categoryId subCategoryId').lean();
    const available = new global.Set(sets.flatMap(set => [String(set.categoryId), ...(set.subCategoryId ? [String(set.subCategoryId)] : [])]));
    const catalog = categories.filter(category => available.has(String(category._id)) && (!category.parentId || ids.some(id => id.equals(category.parentId)))).map(category => ({
      id: `catalog:${category._id}`, label: label(category.name), href: category.parentId ? `/categories/section?subcategoryId=${category._id}&categoryId=${category.parentId}` : `/categories/${category._id}`,
    }));
    return { groups: CONDITION_GROUPS, catalog };
  }
  async latest(userId: string) {
    return this.questionnaires.findOne({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1, _id: -1 }).lean();
  }
  async submit(userId: string, answers: SubmitQuestionnaireDto) {
    const user = await this.users.findOne({ _id: userId, deletedAt: null }).select('name email').lean();
    if (!user) throw new NotFoundException('User not found');
    const digits = answers.phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) throw new BadRequestException('Invalid phone');
    const { groups, catalog } = await this.options();
    const condition = groups.flatMap(group => group.options).find(option => option.id === answers.conditionId);
    const section = catalog.find(option => option.id === answers.conditionId) || findCatalogSection(answers.conditionId, catalog);
    if (answers.conditionId && !condition && !section) throw new BadRequestException('Condition or catalog section is unavailable');
    if (answers.conditionId?.endsWith('-other') && !answers.conditionDetails?.trim()) throw new BadRequestException('Describe your condition');
    // Catalogue navigation only: a diagnosis is never turned into a medical prescription.
    const outcome = answers.purpose === 'professional' ? 'professional' : section ? 'catalog' : 'review';
    const links = outcome === 'professional' ? [{ href: '/professional', title: { en: 'Professional development', ru: 'Профессиональное развитие' } }]
      : section ? [{ href: section.href, title: section.label }] : [];
    return this.questionnaires.create({
      userId: user._id, accountName: user.name, accountEmail: user.email,
      answers, conditionLabel: condition?.label || section?.label, outcome, links,
    });
  }
  async list(search = '', status = '', rawPage = '1') {
    const page = Number(rawPage);
    if (!Number.isSafeInteger(page) || page < 1 || page > 1000000 || typeof search !== 'string') throw new BadRequestException('Invalid query');
    if (status && !['new', 'reviewed'].includes(status)) throw new BadRequestException('Invalid status');
    const escaped = search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter = { ...(status ? { status } : {}), ...(escaped ? { $or: ['accountName', 'accountEmail', 'answers.nickname', 'answers.phone'].map(field => ({ [field]: { $regex: escaped, $options: 'i' } })) } : {}) };
    const [items, total, pending] = await Promise.all([
      this.questionnaires.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20).lean(),
      this.questionnaires.countDocuments(filter), this.questionnaires.countDocuments({ status: 'new' }),
    ]);
    return { items, total, pending, page, pageSize: 20 };
  }
  async review(id: string, status: string, curatorNotes: string, email: string) {
    if (!/^[a-f\d]{24}$/i.test(id) || !['new', 'reviewed'].includes(status) || typeof curatorNotes !== 'string' || curatorNotes.length > 5000) throw new BadRequestException('Invalid review');
    const item = await this.questionnaires.findByIdAndUpdate(id, { $set: { status, curatorNotes: curatorNotes.trim(), reviewedAt: status === 'reviewed' ? new Date() : null, reviewedBy: email } }, { new: true, runValidators: true }).lean();
    if (!item) throw new NotFoundException('Questionnaire not found');
    return item;
  }
}
