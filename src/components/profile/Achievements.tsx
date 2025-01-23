import { Trophy } from "lucide-react";

interface Achievement {
  title: string;
  description: string;
  icon: string;
}

const achievements: Achievement[] = [
  {
    title: "Fast Learner",
    description: "Completed 5 courses in record time",
    icon: "🚀",
  },
  {
    title: "Perfect Score",
    description: "Achieved 100% in a quiz",
    icon: "⭐",
  },
  {
    title: "Code Master",
    description: "Completed 10 programming challenges",
    icon: "💻",
  },
];

export const Achievements = () => {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Achievements</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
          >
            <div className="text-3xl mb-2">{achievement.icon}</div>
            <h4 className="font-semibold">{achievement.title}</h4>
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};