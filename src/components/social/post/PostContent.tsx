import { Post } from "@/types/social";
import { FileViewer } from "./FileViewer";

interface PostContentProps {
  post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
  // Determine file types from media_urls
  const fileTypes = post.media_urls?.map(url => {
    if (!url) return 'other';
    const extension = url.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
    if (['pdf'].includes(extension)) return 'pdf';
    return 'other';
  }) || [];

  return (
    <div className="space-y-4">
      <p className="whitespace-pre-wrap break-words">{post.content}</p>
      {post.media_urls && post.media_urls.length > 0 && (
        <FileViewer 
          urls={post.media_urls} 
          fileTypes={fileTypes}
          metadata={post.media_metadata}
        />
      )}
    </div>
  );
};