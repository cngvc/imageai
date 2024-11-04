import { Loader2Icon } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-white">
        <Loader2Icon className="animate-spin text-primary" size={64} />
      </div>
    </div>
  );
}
