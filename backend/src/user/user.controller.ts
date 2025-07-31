import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Legacy user-based instructor endpoints (kept for backward compatibility)
@Controller('legacy-instructors')
export class UserInstructorController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // GET /legacy-instructors/dropdown - ინსტრუქტორების ჩამოსაშლელი სია (legacy)
  @Get('dropdown')
  async getInstructorsForDropdown(): Promise<
    { id: string; name: string; email: string }[]
  > {
    const instructors = await this.userModel
      .find({
        role: 'instructor',
        isActive: true,
      })
      .select('name email')
      .sort({ name: 1 });

    return instructors.map((instructor) => ({
      id: String(instructor._id),
      name: instructor.name,
      email: instructor.email,
    }));
  }

  // GET /legacy-instructors - ყველა ინსტრუქტორი (legacy)
  @Get()
  async getAllInstructors() {
    return this.userModel
      .find({
        role: 'instructor',
        isActive: true,
      })
      .select(
        'name email bio avatar expertise experience education certifications',
      )
      .sort({ name: 1 });
  }

  // POST /legacy-instructors - ახალი ინსტრუქტორის შექმნა (legacy)
  @Post()
  async createInstructor(
    @Body()
    instructorData: {
      name: string;
      email: string;
      bio?: string;
      expertise?: string[];
      experience?: number;
      education?: string;
      certifications?: string[];
    },
  ) {
    const instructor = new this.userModel({
      ...instructorData,
      role: 'instructor',
      isActive: true,
    });
    return instructor.save();
  }
}

