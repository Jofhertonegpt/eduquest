import { HashtagInput } from "../HashtagInput";

interface HashtagManagerProps {
  hashtags: string[];
  hashtagInput: string;
  isUploading: boolean;
  onHashtagInputChange: (value: string) => void;
  onHashtagAdd: (e: React.KeyboardEvent) => void;
  onHashtagRemove: (index: number) => void;
}

export const HashtagManager = ({
  hashtags,
  hashtagInput,
  isUploading,
  onHashtagInputChange,
  onHashtagAdd,
  onHashtagRemove,
}: HashtagManagerProps) => {
  return (
    <HashtagInput
      hashtags={hashtags}
      hashtagInput={hashtagInput}
      isUploading={isUploading}
      onHashtagInputChange={onHashtagInputChange}
      onHashtagAdd={onHashtagAdd}
      onHashtagRemove={onHashtagRemove}
    />
  );
};