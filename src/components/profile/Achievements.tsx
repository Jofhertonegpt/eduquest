import { useState } from "react";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { achievements, achievementCategories, type AchievementCategory } from "@/data/achievements";

export const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Achievements</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge 
            className="cursor-pointer" 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {Object.entries(achievementCategories).map(([key, label]) => (
            <Badge
              key={key}
              className="cursor-pointer"
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(key as AchievementCategory)}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className="p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-6 w-6 text-primary" />
                <h4 className="font-semibold">{achievement.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{achievement.points} pts</Badge>
                <Badge variant="outline">{achievementCategories[achievement.category]}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};