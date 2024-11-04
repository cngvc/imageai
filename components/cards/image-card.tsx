import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageType } from "@/utils/types/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

export default function ImageCard({ image }: { image: ImageType }) {
  return (
    <Card className="w-full max-w-lg mx-10 transform transition duration-300 hover:scale-105 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center space-x-4 p-2">
        <div className="w-16 h-16 relative overflow-hidden rounded-md">
          <Image
            src={image.url}
            alt={image.name}
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className="flex-1 !m-0 !ml-3 w-full">
          <CardTitle className="text-lg line-clamp-1">{image.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {dayjs(image.createdAt).fromNow()}
          </p>
          <p className="text-sm text-muted-foreground">
            {image?.userName || "Anonymous"}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}
