const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db';

// Sample categories with realistic medical/rehabilitation data
const sampleCategories = [
  {
    name: {
      ka: "ორთოპედია",
      en: "Orthopedics", 
      ru: "Ортопедия"
    },
    description: {
      ka: "ძვლების, სახსრების და კუნთების აღდგენითი ვარჯიშები",
      en: "Rehabilitative exercises for bones, joints and muscles",
      ru: "Восстановительные упражнения для костей, суставов и мышц"
    },
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
    isActive: true,
    isPublished: true,
    sortOrder: 1
  },
  {
    name: {
      ka: "ნევროლოგია", 
      en: "Neurology",
      ru: "Неврология"
    },
    description: {
      ka: "ნერვული სისტემის აღდგენითი თერაპია",
      en: "Nervous system rehabilitation therapy", 
      ru: "Восстановительная терапия нервной системы"
    },
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500",
    isActive: true,
    isPublished: true,
    sortOrder: 2
  },
  {
    name: {
      ka: "კარდიოლოგია",
      en: "Cardiology",
      ru: "Кардиология" 
    },
    description: {
      ka: "გულის ჯანმრთელობის გასაუმჯობესებელი ვარჯიშები",
      en: "Heart health improvement exercises",
      ru: "Упражнения для улучшения здоровья сердца"
    },
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2d497?w=500", 
    isActive: true,
    isPublished: true,
    sortOrder: 3
  },
  {
    name: {
      ka: "რესპირატორული რეაბილიტაცია",
      en: "Respiratory Rehabilitation",
      ru: "Респираторная реабилитация"
    },
    description: {
      ka: "სუნთქვის სისტემის აღდგენითი ვარჯიშები",
      en: "Respiratory system recovery exercises",
      ru: "Восстановительные упражнения дыхательной системы"
    },
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    isActive: true,
    isPublished: true,
    sortOrder: 4
  },
  {
    name: {
      ka: "ფსიქიატრია/ფსიქოლოგია", 
      en: "Psychiatry/Psychology",
      ru: "Психиатрия/Психология"
    },
    description: {
      ka: "ფსიქოლოგიური ჯანმრთელობის მხარდაჭერა",
      en: "Mental health support",
      ru: "Поддержка психического здоровья"
    },
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
    isActive: true,
    isPublished: true,
    sortOrder: 5
  }
];

// Sample sets for each category
const generateSampleSets = (categoryIds) => {
  const setsData = [
    {
      categoryIndex: 0, // Orthopedics
      sets: [
        {
          name: { ka: "ზურგის ტკივილის აღმოფხვრა", en: "Back Pain Relief", ru: "Облегчение боли в спине" },
          description: { ka: "ზურგის კუნთების გამაგრება და ტკივილის შემცირება", en: "Strengthen back muscles and reduce pain", ru: "Укрепление мышц спины и уменьшение боли" },
          thumbnailImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
          totalExercises: 8,
          totalDuration: "25:00",
          difficultyLevels: 3,
          levels: {
            beginner: { exerciseCount: 3, isLocked: false },
            intermediate: { exerciseCount: 3, isLocked: true },
            advanced: { exerciseCount: 2, isLocked: true }
          },
          price: { monthly: 25, threeMonths: 65, sixMonths: 120, yearly: 200 }
        },
        {
          name: { ka: "მუხლის რეაბილიტაცია", en: "Knee Rehabilitation", ru: "Реабилитация колена" },
          description: { ka: "მუხლის სახსრის აღდგენა ოპერაციის შემდეგ", en: "Knee joint recovery after surgery", ru: "Восстановление коленного сустава после операции" },
          thumbnailImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
          totalExercises: 10,
          totalDuration: "30:00",
          difficultyLevels: 3,
          levels: {
            beginner: { exerciseCount: 4, isLocked: false },
            intermediate: { exerciseCount: 4, isLocked: true },
            advanced: { exerciseCount: 2, isLocked: true }
          },
          price: { monthly: 30, threeMonths: 75, sixMonths: 140, yearly: 250 }
        }
      ]
    },
    {
      categoryIndex: 1, // Neurology
      sets: [
        {
          name: { ka: "ინსულტის შემდგომი რეაბილიტაცია", en: "Post-Stroke Rehabilitation", ru: "Реабилитация после инсульта" },
          description: { ka: "ინსულტის შემდეგ მოძრაობითი ფუნქციების აღდგენა", en: "Recovery of motor functions after stroke", ru: "Восстановление двигательных функций после инсульта" },
          thumbnailImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500",
          totalExercises: 12,
          totalDuration: "40:00",
          difficultyLevels: 3,
          levels: {
            beginner: { exerciseCount: 5, isLocked: false },
            intermediate: { exerciseCount: 4, isLocked: true },
            advanced: { exerciseCount: 3, isLocked: true }
          },
          price: { monthly: 35, threeMonths: 85, sixMonths: 160, yearly: 280 }
        }
      ]
    },
    {
      categoryIndex: 2, // Cardiology  
      sets: [
        {
          name: { ka: "გულის ჯანმრთელობა", en: "Heart Health", ru: "Здоровье сердца" },
          description: { ka: "გულის კუნთის გამაგრება და გამძლეობის გაზრდა", en: "Heart muscle strengthening and endurance building", ru: "Укрепление сердечной мышцы и повышение выносливости" },
          thumbnailImage: "https://images.unsplash.com/photo-1628348068343-c6a848d2d497?w=500",
          totalExercises: 6,
          totalDuration: "20:00", 
          difficultyLevels: 3,
          levels: {
            beginner: { exerciseCount: 2, isLocked: false },
            intermediate: { exerciseCount: 2, isLocked: true },
            advanced: { exerciseCount: 2, isLocked: true }
          },
          price: { monthly: 20, threeMonths: 50, sixMonths: 90, yearly: 150 }
        }
      ]
    }
  ];

  return setsData.flatMap(categoryData => 
    categoryData.sets.map(set => ({
      ...set,
      categoryId: categoryIds[categoryData.categoryIndex],
      isActive: true,
      isPublished: true,
      sortOrder: 1
    }))
  );
};

