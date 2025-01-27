export interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface CourseCard {
  title: string;
  description: string;
  category: string;
  duration: string;
}

export interface FeaturedCoursesProps {
  title?: string;
  description?: string;
  courses?: CourseCard[];
}