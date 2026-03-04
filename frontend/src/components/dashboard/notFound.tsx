import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LayoutDashboard, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Animated 404 illustration */}
      <div className="relative mb-8">
        <div className="flex items-center gap-2 select-none">
          <span className="text-[8rem] font-black leading-none tracking-tighter text-primary/15 sm:text-[12rem]">
            4
          </span>
          <div className="relative flex items-center justify-center">
            <div className="absolute h-24 w-24 animate-ping rounded-full bg-primary/5 sm:h-32 sm:w-32" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-dashed border-primary/30 bg-primary/5 sm:h-28 sm:w-28">
              <SearchX className="h-10 w-10 text-primary/60 sm:h-14 sm:w-14" strokeWidth={1.5} />
            </div>
          </div>
          <span className="text-[8rem] font-black leading-none tracking-tighter text-primary/15 sm:text-[12rem]">
            4
          </span>
        </div>
      </div>

      {/* Message */}
      <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or the feature hasn't been
        built yet. Let's get you back on track.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" size="lg" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button size="lg" asChild>
          <Link to="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>

      {/* Back link */}
      <button
        onClick={() => window.history.back()}
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Go back to previous page
      </button>
    </div>
  );
};

export default NotFound;
