import { Post } from "@/types/social";
import { FileViewer } from "./FileViewer";

interface PostContentProps {
  post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
  console.log('PostContent received post:', post); // Debug log
  console.log('Media URLs:', post.media_urls); // Debug log
  console.log('Media metadata:', post.media_metadata); // Debug log

  return (
    <div className="space-y-4">
      {post.content && (
        <p className="whitespace-pre-wrap break-words">{post.content}</p>
      )}
      {post.media_urls && post.media_urls.length > 0 && (
        <FileViewer 
          urls={post.media_urls} 
          metadata={post.media_metadata}
        />
      )}
    </div>
  );
};