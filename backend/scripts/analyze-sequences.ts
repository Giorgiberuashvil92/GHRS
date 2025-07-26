import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your_mongodb_url';

interface Video {
  categoryCode: string;
  setId: string;
  sequence: string;
}

async function analyzeSequences() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  try {
    const videos = await db.collection<Video>('videos').find({}).toArray();

    // დაჯგუფება კატეგორიების მიხედვით
    const videosByCategory = videos.reduce<Record<string, Video[]>>(
      (acc, video) => {
        const categoryCode = video.categoryCode;
        if (!acc[categoryCode]) {
          acc[categoryCode] = [];
        }
        acc[categoryCode].push(video);
        return acc;
      },
      {},
    );

    // sequence-ების ანალიზი თითოეული კატეგორიისთვის
    for (const categoryCode in videosByCategory) {
      const categoryVideos = videosByCategory[categoryCode];


      // sequence-ების დაჯგუფება პირველი ორი ნომრის მიხედვით (მაგ: "2.1" from "2.1.1.2")
      const subcategoryGroups = categoryVideos.reduce<Record<string, Video[]>>(
        (acc, video) => {
          const subcategoryPrefix = video.sequence
            .split('.')
            .slice(0, 2)
            .join('.');
          if (!acc[subcategoryPrefix]) {
            acc[subcategoryPrefix] = [];
          }
          acc[subcategoryPrefix].push(video);
          return acc;
        },
        {},
      );

      // სუბკატეგორიების ანალიზი
      for (const prefix in subcategoryGroups) {
        const videos = subcategoryGroups[prefix];

        // sequence-ების დეტალური ანალიზი
        const uniquePatterns = new Set(
          videos.map((v) => {
            const parts = v.sequence.split('.');
            return `${parts.length} parts: ${v.sequence}`;
          }),
        );

      }
    }
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  } finally {
    await client.close();
  }
}

analyzeSequences().catch(console.error);
