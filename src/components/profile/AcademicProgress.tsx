import { GraduationCap, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { degrees, certificates, type Certificate } from "@/data/degrees";
import { toast } from "@/hooks/use-toast";

interface Degree {
  id: string;
  title: string;
  level: string;
  estimatedDuration: string;
}

interface AcademicProgressProps {
  currentDegree?: string | null;
  completedDegrees?: string[] | null;
  certificates?: string[] | null;
}

export const AcademicProgress = ({ 
  currentDegree,
  completedDegrees = [],
  certificates: certificateIds = []
}: AcademicProgressProps) => {
  try {
    const currentDegreeData = currentDegree 
      ? degrees.find(d => d.id === currentDegree) as Degree | undefined
      : null;

    if (currentDegree && !currentDegreeData) {
      console.warn(`Current degree with ID ${currentDegree} not found`);
    }

    const completedDegreesData = degrees.filter(d => 
      completedDegrees?.includes(d.id)
    ) as Degree[];

    const certificatesData = certificateIds
      .map(certId => {
        const cert = certificates.find(c => c.id === certId);
        if (!cert) {
          console.warn(`Certificate with ID ${certId} not found`);
        }
        return cert;
      })
      .filter((cert): cert is Certificate => cert !== undefined);

    return (
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Academic Progress</h3>
        </div>
        
        <div className="space-y-6">
          {currentDegreeData && (
            <div className="p-4 rounded-lg bg-background/50">
              <h4 className="font-semibold text-lg mb-2">Current Degree Program</h4>
              <p className="text-muted-foreground mb-2">{currentDegreeData.title}</p>
              <div className="flex gap-2 mb-4">
                <Badge>{currentDegreeData.level}</Badge>
                <Badge variant="outline">{currentDegreeData.estimatedDuration}</Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span>Progress</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          )}

          {completedDegreesData.length > 0 && (
            <div className="p-4 rounded-lg bg-background/50">
              <h4 className="font-semibold text-lg mb-4">Completed Degrees</h4>
              <div className="space-y-4">
                {completedDegreesData.map(degree => (
                  <div key={degree.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{degree.title}</p>
                      <Badge variant="outline">{degree.level}</Badge>
                    </div>
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificatesData.length > 0 && (
            <div className="p-4 rounded-lg bg-background/50">
              <h4 className="font-semibold text-lg mb-4">Certificates</h4>
              <div className="space-y-4">
                {certificatesData.map(cert => (
                  <div key={cert.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cert.title}</p>
                      <Badge variant="outline">{cert.level}</Badge>
                    </div>
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering AcademicProgress:", error);
    toast({
      title: "Error",
      description: "Failed to load academic progress",
      variant: "destructive",
    });
    return null;
  }
};