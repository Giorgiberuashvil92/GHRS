import fs from 'fs';
import path from 'path';

const analyzeData = () => {
    const filePath = path.join('..', 'video links - orthopedics-com (1).json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let totalSets = 0;
    let totalVideos = 0;
    const categoryCounts: Record<string, {
        sets: number;
        videos: number;
        setDetails: Array<{
            name: string;
            videoCount: number;
            totalDuration?: string;
        }>;
    }> = {};
    
    // Analyze each category
    Object.keys(data).forEach(category => {
        if (Array.isArray(data[category])) {
            categoryCounts[category] = { sets: 0, videos: 0, setDetails: [] };
            let currentSetName = '';
            let currentSetVideos = 0;
            let currentSetDuration = '';
            
            data[category].forEach((item: any) => {
                if (!item) return; // Skip null entries
                
                // Check if this is a set header (handle both Video and Column1)
                const setName = item["Video "] || item["Column1"];
                if (setName && typeof setName === 'string' && 
                    (setName.toLowerCase().includes('set') || setName.toLowerCase().includes('group'))) {
                    if (currentSetName) {
                        categoryCounts[category].setDetails.push({
                            name: currentSetName,
                            videoCount: currentSetVideos,
                            totalDuration: currentSetDuration
                        });
                    }
                    currentSetName = setName;
                    currentSetVideos = 0;
                    currentSetDuration = '';
                    totalSets++;
                    categoryCounts[category].sets++;
                }
                
                // Count videos (only HD resolution to avoid counting duplicates)
                const videoNum = item["Video "] || item["Column1"];
                const videoUrl = item["Column2"];
                if (typeof videoNum === 'number' && 
                    videoUrl && 
                    videoUrl.includes('1080')) {
                    totalVideos++;
                    currentSetVideos++;
                    categoryCounts[category].videos++;
                }

                // Track total duration if available
                if (item["Column9"] && typeof item["Column9"] === 'string') {
                    currentSetDuration = item["Column9"];
                }
            });
            
            // Add the last set if exists
            if (currentSetName) {
                categoryCounts[category].setDetails.push({
                    name: currentSetName,
                    videoCount: currentSetVideos,
                    totalDuration: currentSetDuration
                });
            }
        }
    });
    
    Object.keys(categoryCounts).forEach(category => {
        categoryCounts[category].setDetails.forEach(set => {
            const duration = set.totalDuration ? ` (Duration: ${set.totalDuration})` : '';
        });
    });
}

analyzeData(); 