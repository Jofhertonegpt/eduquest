import { useNavigate } from "react-router-dom";
import { useCurriculum } from "@/hooks/use-curriculum";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const ImportedCurriculaList = () => {
  const { curricula, isLoading, deleteCurriculum } = useCurriculum();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!curricula?.length) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-2">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No curricula imported yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4 space-y-4">
        {curricula.map((curr) => (
          <Card key={curr.id} className="group">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{curr.curriculum.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(curr.created_at), "PPP")}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/learning/${curr.id}`)}
                  >
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Curriculum</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this curriculum? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteCurriculum.mutate(curr.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};