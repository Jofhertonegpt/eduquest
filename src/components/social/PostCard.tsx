import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, MessageSquare, Bookmark, User, Share2, ExternalLink, 
  FileText, Download, Film, Music, Image, File, Code,
  Archive, Database, Globe, Book, Presentation, Table
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Post } from "@/types/social";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: Post;
  onLike: (postId: string, action: 'like' | 'unlike') => void;
  onBookmark: (postId: string, action: 'bookmark' | 'unbookmark') => void;
  onCommentClick: (post: Post) => void;
  onProfileClick: (userId: string) => void;
  isLikeLoading?: boolean;
  isBookmarkLoading?: boolean;
}

const fileTypeIcons: Record<string, any> = {
  // Documents
  'pdf': FileText,
  'doc': FileText,
  'docx': FileText,
  'txt': FileText,
  'rtf': FileText,
  'odt': FileText,
  // Images
  'jpg': Image,
  'jpeg': Image,
  'png': Image,
  'gif': Image,
  'webp': Image,
  'svg': Image,
  'bmp': Image,
  // Video
  'mp4': Film,
  'webm': Film,
  'avi': Film,
  'mov': Film,
  'wmv': Film,
  'flv': Film,
  // Audio
  'mp3': Music,
  'wav': Music,
  'ogg': Music,
  'aac': Music,
  'm4a': Music,
  // Code
  'json': Code,
  'xml': Code,
  'html': Code,
  'css': Code,
  'js': Code,
  'ts': Code,
  // Archives
  'zip': Archive,
  'rar': Archive,
  '7z': Archive,
  // Data
  'csv': Table,
  'xlsx': Table,
  'xls': Table,
  // Presentations
  'ppt': Presentation,
  'pptx': Presentation,
  'odp': Presentation,
  // Others
  'db': Database,
  'sql': Database,
  'epub': Book,
  'mobi': Book
};

export const PostCard = ({
  post,
  onLike,
  onBookmark,
  onCommentClick,
  onProfileClick,
  isLikeLoading,
  isBookmarkLoading
}: PostCardProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.profiles?.full_name || 'Anonymous'}`,
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Post link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const getFileIcon = (url: string) => {
    const fileType = url.split('.').pop()?.toLowerCase() || '';
    const IconComponent = fileTypeIcons[fileType] || File;
    return <IconComponent className="h-6 w-6" />;
  };

  const renderMedia = (url: string) => {
    const fileType = url.split('.').pop()?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(fileType);
    const isVideo = ['mp4', 'webm', 'mov', 'avi', 'wmv', 'flv'].includes(fileType);
    const isAudio = ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(fileType);
    const isPDF = fileType === 'pdf';
    const isDocument = ['doc', 'docx', 'txt', 'rtf', 'odt'].includes(fileType);
    const isSpreadsheet = ['csv', 'xlsx', 'xls'].includes(fileType);
    const isPresentation = ['ppt', 'pptx', 'odp'].includes(fileType);
    const isCode = ['json', 'xml', 'html', 'css', 'js', 'ts'].includes(fileType);
    const isArchive = ['zip', 'rar', '7z'].includes(fileType);
    const isEbook = ['epub', 'mobi'].includes(fileType);

    if (isImage) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <img 
              src={url} 
              alt="Post attachment" 
              className="rounded-lg max-h-96 object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <img src={url} alt="Full size" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      );
    }

    if (isVideo) {
      return (
        <video 
          src={url} 
          controls 
          className="rounded-lg max-h-96 w-full"
          controlsList="nodownload"
          playsInline
        />
      );
    }

    if (isAudio) {
      return (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <Music className="h-6 w-6" />
          <audio controls className="w-full" src={url} />
        </div>
      );
    }

    const renderFilePreview = () => (
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        {getFileIcon(url)}
        <span className="flex-1 truncate">{url.split('/').pop()}</span>
        <div className="flex gap-2">
          {isPDF && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh]">
                <iframe
                  src={url}
                  className="w-full h-full rounded-lg"
                  title="PDF Viewer"
                />
              </DialogContent>
            </Dialog>
          )}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </a>
        </div>
      </div>
    );

    return renderFilePreview();
  };

  // ... keep existing code (profile section and post content)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border rounded-lg space-y-4 bg-card"
      role="article"
      aria-label={`Post by ${post.profiles?.full_name || 'Anonymous'}`}
    >
      {/* ... keep existing code (profile header) */}
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleProfileClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleProfileClick();
          }}
          aria-label={`View ${post.profiles?.full_name || 'Anonymous'}'s profile`}
        >
          <Avatar>
            <AvatarImage src={post.profiles?.avatar_url || undefined} alt={post.profiles?.full_name || 'Anonymous'} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.profiles?.full_name || 'Anonymous'}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Share post">
              <Share2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleShare} disabled={isSharing}>
              <Share2 className="h-4 w-4 mr-2" />
              Share post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(window.location.href, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new tab
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="whitespace-pre-wrap break-words">{post.content}</p>

      {post.media_urls?.map((url, index) => (
        <div key={index} className="mt-2">
          {renderMedia(url)}
        </div>
      ))}

      {post.file_urls?.map((url, index) => (
        <div key={index} className="mt-2">
          {renderMedia(url)}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          className={`text-muted-foreground ${post.is_liked ? 'text-red-500' : ''}`}
          onClick={() => onLike(post.id, post.is_liked ? 'unlike' : 'like')}
          disabled={isLikeLoading}
          aria-label={post.is_liked ? 'Unlike post' : 'Like post'}
          aria-pressed={post.is_liked}
        >
          <Heart className={`h-4 w-4 mr-2 ${post.is_liked ? 'fill-current' : ''}`} />
          {post.likes_count || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => onCommentClick(post)}
          aria-label="View comments"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {post.comments_count || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`text-muted-foreground ml-auto ${post.is_bookmarked ? 'text-primary' : ''}`}
          onClick={() => onBookmark(post.id, post.is_bookmarked ? 'unbookmark' : 'bookmark')}
          disabled={isBookmarkLoading}
          aria-label={post.is_bookmarked ? 'Remove bookmark' : 'Bookmark post'}
          aria-pressed={post.is_bookmarked}
        >
          <Bookmark className={`h-4 w-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </motion.div>
  );
};
