import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ClassmatesList } from "@/components/school/ClassmatesList";
import { SchoolPosts } from "@/components/school/SchoolPosts";
import { DEFAULT_SCHOOL } from "@/data/defaultSchool";

const School = () => {
  // Use the default school ID for testing
  const schoolId = DEFAULT_SCHOOL.id;

  return (
    <div className="min-h-screen">
      <SchoolHeader schoolId={schoolId} />
      <div className="flex">
        <ClassmatesList schoolId={schoolId} />
        <SchoolPosts schoolId={schoolId} />
      </div>
    </div>
  );
};

export default School;