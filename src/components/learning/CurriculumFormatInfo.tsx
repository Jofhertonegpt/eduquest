import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import defaultCurriculum from "@/data/curriculum/program.json";
import defaultCourses from "@/data/curriculum/courses.json";
import defaultModules from "@/data/curriculum/modules.json";
import defaultQuizzes from "@/data/curriculum/quizzes.json";
import defaultAssignments from "@/data/curriculum/assignments.json";
import defaultResources from "@/data/curriculum/resources.json";

export function CurriculumFormatInfo() {
  const { toast } = useToast();

  const copyExampleFormat = (data: any, type: string) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast({
      title: "Copied to clipboard",
      description: `${type} format has been copied to your clipboard.`,
    });
  };

  return (
    <div className="relative inline-block">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
            <span className="sr-only">JSON Format FAQ</span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent align="end" className="w-96 p-4">
          <h3 className="font-semibold mb-2">JSON Format FAQ:</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">Required JSON Files:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  <span className="font-medium">Program JSON:</span>
                  <br />
                  Contains basic program information and degree structure
                  <Button
                    variant="link"
                    className="px-0 h-auto py-0 text-xs"
                    onClick={() => copyExampleFormat(defaultCurriculum, "Program")}
                  >
                    Copy example
                  </Button>
                </li>
                <li>
                  <span className="font-medium">Courses JSON:</span>
                  <br />
                  Defines course details and metadata
                  <Button
                    variant="link"
                    className="px-0 h-auto py-0 text-xs"
                    onClick={() => copyExampleFormat(defaultCourses, "Courses")}
                  >
                    Copy example
                  </Button>
                </li>
                <li>
                  <span className="font-medium">Modules JSON:</span>
                  <br />
                  Contains module content and learning objectives
                  <Button
                    variant="link"
                    className="px-0 h-auto py-0 text-xs"
                    onClick={() => copyExampleFormat(defaultModules, "Modules")}
                  >
                    Copy example
                  </Button>
                </li>
                <li>
                  <span className="font-medium">Quizzes JSON:</span>
                  <br />
                  Defines quiz questions and answers
                  <Button
                    variant="link"
                    className="px-0 h-auto py-0 text-xs"
                    onClick={() => copyExampleFormat(defaultQuizzes, "Quizzes")}
                  >
                    Copy example
                  </Button>
                </li>
                <li>
                  <span className="font-medium">Assignments JSON:</span>
                  <br />
                  Contains assignment details and requirements
                  <Button
                    variant="link"
                    className="px-0 h-auto py-0 text-xs"
                    onClick={() => copyExampleFormat(defaultAssignments, "Assignments")}
                  >
                    Copy example
                  </Button>
                </li>
                <li>
                  <span className="font-medium">Resources JSON:</span>
                  <br />
                  Lists learning resources and materials
                  <Button
                    variant="link"
                    className="px-0 h-auto py-0 text-xs"
                    onClick={() => copyExampleFormat(defaultResources, "Resources")}
                  >
                    Copy example
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Tips:</p>
              <ul className="list-disc pl-4">
                <li>Each file must be valid JSON format</li>
                <li>IDs should be unique across all files</li>
                <li>Files are linked through their respective IDs</li>
                <li>Click "Copy example" to see the expected format</li>
              </ul>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}