import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { PostActions } from "../post/PostActions";
import { PostMedia } from "../post/PostMedia";
import { CommentList } from "../comments/CommentList";
import type { Post } from "@/types/social";
import { formatDistanceToNow } from "date-fns";

interface FeedItemProps {
  post: Post;
  onUpdate: () => void;
}

export const FeedItem = ({ post, onUpdate }: FeedItemProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-4 rounded-lg border shadow-sm"
    >
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={post.profiles?.avatar_url || undefined} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {post.profiles?.full_name || "Anonymous"}
            </span>
            <span className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
          
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="mt-3">
              <PostMedia 
                mediaUrls={post.media_urls} 
                mediaMetadata={post.media_metadata}
              />
            </div>
          )}

          <div className="mt-4">
            <PostActions
              post={post}
              onUpdate={onUpdate}
              onCommentToggle={() => setShowComments(!showComments)}
            />
          </div>

          {showComments && (
            <div className="mt-4">
              <CommentList
                postId={post.id}
                comments={post.comments || []}
                onCommentAdded={onUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};