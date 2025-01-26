import { Textarea } from "@/components/ui/textarea";

interface PostInputProps {
  content: string;
  isPosting: boolean;
  onChange: (value: string) => void;
}

export const PostInput = ({ content, isPosting, onChange }: PostInputProps) => {
  return (
    <Textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder="What's happening?"
      className="min-h-[120px] resize-none border-none text-xl bg-transparent"
      disabled={isPosting}
    />
  );
};