import type { Locale } from '../locales';

// Existing form statuses, shared with the six new interface languages.
export const consultationMessages: Record<Locale, { sending: string; success: string; error: string }> = {
  ka: { sending: 'იგზავნება...', success: '✅ მადლობა! ჩვენ მალე დაგიკავშირდებით.', error: '❌ რაღაც არასწორად მოხდა. გთხოვთ სცადოთ ხელახლა.' },
  en: { sending: 'Sending...', success: '✅ Thank you! We will contact you soon.', error: '❌ Something went wrong. Please try again.' },
  ru: { sending: 'Отправка...', success: '✅ Спасибо! Мы свяжемся с вами в ближайшее время.', error: '❌ Что-то пошло не так. Пожалуйста, попробуйте еще раз.' },
  he: { sending: 'בשליחה...', success: '✅ תודה! ניצור איתך קשר בקרוב.', error: '❌ משהו השתבש. יש לנסות שוב.' },
  ar: { sending: 'جارٍ الإرسال...', success: '✅ شكرًا لك! سنتواصل معك قريبًا.', error: '❌ حدث خطأ. يُرجى المحاولة مرة أخرى.' },
  de: { sending: 'Wird gesendet...', success: '✅ Vielen Dank! Wir melden uns bald bei Ihnen.', error: '❌ Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' },
  fr: { sending: 'Envoi en cours...', success: '✅ Merci ! Nous vous contacterons bientôt.', error: '❌ Une erreur est survenue. Veuillez réessayer.' },
  it: { sending: 'Invio in corso...', success: '✅ Grazie! Ti contatteremo presto.', error: '❌ Si è verificato un errore. Riprova.' },
  uk: { sending: 'Надсилання...', success: '✅ Дякуємо! Незабаром ми зв’яжемося з вами.', error: '❌ Щось пішло не так. Спробуйте ще раз.' },
};
