import type { LearningResource } from "@/types/curriculum";

export const ResourceViewer = ({ resource }: { resource: LearningResource }) => {
  if (resource.type === 'video' && resource.embedType === 'youtube' && resource.url) {
    const videoId = resource.url.split('v=')[1];
    return (
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        />
      </div>
    );
  }

  if ((resource.type === 'pdf' || resource.type === 'epub') && resource.url) {
    return (
      <div className="aspect-[4/3] w-full">
        <iframe
          src={resource.url}
          width="100%"
          height="100%"
          className="rounded-lg border"
        />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border">
      <p className="text-sm text-muted-foreground">{resource.content}</p>
    </div>
  );
};