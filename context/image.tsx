"use client";
import { checkCreditRecordDb, getUserCreditsFromDb } from "@/actions/credit";
import { generateImageAi } from "@/actions/image";
import { AppInternalUrls } from "@/utils/constants/app-internal-urls.constants";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

interface ImageContextType {
  imagePrompt: string;
  $imagePrompt: (query: string) => void;
  loading: boolean;
  $loading: React.Dispatch<React.SetStateAction<boolean>>;
  generateImage: () => void;
  credits: number;
  $credits: React.Dispatch<React.SetStateAction<number>>;
  getUserCredits: () => void;
}

const ImageContext = React.createContext<ImageContextType | undefined>(
  undefined,
);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [imagePrompt, $imagePrompt] = React.useState("");
  const [loading, $loading] = React.useState(false);
  const [credits, $credits] = React.useState(0);

  const { isSignedIn } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    getUserCredits();
  }, []);

  React.useEffect(() => {
    checkCreditRecordDb();
  }, []);

  const getUserCredits = async () => {
    getUserCreditsFromDb().then((credit) => $credits(credit?.credits));
  };

  const generateImage = async () => {
    $loading(true);

    if (!isSignedIn) {
      toast.loading("Please sign in to generate image");
    }
    try {
      const { success, _id, credits } = await generateImageAi(imagePrompt);
      if (success) {
        $credits(credits);
        toast.success("🎉 Image generated");
        router.push(`${AppInternalUrls.dashboard}/image/${_id}`);
      } else {
        $credits(credits);
        toast.error(
          "Insufficient credits. Please buy more credits to generate images",
        );
        router.push(AppInternalUrls.credits);
      }
    } catch (err) {
      toast.error("Failed to generate image");
    } finally {
      $loading(false);
    }
  };

  return (
    <ImageContext.Provider
      value={{
        imagePrompt,
        $imagePrompt,
        loading,
        $loading,
        generateImage,
        credits,
        $credits,
        getUserCredits,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = (): ImageContextType => {
  const context = React.useContext(ImageContext);
  if (context == undefined) {
    throw new Error("useImage must be used within a ImageProvider");
  }
  return context;
};
