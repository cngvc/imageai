import { getImageFromDb } from "@/actions/image";
import ImageEditButtons from "@/components/image/image-edit-buttons";
import Image from "next/image";

interface ImagePageProps {
  params: Promise<{ _id: string }>;
}

export default async function ImagePage({ params }: ImagePageProps) {
  const { _id } = await params;
  const image = await getImageFromDb(_id);

  return (
    <div className="flex flex-col max-w-6xl mx-auto justify-center items-center p-4">
      <div className="relative w-full h-[60vh] mb-8">
        <Image
          src={image.url}
          alt={image.name}
          layout="fill"
          className="rounded-lg object-contain"
        />
      </div>
      <ImageEditButtons image={image} />
    </div>
  );
}
