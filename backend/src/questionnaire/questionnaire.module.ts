import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Questionnaire, QuestionnaireSchema } from '../schemas/questionnaire.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Category, CategorySchema } from '../schemas/category.schema';
import { Set, SetSchema } from '../schemas/set.schema';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireController } from './questionnaire.controller';
@Module({
  imports: [MongooseModule.forFeature([
    { name: Questionnaire.name, schema: QuestionnaireSchema }, { name: User.name, schema: UserSchema },
    { name: Category.name, schema: CategorySchema }, { name: Set.name, schema: SetSchema },
  ])],
  controllers: [QuestionnaireController], providers: [QuestionnaireService],
})
export class QuestionnaireModule {}
