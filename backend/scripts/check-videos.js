const { MongoClient } = require('mongodb');

async function checkVideos() {
  const client = new MongoClient('mongodb+srv://beruashvilig60:Berobero1234!@cluster0.dtwfws3.mongodb.net/grs-db');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('grs-db');
    const collections = await db.listCollections().toArray();
    
    console.log('Available collections:');
    collections.forEach(col => console.log('- ' + col.name));
    
    // Check Videos collection
    const videosCollection = db.collection('videos');
    const videoCount = await videosCollection.countDocuments();
    console.log(`\nVideos collection has ${videoCount} documents`);
    
    if (videoCount > 0) {
      const sampleVideo = await videosCollection.findOne();
      console.log('\nSample video structure:');
      console.log(JSON.stringify(sampleVideo, null, 2));
      
      // Get first 3 videos
      const videos = await videosCollection.find({}).limit(3).toArray();
      console.log(`\nFirst 3 videos:`);
      videos.forEach((video, index) => {
        console.log(`${index + 1}. ${video.title || video.name || 'No title'} - ID: ${video._id}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkVideos(); 