"use client";
import { Button } from "@/components/ui/button";
import { ImageType } from "@/utils/types/image";
import { saveAs } from "file-saver";
import { CloudDownload, SquareArrowOutUpRight, View } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ImageEditButtons({ image }: { image: ImageType }) {
  const handleDownload = () => {
    saveAs(image.url, `${image.name}.png`);
  };

  const handleShare = async () => {
    const currentUrl = `${window.location.origin}/image/${image._id}`;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("URL copied to clipboard. Share with your friends!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={handleDownload}
        className="h-16 w-16 lg:h-20 lg:w-24 flex flex-col items-center justify-center"
      >
        <CloudDownload className="h-6 w-6 mb-1" />
      </Button>

      <Button
        onClick={handleShare}
        className="h-16 w-16 lg:h-20 lg:w-20 flex flex-col items-center justify-center"
      >
        <SquareArrowOutUpRight className="h-6 w-6 mb-1" />
      </Button>

      <Link href={`/image/${image._id}`}>
        <Button className="h-16 w-16 lg:h-20 lg:w-20 flex flex-col items-center justify-center">
          <View className="h-6 w-6 mb-1" />
        </Button>
      </Link>
    </div>
  );
}
