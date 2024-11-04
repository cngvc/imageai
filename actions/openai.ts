"use server";

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function runOpenAi(message: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant for a image generator website. If user is asking about the image generation features, answer them in maximum 50 charater long reply. All you need to know is: This app is free to use at the start and can generate images using ai for free. users can download freely generated images. they must be logged in.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });
  return completion.choices[0].message.content;
}
