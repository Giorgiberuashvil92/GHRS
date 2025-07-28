import mongoose from 'mongoose';

async function checkCollections() {
  try {
    await mongoose.connect('mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db');

    // მივიღოთ ყველა კოლექცია
    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      const count = await collection.countDocuments();
      
      if (count > 0) {
        // ვაჩვენოთ პირველი დოკუმენტის მაგალითი
        const sample = await collection.findOne();
      }
    }

  } catch (error) {
    console.error('შეცდომა:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkCollections(); 