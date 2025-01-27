import { CourseCard } from "./CourseCard";
import type { FeaturedCoursesProps } from "@/types/home";

const defaultCourses = [
  {
    title: "Introduction to Programming",
    description: "Learn the fundamentals of coding with hands-on projects",
    category: "Programming",
    duration: "8 weeks",
  },
  {
    title: "Digital Marketing Essentials",
    description: "Master the core concepts of modern digital marketing",
    category: "Marketing",
    duration: "6 weeks",
  },
  {
    title: "Data Science Fundamentals",
    description: "Explore the world of data analysis and visualization",
    category: "Data Science",
    duration: "10 weeks",
  },
];

export const FeaturedCourses = ({ 
  title = "Featured Courses",
  description = "Explore our most popular courses designed to help you advance your career",
  courses = defaultCourses 
}: FeaturedCoursesProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={course.title} course={course} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};