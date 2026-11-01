import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Skeleton */}
      <div className="space-y-6 pb-6 border-b">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Keys Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 md:px-6 flex items-center justify-between border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailSkeleton;
