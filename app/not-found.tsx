import { site } from "@/site.config";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center gap-8 px-[clamp(1.25rem,4vw,3.5rem)]">
      <h1 className="display-lg max-w-[14ch]">This page has moved on.</h1>
      <p className="max-w-sm text-muted">The page you are looking for doesn't exist or is no longer available.</p>
      <Button asChild size="lg">
        <a href="/">Back to {site.name}</a>
      </Button>
    </main>
  );
}
