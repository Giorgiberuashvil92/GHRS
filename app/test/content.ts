export type QuestionnaireAnswers = {
  locale: 'en' | 'ru'; purpose: 'rehabilitation' | 'professional'; nickname: string; fullName?: string;
  phone: string; email?: string; gender?: string; age?: number; weight?: number;
  trainingLevel?: string; conditionId?: string; conditionDetails?: string; additionalInfo?: string; consent: boolean;
};
export type Label = { en: string; ru: string };
export type Options = { groups: { id: string; label: Label; options: { id: string; label: Label }[] }[]; catalog: { id: string; label: Label; href: string }[] };
export type Submission = { _id: string; answers: QuestionnaireAnswers; createdAt: string; outcome: 'catalog' | 'review' | 'professional'; conditionLabel?: Label; links: { href: string; title: Label }[] };
export const copy = {
  en: {
    eyebrow: 'YOUR GHRS JOURNEY', title: 'A little about you.\nA clearer way forward.', intro: 'Tell us about your goals and experience so we can help you find your way around GHRS.',
    time: 'About 3 minutes', steps: ['About you', 'Your experience', 'Review & send'], stepHints: ['Your goals and contact details', 'Your level and area of interest', 'Check your answers before sending'],
    first: 'Let’s start with you', firstHint: 'Your answers will be linked to your GHRS account.', required: '* Required fields', purpose: 'What brings you to GHRS?', rehabilitation: 'Rehabilitation', rehabilitationHint: 'Explore exercise complexes and rehabilitation programs.', professional: 'Professional development', professionalHint: 'Explore courses and develop your professional skills.',
    nickname: 'Nickname', fullName: 'Full name', phone: 'Phone', email: 'Contact email', gender: 'Gender', age: 'Age', weight: 'Weight (kg)', optional: 'Optional',
    catalogUnavailable: 'Live catalog sections are temporarily unavailable. You can still complete the questionnaire below.',
    second: 'Your starting point', secondHint: 'Choose the experience level and condition that best describe you. You can leave optional questions blank.', level: 'Training level', beginner: 'Beginner', beginnerHint: 'Starting out or returning to exercise', intermediate: 'Intermediate', intermediateHint: 'Some regular training experience', advanced: 'Advanced', advancedHint: 'Extensive training experience',
    condition: 'Condition or area of interest', select: 'Choose an option', catalog: 'Available catalog sections', otherDetails: 'Tell us more', additionalInfo: 'Additional information', additionalPlaceholder: 'Anything else you would like the GHRS team to know…', otherPlaceholder: 'Describe what you would like help with…', conditionHint: 'Choose a catalog section to explore its complexes, or a condition for our team to review.',
    third: 'Everything look right?', thirdHint: 'Your questionnaire will be available to the GHRS team. The submission date is added automatically.', consent: 'I agree to share these answers, including health information, with the GHRS team to help with my request.',
    back: 'Back', next: 'Continue', submit: 'Send questionnaire', sending: 'Sending…', loading: 'Loading your questionnaire…', loadError: 'We couldn’t load the questionnaire. Please try again.', saveError: 'Your questionnaire wasn’t sent. Your answers are still here; please try again.', sessionError: 'Your session has ended. Sign in again to send your answers.', retry: 'Try again', home: 'Back to home',
    signIn: 'Make it personal', signInHint: 'Sign in to connect your answers to your account and share them with the GHRS team.', signInButton: 'Sign in to continue',
    success: 'Thank you. You’re all set.', saved: 'Your questionnaire has been saved and sent to the GHRS team.', reviewResult: 'Our team will review your answers and can follow up using the contact details you provided.', catalogResult: 'You can explore the catalog section you selected below. Exercise access depends on your subscription or purchase.', professionalResult: 'Explore the professional development catalog for your next course.',
    openCatalog: 'Explore this section', another: 'Fill in again', sentAt: 'Submitted', previous: 'Your previous answers have been filled in. You can update them and send a new questionnaire.',
    female: 'Female', male: 'Male', other: 'Other', prefer: 'Prefer not to say', notProvided: 'Not provided', date: 'Submission date', automatic: 'Added automatically when you send',
  },
  ru: {
    eyebrow: 'ВАШ ПУТЬ С GHRS', title: 'Немного о вас.\nПонятный следующий шаг.', intro: 'Расскажите о своих целях и опыте, чтобы мы помогли вам сориентироваться на платформе GHRS.',
    time: 'Около 3 минут', steps: ['О вас', 'Ваш опыт', 'Проверка и отправка'], stepHints: ['Цели и контактные данные', 'Уровень и направление занятий', 'Проверьте ответы перед отправкой'],
    first: 'Давайте познакомимся', firstHint: 'Ответы будут связаны с вашим аккаунтом GHRS.', required: '* Обязательные поля', purpose: 'Что привело вас в GHRS?', rehabilitation: 'Реабилитация', rehabilitationHint: 'Комплексы упражнений и программы реабилитации.', professional: 'Профессиональное развитие', professionalHint: 'Обучающие курсы и развитие профессиональных навыков.',
    nickname: 'Ник', fullName: 'ФИО', phone: 'Телефон', email: 'Контактная почта', gender: 'Пол', age: 'Возраст', weight: 'Вес (кг)', optional: 'Необязательно',
    catalogUnavailable: 'Разделы каталога временно недоступны. Вы можете заполнить анкету ниже.',
    second: 'Ваша отправная точка', secondHint: 'Выберите свой уровень подготовки и интересующее направление. Необязательные вопросы можно пропустить.', level: 'Уровень подготовки', beginner: 'Начальный', beginnerHint: 'Начинаете или возвращаетесь к занятиям', intermediate: 'Средний', intermediateHint: 'Есть опыт регулярных тренировок', advanced: 'Продвинутый', advancedHint: 'Большой опыт тренировок',
    condition: 'Заболевание или направление', select: 'Выберите вариант', catalog: 'Доступные разделы каталога', otherDetails: 'Расскажите подробнее', additionalInfo: 'Дополнительная информация', additionalPlaceholder: 'Что ещё вы хотели бы сообщить команде GHRS…', otherPlaceholder: 'Опишите, с чем вам нужна помощь…', conditionHint: 'Выберите раздел каталога, чтобы посмотреть комплексы, или заболевание для рассмотрения нашей командой.',
    third: 'Всё верно?', thirdHint: 'Анкета будет доступна команде GHRS. Дата заполнения проставляется автоматически.', consent: 'Я соглашаюсь передать ответы, включая информацию о здоровье, команде GHRS для работы с моим запросом.',
    back: 'Назад', next: 'Продолжить', submit: 'Отправить анкету', sending: 'Отправка…', loading: 'Загружаем вашу анкету…', loadError: 'Не удалось загрузить анкету. Попробуйте ещё раз.', saveError: 'Анкета не отправлена. Ваши ответы сохранены в форме — попробуйте ещё раз.', sessionError: 'Сеанс завершён. Войдите снова, чтобы отправить ответы.', retry: 'Попробовать снова', home: 'На главную',
    signIn: 'Начнём с вашего аккаунта', signInHint: 'Войдите, чтобы связать ответы с вашим аккаунтом и передать их команде GHRS.', signInButton: 'Войти и продолжить',
    success: 'Спасибо! Анкета отправлена.', saved: 'Ваши ответы сохранены и переданы команде GHRS.', reviewResult: 'Команда рассмотрит ответы и сможет связаться с вами по указанным контактам.', catalogResult: 'Ниже можно перейти в выбранный раздел каталога. Доступ к упражнениям зависит от подписки или покупки.', professionalResult: 'Перейдите в каталог профессионального развития, чтобы выбрать следующий курс.',
    openCatalog: 'Перейти в раздел', another: 'Заполнить ещё раз', sentAt: 'Дата отправки', previous: 'Мы подставили предыдущие ответы. Вы можете изменить их и отправить новую анкету.',
    female: 'Женский', male: 'Мужской', other: 'Другое', prefer: 'Предпочитаю не указывать', notProvided: 'Не указано', date: 'Дата заполнения', automatic: 'Проставляется автоматически при отправке',
  },
};
