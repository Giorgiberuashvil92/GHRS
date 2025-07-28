import { Video } from "../types/category";

interface VideoListProps {
  videos: Video[];
  selectedVideo: number | null;
  onVideoSelect: (index: number) => void;
}

const VideoList = ({ videos, selectedVideo, onVideoSelect }: VideoListProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">ვიდეოები</h3>
      <div className="space-y-2">
        {videos.map((video, index) => (
          <button
            key={video._id}
            onClick={() => onVideoSelect(index)}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
              selectedVideo === index
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="font-medium">{video.title}</div>
            {video.duration && (
              <div className="text-sm text-gray-500">
                {Math.floor(video.duration / 60)}:
                {(video.duration % 60).toString().padStart(2, "0")}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoList; 