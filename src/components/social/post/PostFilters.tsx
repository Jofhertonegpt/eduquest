import { Button } from "@/components/ui/button";

interface PostFiltersProps {
  activeTab: "feed" | "trending";
  onTabChange: (tab: "feed" | "trending") => void;
}

export const PostFilters = ({ activeTab, onTabChange }: PostFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Button
        onClick={() => onTabChange("feed")}
        variant={activeTab === "feed" ? "default" : "outline"}
      >
        Feed
      </Button>
      <Button
        onClick={() => onTabChange("trending")}
        variant={activeTab === "trending" ? "default" : "outline"}
      >
        Trending
      </Button>
    </div>
  );
};