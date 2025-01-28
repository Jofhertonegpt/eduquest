interface CurriculumViewProps {
  programId: string;
}

export const CurriculumView = ({ programId }: CurriculumViewProps) => {
  const [curriculumData, setCurriculumData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadCurriculumData();
      setCurriculumData(data);
    };
    loadData();
  }, [programId]);

  return (
    <div>
      <h1>{curriculumData?.program.name}</h1>
      <div className="courses-grid">
        {curriculumData?.courses.map(course => (
          <CourseCard 
            key={course.id}
            course={course}
            modules={course.modules}
          />
        ))}
      </div>
    </div>
  );
};