import { Loader2 } from "lucide-react";

export default function LoaderFullScreen() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Loader2 className="animate-spin size-10" />
    </div>
  );
}
