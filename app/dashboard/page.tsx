import { getUserImagesFromDb } from "@/actions/image";
import ImageCard from "@/components/cards/image-card";
import Pagination from "@/components/header/pagination";
import { AppInternalUrls } from "@/utils/constants/app-internal-urls.constants";
import { ImageType } from "@/utils/types/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

interface DashboardProps {
  searchParams: Promise<{ page?: number }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const { page } = await searchParams;
  let _page = page;
  if (page) {
    _page = parseInt(page as unknown as string, 10);
  } else {
    _page = 1;
  }
  const limit = 3;

  const { images, totalCount } = await getUserImagesFromDb(_page, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <div className="p-5 text-center">
        <h1 className="text-2xl font-bold text-center">Images</h1>
        <p>Your AI-Generated Image Collection</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((image: ImageType) => (
          <Link href={`${AppInternalUrls.dashboard}/image/${image._id}`}>
            <ImageCard image={image} />
          </Link>
        ))}
      </div>
      <div className="flex justify-center m-20">
        <Pagination page={_page} totalPages={totalPages} />
      </div>
    </div>
  );
}
