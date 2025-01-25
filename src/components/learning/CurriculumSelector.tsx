import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Curriculum } from "@/types/curriculum";

interface CurriculumSelectorProps {
  curricula: { id: string; curriculum: Curriculum }[] | undefined;
  currentCurriculumId?: string;
  onCurriculumChange: (id: string) => void;
}

export const CurriculumSelector = ({ 
  curricula, 
  currentCurriculumId, 
  onCurriculumChange 
}: CurriculumSelectorProps) => {
  return (
    <Select value={currentCurriculumId} onValueChange={onCurriculumChange}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select curriculum" />
      </SelectTrigger>
      <SelectContent>
        {curricula?.map((curr) => (
          <SelectItem key={curr.id} value={curr.id}>
            {curr.curriculum.name}
          </SelectItem>
        ))}
        <SelectItem value="new">
          <span className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Import
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};