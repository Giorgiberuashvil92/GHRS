import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// წავიკითხოთ არსებული JSON
const rawData = JSON.parse(
  readFileSync(join(process.cwd(), 'scripts', 'video-links.json'), 'utf8')
);

// სტრუქტურა სეტებისთვის
const sets = [];
let currentSet = null;
let currentVideos = [];
let isHDResolution = true;

// დავამუშაოთ თითოეული ჩანაწერი
for (const row of rawData) {
  // ახალი სეტის დასაწყისი
  if (row.__EMPTY_9 && row.__EMPTY_9.includes('ghrs-group.com/rehab/')) {
    // თუ უკვე გვაქვს სეტი, დავამატოთ მასივში
    if (currentSet) {
      currentSet.videos = currentVideos;
      sets.push(currentSet);
      currentVideos = [];
    }

    // შევქმნათ ახალი სეტი
    currentSet = {
      title: row.__EMPTY_11,
      shortTitle: row.__EMPTY_10,
      description: row.__EMPTY_12,
      url: row.__EMPTY_9,
      articleUrl: row.__EMPTY_15,
      snippet: row.__EMPTY_13,
      videos: [],
      requiredAccessories: '',
      generalInstructions: []
    };
    continue;
  }

  // აქსესუარების ინფორმაცია
  if (row.__EMPTY_12 && row.__EMPTY_12.includes('REQUIRED ACCESSORIES:')) {
    if (currentSet) {
      currentSet.requiredAccessories = row.__EMPTY_12.replace('REQUIRED ACCESSORIES: ', '');
    }
    continue;
  }

  // ზოგადი ინსტრუქციები
  if (row.__EMPTY_12 && row.__EMPTY_12.includes('GENERAL INSTRUCTIONS')) {
    continue;
  }

  if (row.__EMPTY_12 && row.__EMPTY_12.includes('·')) {
    if (currentSet) {
      currentSet.generalInstructions.push(
        row.__EMPTY_12.replace('     · ', '').trim()
      );
    }
    continue;
  }

  // რეზოლუციის შემოწმება
  if (row.Video === 'resolution HD' || row.__EMPTY === 'resolution HD') {
    isHDResolution = true;
    continue;
  }
  if (row.Video === 'resolution SD' || row.__EMPTY === 'resolution SD') {
    isHDResolution = false;
    continue;
  }

  // ვიდეოს ინფორმაცია
  if (row.__EMPTY && row.__EMPTY.includes('ghrs-group.com/vid/')) {
    const videoNumber = row.Video;
    const url = row.__EMPTY;
    const duration = row.__EMPTY_6;

    // ვიდეოს სახელის პარსინგი
    const videoNameMatch = url.match(/(\d+\.\d+\.\d+\.\d+)\.m4v$/);
    if (videoNameMatch) {
      const [, sequence] = videoNameMatch;
      const [category, subcategory, set, video] = sequence.split('.');
      
      const videoInfo = {
        number: videoNumber,
        sequence,
        category,
        subcategory,
        set,
        video,
        url,
        duration,
        resolution: isHDResolution ? '1080p' : '720p'
      };

      currentVideos.push(videoInfo);
    }
  }
}

// დავამატოთ ბოლო სეტი
if (currentSet) {
  currentSet.videos = currentVideos;
  sets.push(currentSet);
}

// შევინახოთ სტრუქტურირებული მონაცემები
const structuredData = {
  category: "Orthopedics",
  subcategory: "Cervical Spine Problems",
  sets
};

// გამოვთვალოთ სტატისტიკა
const totalSets = sets.length;
const videosByResolution = sets.reduce((acc, set) => {
  set.videos.forEach(video => {
    acc[video.resolution] = (acc[video.resolution] || 0) + 1;
  });
  return acc;
}, {});

console.log('\nსტატისტიკა:');
console.log(`სულ სეტების რაოდენობა: ${totalSets}`);
console.log('ვიდეოების რაოდენობა რეზოლუციების მიხედვით:');
Object.entries(videosByResolution).forEach(([resolution, count]) => {
  console.log(`- ${resolution}: ${count} ვიდეო`);
});

writeFileSync(
  join(process.cwd(), 'scripts', 'structured-video-data.json'),
  JSON.stringify(structuredData, null, 2)
);

console.log('\nმონაცემები წარმატებით დასტრუქტურირდა!'); 