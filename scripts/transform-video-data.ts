import fs from 'fs';
import path from 'path';

interface VideoData {
  categoryCode: string;
  setCode: string;
  videoNumber: number;
  title: string;
  description?: string;
  duration: string;
  hdUrl: string;
  sdUrl: string;
  instructions?: string;
}

interface SetData {
  categoryCode: string;
  setCode: string;
  title: string;
  shortTitle: string;
  description?: string;
  totalDuration: string;
  videoCount: number;
  requiredAccessories?: string[];
  generalInstructions?: string[];
  url?: string;
  articleUrl?: string;
}

const transformData = () => {
  const filePath = path.join('..', 'video links - orthopedics-com (1).json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const videos: VideoData[] = [];
  const sets: SetData[] = [];

  Object.entries(data).forEach(([categoryCode, categoryData]: [string, any]) => {
    if (!Array.isArray(categoryData)) return;

    let currentSet: Partial<SetData> | null = null;
    let currentSetVideos: VideoData[] = [];

    categoryData.forEach((item: any) => {
      if (!item) return;

      // სეტის დასაწყისის შემოწმება
      const setName = item["Video "] || item["Column1"];
      if (setName && typeof setName === 'string' && 
          (setName.toLowerCase().includes('set') || setName.toLowerCase().includes('group'))) {
        
        // წინა სეტის შენახვა
        if (currentSet && currentSetVideos.length > 0) {
          sets.push({
            ...currentSet as SetData,
            videoCount: currentSetVideos.length,
            totalDuration: currentSetVideos[currentSetVideos.length - 1].duration || '00:00:00'
          });
          videos.push(...currentSetVideos);
        }

        // ახალი სეტის ინიციალიზაცია
        currentSet = {
          categoryCode,
          setCode: setName,
          title: item["Column13"] || item["Title to display on the set's page"] || setName,
          shortTitle: item["Column12"] || item["Short title for receipt, bill, cheque"] || setName,
          description: item["Column14"] || item["Description"],
          url: item["Column15"] || item["Snippet "],
          articleUrl: item["Column17"] || item["Article "],
          requiredAccessories: [],
          generalInstructions: []
        };
        currentSetVideos = [];
      }

      // აქსესუარების და ინსტრუქციების შეგროვება
      if (currentSet && item["Column14"]) {
        if (item["Column14"].includes('REQUIRED ACCESSORIES:')) {
          currentSet.requiredAccessories = [item["Column14"].replace('REQUIRED ACCESSORIES:', '').trim()];
        } else if (item["Column14"].includes('GENERAL INSTRUCTIONS')) {
          currentSet.generalInstructions = [item["Column14"]];
        }
      }

      // ვიდეოს ინფორმაციის შეგროვება
      const videoNum = item["Video "] || item["Column1"];
      const videoUrl = item["Column2"];
      if (typeof videoNum === 'number' && videoUrl && videoUrl.includes('1080')) {
        const videoData: VideoData = {
          categoryCode,
          setCode: currentSet?.setCode || '',
          videoNumber: videoNum,
          title: item["Column15"] || '',
          description: item["Column14"] || '',
          duration: item["Column8"] || '00:00:00',
          hdUrl: videoUrl,
          sdUrl: videoUrl.replace('/1080/', '/720/'),
          instructions: item["Column14"] || ''
        };
        currentSetVideos.push(videoData);
      }
    });

    // ბოლო სეტის შენახვა
    if (currentSet && currentSetVideos.length > 0) {
      sets.push({
        ...currentSet as SetData,
        videoCount: currentSetVideos.length,
        totalDuration: currentSetVideos[currentSetVideos.length - 1].duration || '00:00:00'
      });
      videos.push(...currentSetVideos);
    }
  });

  // შედეგების შენახვა
  fs.writeFileSync('structured-video-data.json', JSON.stringify({
    sets,
    videos
  }, null, 2));

}

transformData(); 