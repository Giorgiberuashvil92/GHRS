import mongoose from 'mongoose';
import { config } from 'dotenv';

const MONGODB_URI = 'mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db';


// Article schema
const articleSchema = new mongoose.Schema({
  title: {
    ka: String,
    en: String,
    ru: String,
  },
  excerpt: {
    ka: String,
    en: String,
    ru: String,
  },
  content: {
    ka: String,
    en: String,
    ru: String,
  },
  categoryId: String,
  blogId: String,
  readTime: String,
  commentsCount: Number,
  tableOfContents: [{
    title: {
      ka: String,
      en: String,
      ru: String,
    },
    anchor: String,
  }],
});

const Article = mongoose.model('Article', articleSchema);

async function updateArticleContent() {
  try {
    await mongoose.connect(MONGODB_URI);

    const article = await Article.findById('688022e1a7a0d4f79d1a73cb');
    
    if (!article) {
      return;
    }

    // Update with more realistic content
    const newContent = {
      ka: `
        <section class="md:mt-[60px] mt-[40px]">
          <h2 class="text-lg mb-[30px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
            ფიზიკური აქტივობის მნიშვნელობა ჯანმრთელობისთვის
          </h2>
          <p class="text-lg mb-[30px] text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
            რეგულარული ფიზიკური აქტივობა წარმოადგენს ჯანმრთელი ცხოვრების წესის ერთ-ერთ უმნიშვნელოვანეს კომპონენტს. კვლევები აჩვენებს, რომ ყოველდღიური ვარჯიში მნიშვნელოვნად ამცირებს გულ-სისხლძარღვთა დაავადებების, დიაბეტის და სხვა ქრონიკული დაავადებების რისკს.
          </p>
          <div class="p-4 bg-[rgba(212,186,252,1)] rounded-[10px] items-center">
            <p class="text-lg text-[rgba(255,255,255,1)] md:leading-[100%] leading-[160%] tracking-[0%]">
              დღეში მინიმუმ 30 წუთიანი ზომიერი ფიზიკური აქტივობა მნიშვნელოვნად აუმჯობესებს ჯანმრთელობის მდგომარეობას.
            </p>
          </div>
        </section>
        <section class="md:mt-[60px] mt-[40px]">
          <h2 class="text-lg mb-[30px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
            ვარჯიშის სახეობები და მათი სარგებელი
          </h2>
          <ul class="list-disc pl-6 mb-6">
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              აერობული ვარჯიშები - აუმჯობესებს გულ-სისხლძარღვთა სისტემის მუშაობას
            </li>
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              ძალისმიერი ვარჯიშები - ზრდის კუნთოვან მასას და აძლიერებს ძვლებს
            </li>
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              მოქნილობაზე ვარჯიშები - აუმჯობესებს სახსრების მოძრაობას
            </li>
          </ul>
          <img class="max-w-full h-auto rounded-lg mb-6" src="/assets/images/exercise.jpg" alt="ვარჯიში" />
          <p class="text-lg text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
            მნიშვნელოვანია ვარჯიშის დაწყება თანდათანობით და ინტენსივობის ეტაპობრივი გაზრდა. ყოველთვის მოუსმინეთ საკუთარ სხეულს და საჭიროების შემთხვევაში გაიარეთ კონსულტაცია ექიმთან.
          </p>
        </section>
      `,
      en: `
        <section class="md:mt-[60px] mt-[40px]">
          <h2 class="text-lg mb-[30px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
            The Importance of Physical Activity for Health
          </h2>
          <p class="text-lg mb-[30px] text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
            Regular physical activity is one of the most important components of a healthy lifestyle. Studies show that daily exercise significantly reduces the risk of cardiovascular disease, diabetes, and other chronic conditions.
          </p>
          <div class="p-4 bg-[rgba(212,186,252,1)] rounded-[10px] items-center">
            <p class="text-lg text-[rgba(255,255,255,1)] md:leading-[100%] leading-[160%] tracking-[0%]">
              A minimum of 30 minutes of moderate physical activity per day significantly improves health conditions.
            </p>
          </div>
        </section>
        <section class="md:mt-[60px] mt-[40px]">
          <h2 class="text-lg mb-[30px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
            Types of Exercise and Their Benefits
          </h2>
          <ul class="list-disc pl-6 mb-6">
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              Aerobic exercises - improves cardiovascular system function
            </li>
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              Strength training - increases muscle mass and strengthens bones
            </li>
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              Flexibility exercises - improves joint mobility
            </li>
          </ul>
          <img class="max-w-full h-auto rounded-lg mb-6" src="/assets/images/exercise.jpg" alt="Exercise" />
          <p class="text-lg text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
            It's important to start exercising gradually and increase intensity step by step. Always listen to your body and consult with a doctor if needed.
          </p>
        </section>
      `,
      ru: `
        <section class="md:mt-[60px] mt-[40px]">
          <h2 class="text-lg mb-[30px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
            Важность физической активности для здоровья
          </h2>
          <p class="text-lg mb-[30px] text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
            Регулярная физическая активность является одним из важнейших компонентов здорового образа жизни. Исследования показывают, что ежедневные упражнения значительно снижают риск сердечно-сосудистых заболеваний, диабета и других хронических заболеваний.
          </p>
          <div class="p-4 bg-[rgba(212,186,252,1)] rounded-[10px] items-center">
            <p class="text-lg text-[rgba(255,255,255,1)] md:leading-[100%] leading-[160%] tracking-[0%]">
              Минимум 30 минут умеренной физической активности в день значительно улучшает состояние здоровья.
            </p>
          </div>
        </section>
        <section class="md:mt-[60px] mt-[40px]">
          <h2 class="text-lg mb-[30px] text-[rgba(61,51,74,1)] leading-[100%] tracking-[-1%]">
            Виды упражнений и их польза
          </h2>
          <ul class="list-disc pl-6 mb-6">
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              Аэробные упражнения - улучшают работу сердечно-сосудистой системы
            </li>
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              Силовые тренировки - увеличивают мышечную массу и укрепляют кости
            </li>
            <li class="text-lg text-[rgba(132,111,160,1)] mb-2">
              Упражнения на гибкость - улучшают подвижность суставов
            </li>
          </ul>
          <img class="max-w-full h-auto rounded-lg mb-6" src="/assets/images/exercise.jpg" alt="Упражнения" />
          <p class="text-lg text-[rgba(132,111,160,1)] md:leading-[140%] leading-[160%] tracking-[-1%]">
            Важно начинать тренировки постепенно и поэтапно увеличивать интенсивность. Всегда прислушивайтесь к своему телу и при необходимости консультируйтесь с врачом.
          </p>
        </section>
      `
    };

    // Update article content
    article.content = newContent;
    
    // Update title and excerpt
    article.title = {
      ka: "ფიზიკური აქტივობის მნიშვნელობა ჯანმრთელობისთვის",
      en: "The Importance of Physical Activity for Health",
      ru: "Важность физической активности для здоровья"
    };
    
    article.excerpt = {
      ka: "შეისწავლეთ ფიზიკური აქტივობის სარგებელი და მისი გავლენა ჯანმრთელობაზე",
      en: "Learn about the benefits of physical activity and its impact on health",
      ru: "Узнайте о пользе физической активности и ее влиянии на здоровье"
    };

    // Add table of contents
    article.tableOfContents = [
      {
        title: {
          ka: "ფიზიკური აქტივობის მნიშვნელობა ჯანმრთელობისთვის",
          en: "The Importance of Physical Activity for Health",
          ru: "Важность физической активности для здоровья"
        },
        anchor: "importance"
      },
      {
        title: {
          ka: "ვარჯიშის სახეობები და მათი სარგებელი",
          en: "Types of Exercise and Their Benefits",
          ru: "Виды упражнений и их польза"
        },
        anchor: "types"
      }
    ];

    await article.save();

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateArticleContent(); 