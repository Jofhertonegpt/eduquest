import { Card } from "@/components/ui/card";

const Creator = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Curriculum Creator</h1>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">
            Create and manage your curriculum content here. More features coming soon!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Creator;