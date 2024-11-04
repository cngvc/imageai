"use server";

import db from "@/database/db";
import Credit from "@/models/credit";
import Image from "@/models/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateImageAi(imagePrompt: string) {
  await auth.protect();

  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const userName = user?.fullName;
  try {
    await db();
    const userCredit = await Credit.findOne({ userEmail });
    if (!userCredit || userCredit.credits < 1) {
      return { success: false, _id: null, credits: userCredit?.credits };
    }
    userCredit.credits -= 1;
    await userCredit.save();

    const input = {
      prompt: imagePrompt,
      output_format: "png",
      num_outputs: 1,
      output_quality: 80,
      aspect_ratio: "16:9",
    };

    const [output]: any = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input,
      },
    );
    const response = await fetch(output);
    const buffer = await response.arrayBuffer();
    const nodeBuffer = Buffer.from(buffer);
    const uploadResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ai_images",
          public_id: nanoid(),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(nodeBuffer);
    });
    const cloudinaryUrl = uploadResponse.secure_url;
    const image = await new Image({
      userEmail,
      userName,
      name: imagePrompt,
      url: cloudinaryUrl,
    }).save();
    return {
      success: true,
      _id: image._id,
      credits: userCredit.credits,
    };
  } catch (err: any) {
    throw new Error(err);
  }
}
export const getUserImagesFromDb = async (page: number, limit: number) => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    let images = [];
    let totalCount = 0;
    try {
      [images, totalCount] = await Promise.all([
        Image.find({ userEmail })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Image.countDocuments({ userEmail }),
      ]);
    } catch (error) {}
    return {
      images: JSON.parse(JSON.stringify(images)),
      totalCount,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getImageFromDb = async (_id: string) => {
  try {
    await db();

    const image = await Image.findById(_id);
    return JSON.parse(JSON.stringify(image));
  } catch (err: any) {
    throw new Error(err);
  }
};
