import { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import CurriculumImport from "@/components/CurriculumImport";
import type { Curriculum, Module, Course } from "@/types/curriculum";
import { ModuleList } from "@/components/learning/ModuleList";
import { ModuleContent } from "@/components/learning/ModuleContent";

const Learning = () => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const handleImport = (imported: Curriculum) => {
    setCurriculum(imported);
    if (imported.degrees[0]?.courses[0]?.modules[0]) {
      setActiveCourse(imported.degrees[0].courses[0]);
      setActiveModule(imported.degrees[0].courses[0].modules[0]);
    }
  };

  if (!curriculum) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-bold mb-8">Learning</h1>
          <CurriculumImport onImport={handleImport} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold">{curriculum.name}</h1>
          <Progress value={33} className="w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {activeCourse && (
            <ModuleList
              modules={activeCourse.modules}
              activeModule={activeModule}
              onModuleSelect={setActiveModule}
            />
          )}
          <div className="md:col-span-3">
            {activeModule && <ModuleContent module={activeModule} />}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Learning;