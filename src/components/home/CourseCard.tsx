import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { CourseCard as CourseCardType } from "@/types/home";
import type { Module } from "@/types/curriculum";

interface CourseCardProps {
  course: CourseCardType;
  modules: Module[];
  index: number;
}

export const CourseCard = ({ course, modules, index }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            {course.category}
          </Badge>
          <h3 className="text-xl font-bold mt-2">{course.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{course.description}</p>
          <div className="mt-4 space-y-2">
            {modules?.map(module => (
              <div key={module.id} className="text-sm">
                {module.title}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}
          </div>
          <Button variant="ghost" className="font-medium">
            Learn more
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};