// User achievements and statistics controller
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // GET /users/me/achievements - მომხმარებლის მიღწევები
  @Get('me/achievements')
  async getMyAchievements(@Request() req: any) {
    const userId = req.user.userId;
    const user = await this.userModel.findById(userId).select('achievements');
    return user?.achievements || [];
  }

  // GET /users/me/statistics - მომხმარებლის სტატისტიკა
  @Get('me/statistics')
  async getMyStatistics(@Request() req: any) {
    const userId = req.user.userId;
    const user = await this.userModel.findById(userId).select('statistics');
    return user?.statistics || {};
  }

  // POST /users/me/achievements/unlock - მიღწევის განბლოკვა
  @Post('me/achievements/unlock')
  async unlockAchievement(
    @Request() req: any,
    @Body() body: { achievementId: string }
  ) {
    const userId = req.user.userId;
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    const achievement = user.achievements.find(a => a.id === body.achievementId);
    if (achievement) {
      achievement.unlockedAt = new Date();
    }

    await user.save();
    return { success: true };
  }

  // PUT /users/me/achievements/:id/progress - მიღწევის პროგრესის განახლება
  @Put('me/achievements/:id/progress')
  async updateAchievementProgress(
    @Request() req: any,
    @Param('id') achievementId: string,
    @Body() body: { current: number }
  ) {
    const userId = req.user.userId;
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    const achievement = user.achievements.find(a => a.id === achievementId);
    if (achievement) {
      achievement.current = body.current;
      if (achievement.current >= achievement.total && !achievement.isCompleted) {
        achievement.isCompleted = true;
        achievement.completedAt = new Date();
      }
    }

    await user.save();
    return achievement;
  }

  // POST /users/me/activity - აქტივობის ჩაწერა
  @Post('me/activity')
  @UseGuards(JwtAuthGuard)
  async recordActivity(@Request() req: any, @Body() activityData: any) {
    console.log('🎯 Activity Request:', {
      userId: req.user?.userId,
      user: req.user,
      activityData,
      headers: req.headers
    });
    
    const userId = req.user.userId;
    const { type, itemId, timeSpent = 0 } = activityData;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Record activity based on type
    const today = new Date().toISOString().split('T')[0];
    
    if (type === 'exercise') {
      user.statistics.totalExercisesCompleted += 1;
      if (!user.statistics.completedExerciseIds.includes(itemId)) {
        user.statistics.completedExerciseIds.push(itemId);
      }
    } else if (type === 'set') {
      user.statistics.totalSetsCompleted += 1;
      if (!user.statistics.completedSetIds.includes(itemId)) {
        user.statistics.completedSetIds.push(itemId);
      }
    } else if (type === 'course') {
      user.statistics.totalCoursesCompleted += 1;
      if (!user.statistics.completedCourseIds.includes(itemId)) {
        user.statistics.completedCourseIds.push(itemId);
      }
    }

    // Update time spent and activity dates
    user.statistics.totalTimeSpent += timeSpent;
    
    // Add today to activity dates if not already present
    const todayExists = user.statistics.activityDates.some(
      date => date.toISOString().split('T')[0] === today
    );
    if (!todayExists) {
      user.statistics.activityDates.push(new Date());
    }

    // Update streak
    await this.updateStreak(user);

    // Check and update achievements
    await this.checkAchievements(user);

    await user.save();

    return { success: true, message: 'Activity recorded successfully' };
  }

  private updateStreak(user: UserDocument) {
    const sortedDates = user.statistics.activityDates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (sortedDates[i].getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    user.statistics.currentStreak = currentStreak;
    if (currentStreak > user.statistics.recordStreak) {
      user.statistics.recordStreak = currentStreak;
    }
  }

  private async checkAchievements(user: UserDocument) {
    // მიღწევების შემოწმება და განახლება
    const achievements = [
      {
        id: 'first-exercise',
        condition: () => user.statistics.totalExercisesCompleted >= 1,
        current: () => Math.min(user.statistics.totalExercisesCompleted, 1)
      },
      {
        id: 'ten-exercises',
        condition: () => user.statistics.totalExercisesCompleted >= 10,
        current: () => Math.min(user.statistics.totalExercisesCompleted, 10)
      },
      {
        id: 'first-set',
        condition: () => user.statistics.totalSetsCompleted >= 1,
        current: () => Math.min(user.statistics.totalSetsCompleted, 1)
      },
      {
        id: 'five-sets',
        condition: () => user.statistics.totalSetsCompleted >= 5,
        current: () => Math.min(user.statistics.totalSetsCompleted, 5)
      },
      {
        id: 'first-course',
        condition: () => user.statistics.totalCoursesCompleted >= 1,
        current: () => Math.min(user.statistics.totalCoursesCompleted, 1)
      },
      {
        id: 'three-day-streak',
        condition: () => user.statistics.currentStreak >= 3,
        current: () => Math.min(user.statistics.currentStreak, 3)
      },
      {
        id: 'five-day-streak',
        condition: () => user.statistics.currentStreak >= 5,
        current: () => Math.min(user.statistics.currentStreak, 5)
      },
      {
        id: 'week-streak',
        condition: () => user.statistics.currentStreak >= 7,
        current: () => Math.min(user.statistics.currentStreak, 7)
      },
      {
        id: 'professional',
        condition: () => user.statistics.totalExercisesCompleted >= 50,
        current: () => Math.min(user.statistics.totalExercisesCompleted, 50)
      },
      {
        id: 'time-master',
        condition: () => user.statistics.totalTimeSpent >= 300, // 5 საათი
        current: () => Math.min(user.statistics.totalTimeSpent, 300)
      }
    ];

    for (const achDef of achievements) {
      let achievement = user.achievements.find(a => a.id === achDef.id);
      
      if (!achievement) {
        // შევქმნათ ახალი მიღწევა თუ არ არსებობს
        achievement = {
          id: achDef.id,
          title: this.getAchievementTitle(achDef.id),
          description: this.getAchievementDescription(achDef.id),
          current: achDef.current(),
          total: this.getAchievementTotal(achDef.id),
          isCompleted: false,
          image: this.getAchievementImage(achDef.id),
          imageBg: this.getAchievementBg(achDef.id)
        } as any;
        user.achievements.push(achievement);
      } else {
        achievement.current = achDef.current();
      }

      if (achDef.condition() && !achievement.isCompleted) {
        achievement.isCompleted = true;
        achievement.completedAt = new Date();
      }
    }
  }

  private getAchievementTitle(id: string) {
    const titles = {
      'first-exercise': {
        en: 'First Exercise',
        ru: 'Первое упражнение',
        ka: 'პირველი ვარჯიში'
      },
      'ten-exercises': {
        en: '10 Exercises',
        ru: '10 упражнений',
        ka: '10 ვარჯიში'
      },
      'first-set': {
        en: 'First Set',
        ru: 'Первый комплекс',
        ka: 'პირველი კომპლექსი'
      },
      'five-sets': {
        en: '5 Sets',
        ru: '5 комплексов',
        ka: '5 კომპლექსი'
      },
      'first-course': {
        en: 'First Course',
        ru: 'Первый курс',
        ka: 'პირველი კურსი'
      },
      'three-day-streak': {
        en: '3 Day Streak',
        ru: '3 дня подряд',
        ka: '3 დღე ზედიზედ'
      },
      'five-day-streak': {
        en: '5 Day Streak',
        ru: '5 дней подряд',
        ka: '5 დღე ზედიზედ'
      },
      'week-streak': {
        en: 'Week Streak',
        ru: 'Неделя подряд',
        ka: 'კვირა ზედიზედ'
      },
      'professional': {
        en: 'Professional',
        ru: 'Профессионал',
        ka: 'პროფესიონალი'
      },
      'time-master': {
        en: 'Time Master',
        ru: 'Мастер времени',
        ka: 'დროის ოსტატი'
      }
    };
    return titles[id] || { en: 'Achievement', ru: 'Достижение', ka: 'მიღწევა' };
  }

  private getAchievementDescription(id: string) {
    const descriptions = {
      'first-exercise': {
        en: 'Complete your first exercise',
        ru: 'Завершите первое упражнение',
        ka: 'დაასრულეთ პირველი ვარჯიში'
      },
      'ten-exercises': {
        en: 'Complete 10 exercises',
        ru: 'Завершите 10 упражнений',
        ka: 'დაასრულეთ 10 ვარჯიში'
      },
      'first-set': {
        en: 'Complete your first set',
        ru: 'Завершите первый комплекс',
        ka: 'დაასრულეთ პირველი კომპლექსი'
      },
      'five-sets': {
        en: 'Complete 5 sets',
        ru: 'Завершите 5 комплексов',
        ka: 'დაასრულეთ 5 კომპლექსი'
      },
      'first-course': {
        en: 'Complete your first course',
        ru: 'Завершите первый курс',
        ka: 'დაასრულეთ პირველი კურსი'
      },
      'three-day-streak': {
        en: 'Exercise for 3 days in a row',
        ru: 'Тренируйтесь 3 дня подряд',
        ka: 'ივარჯიშეთ 3 დღე ზედიზედ'
      },
      'five-day-streak': {
        en: 'Exercise for 5 days in a row',
        ru: 'Тренируйтесь 5 дней подряд',
        ka: 'ივარჯიშეთ 5 დღე ზედიზედ'
      },
      'week-streak': {
        en: 'Exercise for 7 days in a row',
        ru: 'Тренируйтесь 7 дней подряд',
        ka: 'ივარჯიშეთ 7 დღე ზედიზედ'
      },
      'professional': {
        en: 'Complete 50 exercises',
        ru: 'Завершите 50 упражнений',
        ka: 'დაასრულეთ 50 ვარჯიში'
      },
      'time-master': {
        en: 'Spend 5 hours exercising',
        ru: 'Потратьте 5 часов на упражнения',
        ka: 'დაუთმეთ 5 საათი ვარჯიშებს'
      }
    };
    return descriptions[id] || { en: 'Achievement description', ru: 'Описание достижения', ka: 'მიღწევის აღწერა' };
  }

  private getAchievementTotal(id: string) {
    const totals = {
      'first-exercise': 1,
      'ten-exercises': 10,
      'first-set': 1,
      'five-sets': 5,
      'first-course': 1,
      'three-day-streak': 3,
      'five-day-streak': 5,
      'week-streak': 7,
      'professional': 50,
      'time-master': 300
    };
    return totals[id] || 1;
  }

  private getAchievementImage(id: string) {
    const images = {
      'first-exercise': '/assets/icons/play.svg',
      'ten-exercises': '/assets/icons/pulse.svg',
      'first-set': '/assets/icons/Icon.svg',
      'five-sets': '/assets/icons/Union.png',
      'first-course': '/assets/icons/video.svg',
      'three-day-streak': '/assets/icons/heat.svg',
      'five-day-streak': '/assets/icons/heat.svg',
      'week-streak': '/assets/icons/heat.svg',
      'professional': '/assets/icons/pulse.svg',
      'time-master': '/assets/icons/watch.png'
    };
    return images[id] || '/assets/icons/Icon.svg';
  }

  private getAchievementBg(id: string) {
    const backgrounds = {
      'first-exercise': '#F3D57F',
      'ten-exercises': '#B1E5FC',
      'first-set': '#D4BAFC',
      'five-sets': '#FFB74D',
      'first-course': '#81C784',
      'three-day-streak': '#F8BBD0',
      'five-day-streak': '#B1E5FC',
      'week-streak': '#FFD54F',
      'professional': '#FFD700',
      'time-master': '#E1BEE7'
    };
    return backgrounds[id] || '#D4BAFC';
  }
}
