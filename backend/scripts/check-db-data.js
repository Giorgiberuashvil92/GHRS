const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db';

async function checkDBData() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    const db = client.db('grs-db');
    
    console.log('✅ Connected successfully!');
    
    // Check collections
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Collections:', collections.map(c => c.name));
    
    // Check categories
    const categories = await db.collection('categories').find({}).toArray();
    console.log('\n🏷️ Categories:');
    console.log(`   Count: ${categories.length}`);
    if (categories.length > 0) {
      categories.forEach((cat, i) => {
        console.log(`   ${i + 1}. ${cat.name?.ka || cat.name?.ru || 'No name'} (ID: ${cat._id})`);
      });
    }
    
    // Check sets
    const sets = await db.collection('sets').find({}).toArray();
    console.log('\n📦 Sets:');
    console.log(`   Count: ${sets.length}`);
    if (sets.length > 0) {
      sets.slice(0, 5).forEach((set, i) => {
        console.log(`   ${i + 1}. ${set.name?.ka || set.name?.ru || 'No name'} (ID: ${set._id})`);
      });
      if (sets.length > 5) {
        console.log(`   ... and ${sets.length - 5} more`);
      }
    }
    
    // Check exercises
    const exercises = await db.collection('exercises').find({}).toArray();
    console.log('\n🏃 Exercises:');
    console.log(`   Count: ${exercises.length}`);
    if (exercises.length > 0) {
      exercises.slice(0, 5).forEach((ex, i) => {
        console.log(`   ${i + 1}. ${ex.name?.ka || ex.name?.ru || 'No name'} (ID: ${ex._id})`);
      });
      if (exercises.length > 5) {
        console.log(`   ... and ${exercises.length - 5} more`);
      }
    }
    
    // Check users
    const users = await db.collection('users').find({}).toArray();
    console.log('\n👥 Users:');
    console.log(`   Count: ${users.length}`);
    
    console.log('\n🎯 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Sets: ${sets.length}`);
    console.log(`   Exercises: ${exercises.length}`);
    console.log(`   Users: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkDBData(); 