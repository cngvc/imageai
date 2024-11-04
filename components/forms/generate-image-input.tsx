"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImage } from "@/context/image";
import { Loader2Icon } from "lucide-react";

export default function GenerateImageInput() {
  const { generateImage, imagePrompt, $imagePrompt, loading } = useImage();

  return (
    <form onSubmit={generateImage}>
      <div className="mb-5 flex space-x-2">
        <Input
          placeholder="developer is looking for a new job"
          value={imagePrompt}
          onChange={(e) => $imagePrompt(e.target.value)}
          className="p-6 lg:p-8 text-lg lg:text-2xl"
        />
        <Button
          onClick={generateImage}
          disabled={loading || !imagePrompt?.length}
          className="p-6 lg:p-8 text-lg lg:text-2xl"
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>Generate Image</>
          )}
        </Button>
      </div>
    </form>
  );
}
