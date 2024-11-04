"use server";
import db from "@/database/db";
import Credit from "@/models/credit";
import { currentUser } from "@clerk/nextjs/server";

export const saveCreditToDb = async (amount: number, credits: number) => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const existingCredit = await Credit.findOne({ userEmail });

    if (existingCredit) {
      existingCredit.amount += amount;
      existingCredit.credits += credits;
      await existingCredit.save();
      return JSON.parse(JSON.stringify(existingCredit));
    } else {
      const newCredit = await new Credit({
        userEmail,
        amount,
        credits,
      });
      await newCredit.save();
      return JSON.parse(JSON.stringify(newCredit));
    }
  } catch (error) {}
};

export const getUserCreditsFromDb = async () => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const credit = await Credit.findOne({ userEmail });
    return JSON.parse(JSON.stringify(credit));
  } catch (error) {}
};

export const checkCreditRecordDb = async () => {
  try {
    await db();
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const credit = await Credit.findOne({ userEmail });
    if (!credit) {
      const newCredit = await new Credit({
        userEmail,
        amount: 0,
        credits: 5,
      });
      await newCredit.save();
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
