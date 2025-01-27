import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Learning = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Learning Curriculum</h1>
        <p>Curriculum ID: {id}</p>
        {/* We'll implement the full learning interface in the next iteration */}
      </Card>
    </div>
  );
};

export default Learning;