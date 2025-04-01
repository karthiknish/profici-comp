import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        Oops! The page you&apos;re looking for doesn&apos;t seem to exist.
      </p>
      <Button asChild>
        <Link href="/">Go back to Home</Link>
      </Button>
    </div>
  );
}
