import { Suspense } from "react";
import ListingsContent from "@/components/listings/ListingsContent";

interface PageProps {
  searchParams: {
    category?: string;
    make?: string;
    model?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
  };
}

export default function ListingsPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      }
    >
      <ListingsContent searchParams={searchParams} />
    </Suspense>
  );
} 