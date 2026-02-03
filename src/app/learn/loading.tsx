import { ListSkeleton } from "@/components/ui";

export default function LearnLoading() {
  return (
    <div className="min-h-screen py-8">
      <div className="container px-4 max-w-4xl">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-muted/50 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-96 bg-muted/50 rounded-lg animate-pulse" />
        </div>

        {/* Module cards skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border rounded-xl p-6 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-48 bg-muted/50 rounded" />
                  <div className="h-4 w-full bg-muted/50 rounded" />
                  <div className="h-3 w-32 bg-muted/50 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