// Sample exercises
const generateSampleExercises = (categoryIds, setIds) => [
  // Back pain exercises
  {
    name: { ka: "კატის პოზა", en: "Cat Pose", ru: "Поза кошки" },
    description: { ka: "ზურგის მოქნილობის გასაუმჯობესებელი ვარჯიში", en: "Exercise to improve back flexibility", ru: "Упражнение для улучшения гибкости спины" },
    recommendations: { ka: "ნელა შეასრულეთ, ჩქარი მოძრაობები ტკივილს გამოიწვევს", en: "Perform slowly, fast movements may cause pain", ru: "Выполняйте медленно, быстрые движения могут вызвать боль" },
    videoUrl: "https://www.youtube.com/watch?v=example1",
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
    videoDuration: "3:00",
    duration: "3:00",
    difficulty: "easy",
    repetitions: "10-15",
    sets: "3",
    restTime: "30 წამი",
    isActive: true,
    isPublished: true,
    sortOrder: 1,
    setId: setIds[0],
    categoryId: categoryIds[0]
  },
  {
    name: { ka: "მუხლის გაშლა", en: "Knee Extension", ru: "Разгибание колена" },
    description: { ka: "მუხლის კუნთების გამაგრება", en: "Strengthening knee muscles", ru: "Укрепление мышц колена" },
    recommendations: { ka: "იფიქრეთ სწორ ტექნიკაზე, არა რაოდენობაზე", en: "Focus on proper technique, not quantity", ru: "Сосредоточьтесь на правильной технике, а не на количестве" },
    videoUrl: "https://www.youtube.com/watch?v=example2",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    videoDuration: "2:30",
    duration: "2:30", 
    difficulty: "medium",
    repetitions: "8-12",
    sets: "3",
    restTime: "45 წამი",
    isActive: true,
    isPublished: true,
    sortOrder: 2,
    setId: setIds[1],
    categoryId: categoryIds[0]
  },
  {
    name: { ka: "ხელის მოძრაობები", en: "Arm Movements", ru: "Движения рук" },
    description: { ka: "ინსულტის შემდეგ ხელის ფუნქციების აღდგენა", en: "Restoring arm function after stroke", ru: "Восстановление функции руки после инсульта" },
    recommendations: { ka: "ყოველდღიური პრაქტიკა შედეგს მოგიტანთ", en: "Daily practice will bring results", ru: "Ежедневная практика принесет результаты" },
    videoUrl: "https://www.youtube.com/watch?v=example3",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500",
    videoDuration: "5:00",
    duration: "5:00",
    difficulty: "easy",
    repetitions: "15-20",
    sets: "4",
    restTime: "60 წამი",
    isActive: true,
    isPublished: true,
    sortOrder: 3,
    setId: setIds[2],
    categoryId: categoryIds[1]
  }
];

async function addSampleData() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    const db = client.db('grs-db');
    
    console.log('✅ Connected successfully!');
    
    // Insert categories
    console.log('\n📂 Adding categories...');
    const categoryResult = await db.collection('categories').insertMany(sampleCategories);
    const categoryIds = Object.values(categoryResult.insertedIds).map(id => id.toString());
    console.log(`   ✅ Added ${categoryIds.length} categories`);
    
    // Insert sets
    console.log('\n📦 Adding sets...');
    const setsToInsert = generateSampleSets(categoryIds);
    const setResult = await db.collection('sets').insertMany(setsToInsert);
    const setIds = Object.values(setResult.insertedIds).map(id => id.toString());
    console.log(`   ✅ Added ${setIds.length} sets`);
    
    // Insert exercises
    console.log('\n🏃 Adding exercises...');
    const exercisesToInsert = generateSampleExercises(categoryIds, setIds);
    const exerciseResult = await db.collection('exercises').insertMany(exercisesToInsert);
    console.log(`   ✅ Added ${Object.keys(exerciseResult.insertedIds).length} exercises`);
    
    // Final summary
    console.log('\n🎉 Sample data added successfully!');
    console.log(`   📂 Categories: ${categoryIds.length}`);
    console.log(`   📦 Sets: ${setIds.length}`);
    console.log(`   🏃 Exercises: ${Object.keys(exerciseResult.insertedIds).length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

addSampleData(); 