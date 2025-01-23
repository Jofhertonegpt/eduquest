import { motion } from "framer-motion";

const courses = [
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

export const FeaturedCourses = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">Featured Courses</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular courses designed to help you advance your career
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-2xl p-6 hover-scale"
            >
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
                {course.category}
              </span>
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{course.duration}</span>
                <button className="text-primary font-medium hover:underline">
                  Learn more
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};