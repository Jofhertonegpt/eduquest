import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Copy, Plus } from "lucide-react";
import CurriculumImport from "@/components/CurriculumImport";
import { ModuleContent } from "@/components/learning/ModuleContent";
import type { Curriculum, Module, Course } from "@/types/curriculum";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { decryptData } from "@/lib/encryption";
import { sampleCurriculum } from "@/data/sampleCurriculum";

const ModuleList = lazy(() => import('@/components/learning/ModuleList'));

const Learning = () => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showImport, setShowImport] = useState(false);
  const { toast } = useToast();

  const { data: curricula, isLoading } = useQuery({
    queryKey: ['saved-curricula'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: importedCurricula, error: importError } = await supabase
        .from('imported_curricula')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (importError) throw importError;

      return importedCurricula.map(curr => ({
        ...curr,
        curriculum: JSON.parse(decryptData(curr.curriculum))
      }));
    },
  });

  const handleCurriculumChange = (curriculumId: string) => {
    if (curriculumId === 'new') {
      setShowImport(true);
      return;
    }
    const selectedCurriculum = curricula?.find(c => c.id === curriculumId)?.curriculum;
    if (selectedCurriculum) {
      setCurriculum(selectedCurriculum);
      if (selectedCurriculum.degrees[0]?.courses[0]) {
        setActiveCourse(selectedCurriculum.degrees[0].courses[0]);
        setActiveModule(selectedCurriculum.degrees[0].courses[0].modules[0] || null);
      }
    }
  };

  const handleImport = (imported: Curriculum) => {
    setCurriculum(imported);
    if (imported.degrees[0]?.courses[0]?.modules[0]) {
      setActiveCourse(imported.degrees[0].courses[0]);
      setActiveModule(imported.degrees[0].courses[0].modules[0]);
    }
    setShowImport(false);
  };

  const copyFormatToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(sampleCurriculum, null, 2));
      toast({
        title: "Format copied!",
        description: "The curriculum format has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <main 
      className="container mx-auto px-4 py-8"
      role="main"
      aria-label="Learning content"
    >
      <Breadcrumb className="mb-6" aria-label="Page navigation">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/learning">Learning</BreadcrumbLink>
        </BreadcrumbItem>
        {activeCourse && (
          <BreadcrumbItem>
            <BreadcrumbLink>{activeCourse.title}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {activeModule && (
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{activeModule.title}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="space-y-6" aria-busy="true" aria-label="Loading content">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Skeleton className="h-[300px]" />
              <div className="md:col-span-3">
                <Skeleton className="h-[600px]" />
              </div>
            </div>
          </div>
        ) : !curriculum && curricula?.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Learning!</h2>
            <p className="text-muted-foreground mb-8">
              Get started by importing your curriculum. Need help with the format?
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Info className="mr-2 h-4 w-4" />
                    View Format
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Curriculum Format</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[500px] mt-4">
                    <pre className="p-4 bg-muted rounded-lg text-sm">
                      {JSON.stringify(sampleCurriculum, null, 2)}
                    </pre>
                  </ScrollArea>
                  <Button onClick={copyFormatToClipboard} className="mt-4">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Format
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <CurriculumImport onImport={handleImport} />
            </Suspense>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-display text-4xl font-bold">{curriculum?.name}</h1>
              <div className="flex items-center gap-4">
                <Select
                  value={curricula?.find(c => c.curriculum.name === curriculum?.name)?.id}
                  onValueChange={handleCurriculumChange}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select curriculum" />
                  </SelectTrigger>
                  <SelectContent>
                    {curricula?.map((curr) => (
                      <SelectItem key={curr.id} value={curr.id}>
                        {curr.curriculum.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">
                      <span className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        New Import
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Progress 
                  value={33} 
                  className="w-32" 
                  aria-label="Course progress"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Curriculum Format</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[500px] mt-4">
                      <pre className="p-4 bg-muted rounded-lg text-sm">
                        {JSON.stringify(sampleCurriculum, null, 2)}
                      </pre>
                    </ScrollArea>
                    <Button onClick={copyFormatToClipboard} className="mt-4">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Format
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {showImport ? (
              <div className="max-w-2xl mx-auto">
                <CurriculumImport onImport={handleImport} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Suspense 
                  fallback={
                    <div className="glass-panel rounded-xl p-4">
                      <Skeleton className="h-[300px]" />
                    </div>
                  }
                >
                  {activeCourse && (
                    <ModuleList
                      modules={activeCourse.modules}
                      activeModule={activeModule}
                      onModuleSelect={setActiveModule}
                    />
                  )}
                </Suspense>
                <div className="md:col-span-3">
                  <Suspense 
                    fallback={
                      <div className="glass-panel rounded-xl p-6">
                        <Skeleton className="h-[600px]" />
                      </div>
                    }
                  >
                    {activeModule && <ModuleContent module={activeModule} />}
                  </Suspense>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </main>
  );
};

export default Learning;