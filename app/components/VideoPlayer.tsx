import { Video } from "../types/category";

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  return (
    <div>
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <video
          src={video.url}
          controls
          className="rounded-lg w-full h-full object-cover"
          poster={video.thumbnail}
        />
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
        <p className="text-gray-600">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoPlayer; 