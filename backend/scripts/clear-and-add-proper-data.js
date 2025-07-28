const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db';

// Main categories with proper structure
const mainCategories = [
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
    sortOrder: 1,
    parentId: null,
    subcategories: []
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
    sortOrder: 2,
    parentId: null,
    subcategories: []
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
    sortOrder: 3,
    parentId: null,
    subcategories: []
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
    sortOrder: 4,
    parentId: null,
    subcategories: []
  }
];

async function clearAndAddProperData() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    const db = client.db('grs-db');
    
    console.log('✅ Connected successfully!');
    
    // Step 1: Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await db.collection('categories').deleteMany({});
    await db.collection('sets').deleteMany({});
    await db.collection('exercises').deleteMany({});
    console.log('   ✅ All non-user data cleared');
    
    // Step 2: Insert main categories
    console.log('\n📂 Adding main categories...');
    const categoryResult = await db.collection('categories').insertMany(mainCategories);
    const categoryIds = Object.values(categoryResult.insertedIds);
    console.log(`   ✅ Added ${categoryIds.length} main categories`);
    
    // Step 3: Create subcategories with proper parent references
    console.log('\n📁 Adding subcategories...');
    
    // Subcategories for ორთოპედია (index 0)
    const orthopedicSubcategories = [
      {
        name: {
          ka: "ზურგის პრობლემები",
          en: "Back Problems",
          ru: "Проблемы спины"
        },
        description: {
          ka: "ზურგის ტკივილი და კუნთოვანი დისბალანსი",
          en: "Back pain and muscle imbalance",
          ru: "Боли в спине и мышечный дисбаланс"
        },
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        isActive: true,
        isPublished: true,
        sortOrder: 1,
        parentId: categoryIds[0], // ორთოპედია
        subcategories: []
      },
      {
        name: {
          ka: "სახსრების პრობლემები",
          en: "Joint Problems", 
          ru: "Проблемы суставов"
        },
        description: {
          ka: "მუხლის, მხრის და სხვა სახსრების აღდგენა",
          en: "Knee, shoulder and other joint recovery",
          ru: "Восстановление колена, плеча и других суставов"
        },
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
        isActive: true,
        isPublished: true,
        sortOrder: 2,
        parentId: categoryIds[0], // ორთოპედია
        subcategories: []
      }
    ];
    
    // Subcategories for ნევროლოგია (index 1)
    const neurologySubcategories = [
      {
        name: {
          ka: "ინსულტის შემდგომი რეაბილიტაცია",
          en: "Post-Stroke Rehabilitation",
          ru: "Реабилитация после инсульта"
        },
        description: {
          ka: "ინსულტის შემდეგ მოძრაობითი ფუნქციების აღდგენა",
          en: "Recovery of motor functions after stroke",
          ru: "Восстановление двигательных функций после инсульта"
        },
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500",
        isActive: true,
        isPublished: true,
        sortOrder: 1,
        parentId: categoryIds[1], // ნევროლოგია
        subcategories: []
      },
      {
        name: {
          ka: "კოგნიტური რეაბილიტაცია",
          en: "Cognitive Rehabilitation",
          ru: "Когнитивная реабилитация"
        },
        description: {
          ka: "მეხსიერების და ყურადღების აღდგენა",
          en: "Memory and attention recovery",
          ru: "Восстановление памяти и внимания"
        },
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500",
        isActive: true,
        isPublished: true,
        sortOrder: 2,
        parentId: categoryIds[1], // ნევროლოგია
        subcategories: []
      }
    ];
    
    // Insert subcategories
    const orthopedicSubcatResult = await db.collection('categories').insertMany(orthopedicSubcategories);
    const neurologySubcatResult = await db.collection('categories').insertMany(neurologySubcategories);
    
    const orthopedicSubcatIds = Object.values(orthopedicSubcatResult.insertedIds);
    const neurologySubcatIds = Object.values(neurologySubcatResult.insertedIds);
    const allSubcategoryIds = [...orthopedicSubcatIds, ...neurologySubcatIds];
    
    console.log(`   ✅ Added ${orthopedicSubcatIds.length} subcategories to ორთოპედია`);
    console.log(`   ✅ Added ${neurologySubcatIds.length} subcategories to ნევროლოგია`);
    
    // Update main categories with subcategory references
    await db.collection('categories').updateOne(
      { _id: categoryIds[0] },
      { $set: { subcategories: orthopedicSubcatIds } }
    );
    
    await db.collection('categories').updateOne(
      { _id: categoryIds[1] },
      { $set: { subcategories: neurologySubcatIds } }
    );
    
    console.log('   ✅ Updated main categories with subcategory references');
    
    // Step 4: Create sets with proper category/subcategory links
    console.log('\n📦 Adding sets...');
    
    const setsData = [
      // Sets for main categories without subcategories
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
        price: { monthly: 20, threeMonths: 50, sixMonths: 90, yearly: 150 },
        categoryId: categoryIds[2].toString(), // კარდიოლოგია
        subCategoryId: null,
        isActive: true,
        isPublished: true,
        sortOrder: 1
      },
      {
        name: { ka: "სუნთქვითი ვარჯიშები", en: "Breathing Exercises", ru: "Дыхательные упражнения" },
        description: { ka: "ფილტვების მუშაობის გაუმჯობესება", en: "Improving lung function", ru: "Улучшение функции легких" },
        thumbnailImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        totalExercises: 8,
        totalDuration: "25:00",
        difficultyLevels: 3,
        levels: {
          beginner: { exerciseCount: 3, isLocked: false },
          intermediate: { exerciseCount: 3, isLocked: true },
          advanced: { exerciseCount: 2, isLocked: true }
        },
        price: { monthly: 25, threeMonths: 60, sixMonths: 110, yearly: 180 },
        categoryId: categoryIds[3].toString(), // რესპირატორული რეაბილიტაცია
        subCategoryId: null,
        isActive: true,
        isPublished: true,
        sortOrder: 1
      },
      // Sets for subcategories
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
        price: { monthly: 25, threeMonths: 65, sixMonths: 120, yearly: 200 },
        categoryId: categoryIds[0].toString(), // ორთოპედია
        subCategoryId: orthopedicSubcatIds[0].toString(), // ზურგის პრობლემები
        isActive: true,
        isPublished: true,
        sortOrder: 1
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
        price: { monthly: 30, threeMonths: 75, sixMonths: 140, yearly: 250 },
        categoryId: categoryIds[0].toString(), // ორთოპედია
        subCategoryId: orthopedicSubcatIds[1].toString(), // სახსრების პრობლემები
        isActive: true,
        isPublished: true,
        sortOrder: 2
      },
      {
        name: { ka: "ინსულტის შემდგომი ვარჯიშები", en: "Post-Stroke Exercises", ru: "Упражнения после инсульта" },
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
        price: { monthly: 35, threeMonths: 85, sixMonths: 160, yearly: 280 },
        categoryId: categoryIds[1].toString(), // ნევროლოგია
        subCategoryId: neurologySubcatIds[0].toString(), // ინსულტის შემდგომი რეაბილიტაცია
        isActive: true,
        isPublished: true,
        sortOrder: 1
      }
    ];
    
    const setResult = await db.collection('sets').insertMany(setsData);
    const setIds = Object.values(setResult.insertedIds);
    console.log(`   ✅ Added ${setIds.length} sets with proper category/subcategory links`);
    
    // Step 5: Create exercises linked to sets
    console.log('\n🏃 Adding exercises...');
    
    const exercisesData = [
      // Exercise for კარდიოლოგია set
      {
        name: { ka: "გულის დატვირთვა", en: "Cardio Load", ru: "Нагрузка на сердце" },
        description: { ka: "გულის რიტმის კონტროლირებული ვარჯიში", en: "Controlled heart rate exercise", ru: "Упражнение с контролируемым сердечным ритмом" },
        recommendations: { ka: "პულსს აკონტროლეთ ვარჯიშის დროს", en: "Monitor your pulse during exercise", ru: "Контролируйте пульс во время упражнения" },
        videoUrl: "https://www.youtube.com/watch?v=example1",
        thumbnailUrl: "https://images.unsplash.com/photo-1628348068343-c6a848d2d497?w=500",
        videoDuration: "4:00",
        duration: "4:00",
        difficulty: "easy",
        repetitions: "5-10",
        sets: "2",
        restTime: "60 წამი",
        isActive: true,
        isPublished: true,
        sortOrder: 1,
        setId: setIds[0].toString(), // გულის ჯანმრთელობა
        categoryId: categoryIds[2].toString(), // კარდიოლოგია
        subCategoryId: null
      },
      // Exercise for ზურგის პრობლემები subcategory
      {
        name: { ka: "კატის პოზა", en: "Cat Pose", ru: "Поза кошки" },
        description: { ka: "ზურგის მოქნილობის გასაუმჯობესებელი ვარჯიში", en: "Exercise to improve back flexibility", ru: "Упражнение для улучшения гибкости спины" },
        recommendations: { ka: "ნელა შეასრულეთ, ჩქარი მოძრაობები ტკივილს გამოიწვევს", en: "Perform slowly, fast movements may cause pain", ru: "Выполняйте медленно, быстрые движения могут вызвать боль" },
        videoUrl: "https://www.youtube.com/watch?v=example2",
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
        setId: setIds[2].toString(), // ზურგის ტკივილის აღმოფხვრა
        categoryId: categoryIds[0].toString(), // ორთოპედია
        subCategoryId: orthopedicSubcatIds[0].toString() // ზურგის პრობლემები
      },
      // Exercise for სახსრების პრობლემები subcategory
      {
        name: { ka: "მუხლის გაშლა", en: "Knee Extension", ru: "Разгибание колена" },
        description: { ka: "მუხლის კუნთების გამაგრება", en: "Strengthening knee muscles", ru: "Укрепление мышц колена" },
        recommendations: { ka: "იფიქრეთ სწორ ტექნიკაზე, არა რაოდენობაზე", en: "Focus on proper technique, not quantity", ru: "Сосредоточьтесь на правильной технике, а не на количестве" },
        videoUrl: "https://www.youtube.com/watch?v=example3",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
        videoDuration: "2:30",
        duration: "2:30", 
        difficulty: "medium",
        repetitions: "8-12",
        sets: "3",
        restTime: "45 წამი",
        isActive: true,
        isPublished: true,
        sortOrder: 1,
        setId: setIds[3].toString(), // მუხლის რეაბილიტაცია
        categoryId: categoryIds[0].toString(), // ორთოპედია
        subCategoryId: orthopedicSubcatIds[1].toString() // სახსრების პრობლემები
      },
      // Exercise for ინსულტის შემდგომი რეაბილიტაცია subcategory
      {
        name: { ka: "ხელის მოძრაობები", en: "Arm Movements", ru: "Движения рук" },
        description: { ka: "ინსულტის შემდეგ ხელის ფუნქციების აღდგენა", en: "Restoring arm function after stroke", ru: "Восстановление функции руки после инсульта" },
        recommendations: { ka: "ყოველდღიური პრაქტიკა შედეგს მოგიტანთ", en: "Daily practice will bring results", ru: "Ежедневная практика принесет результаты" },
        videoUrl: "https://www.youtube.com/watch?v=example4",
        thumbnailUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500",
        videoDuration: "5:00",
        duration: "5:00",
        difficulty: "easy",
        repetitions: "15-20",
        sets: "4",
        restTime: "60 წამი",
        isActive: true,
        isPublished: true,
        sortOrder: 1,
        setId: setIds[4].toString(), // ინსულტის შემდგომი ვარჯიშები
        categoryId: categoryIds[1].toString(), // ნევროლოგია
        subCategoryId: neurologySubcatIds[0].toString() // ინსულტის შემდგომი რეაბილიტაცია
      }
    ];
    
    const exerciseResult = await db.collection('exercises').insertMany(exercisesData);
    console.log(`   ✅ Added ${Object.keys(exerciseResult.insertedIds).length} exercises`);
    
    // Final summary with relationships
    console.log('\n🎉 Proper hierarchical data structure created successfully!');
    console.log(`   📂 Main Categories: ${categoryIds.length}`);
    console.log(`   📁 Subcategories: ${allSubcategoryIds.length}`);
    console.log(`   📦 Sets: ${setIds.length}`);
    console.log(`   🏃 Exercises: ${Object.keys(exerciseResult.insertedIds).length}`);
    
    console.log('\n🔗 Data Structure with Relationships:');
    console.log('   ├── ორთოპედია (main category)');
    console.log('   │   ├── ზურგის პრობლემები (subcategory) → parentId: ორთოპედია');
    console.log('   │   │   └── ზურგის ტკივილის აღმოფხვრა (set) → categoryId: ორთოპედია, subCategoryId: ზურგის პრობლემები');
    console.log('   │   │       └── კატის პოზა (exercise)');
    console.log('   │   └── სახსრების პრობლემები (subcategory) → parentId: ორთოპედია');
    console.log('   │       └── მუხლის რეაბილიტაცია (set) → categoryId: ორთოპედია, subCategoryId: სახსრების პრობლემები');
    console.log('   │           └── მუხლის გაშლა (exercise)');
    console.log('   ├── ნევროლოგია (main category)');
    console.log('   │   ├── ინსულტის შემდგომი რეაბილიტაცია (subcategory) → parentId: ნევროლოგია');
    console.log('   │   │   └── ინსულტის შემდგომი ვარჯიშები (set) → categoryId: ნევროლოგია, subCategoryId: ინსულტის შემდგომი რეაბილიტაცია');
    console.log('   │   │       └── ხელის მოძრაობები (exercise)');
    console.log('   │   └── კოგნიტური რეაბილიტაცია (subcategory) → parentId: ნევროლოგია');
    console.log('   ├── კარდიოლოგია (main category, no subcategories)');
    console.log('   │   └── გულის ჯანმრთელობა (set) → categoryId: კარდიოლოგია, subCategoryId: null');
    console.log('   │       └── გულის დატვირთვა (exercise)');
    console.log('   └── რესპირატორული რეაბილიტაცია (main category, no subcategories)');
    console.log('       └── სუნთქვითი ვარჯიშები (set) → categoryId: რესპირატორული რეაბილიტაცია, subCategoryId: null');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

clearAndAddProperData(); 