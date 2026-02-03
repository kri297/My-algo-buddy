import { CardSkeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 py-20">
        <div className="container px-4 text-center">
          <div className="h-16 w-3/4 mx-auto bg-muted/50 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-1/2 mx-auto bg-muted/50 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
