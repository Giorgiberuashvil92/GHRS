// Test shortcode processing
const testShortcode = '[su_youtube url="https://youtu.be/LXTwapf_dOE?list=PLrfnv4q8b1j68WHDc5SyJQ3dZc3acMd2Z" width="900" height="600"title="Комплекс упражнений для реабилитации  шейного отдела позвоночника"]';

// Simulate the processing function
function processShortcodes(content) {
  return content.replace(
    /\[su_youtube\s+([^\]]+)\]/g,
    (match, attributes) => {
      console.log('Match found:', match);
      console.log('Attributes:', attributes);
      
      // Parse attributes using a more flexible approach
      const urlMatch = attributes.match(/url=["']([^"']+)["']/);
      const widthMatch = attributes.match(/width=["']?(\d+)["']?/);
      const heightMatch = attributes.match(/height=["']?(\d+)["']?/);
      const titleMatch = attributes.match(/title=["']([^"']*)["']/);
      
      console.log('URL match:', urlMatch);
      console.log('Width match:', widthMatch);
      console.log('Height match:', heightMatch);
      console.log('Title match:', titleMatch);
      
      if (!urlMatch) return match; // Return original if no URL found
      
      const url = urlMatch[1];
      const width = widthMatch ? widthMatch[1] : '560';
      const height = heightMatch ? heightMatch[1] : '315';
      const title = titleMatch ? titleMatch[1] : '';
      
      console.log('Parsed values:', { url, width, height, title });
      
      // Extract video ID from various YouTube URL formats
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const matchResult = url.match(youtubeRegex);
      
      console.log('Video ID match:', matchResult);
      
      if (matchResult) {
        const videoId = matchResult[1];
        return `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" width="${width}" height="${height}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
      
      return match; // Return original if can't parse
    }
  );
}

console.log('Original:', testShortcode);
console.log('Processed:', processShortcodes(testShortcode)); 