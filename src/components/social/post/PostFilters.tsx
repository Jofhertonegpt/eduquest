import { Button } from "@/components/ui/button";
import { PostListType } from "@/types/social";

interface PostFiltersProps {
  activeFilter: PostListType;
  onFilterChange: (filter: PostListType) => void;
}

export const PostFilters = ({ activeFilter, onFilterChange }: PostFiltersProps) => {
  const filters: { label: string; value: PostListType }[] = [
    { label: "For You", value: "for-you" },
    { label: "Following", value: "following" },
    { label: "Media", value: "media" },
  ];

  return (
    <div className="flex gap-2 p-4 border-b">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="rounded-full"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};