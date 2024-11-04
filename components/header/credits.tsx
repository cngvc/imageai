"use client";

import { useImage } from "@/context/image";
import { PiggyBank } from "lucide-react";
import { useMemo } from "react";

export default function Credits() {
  const { credits } = useImage();

  const displayCredits = useMemo(() => {
    return credits > 99 ? "99+" : credits?.toString();
  }, [credits]);

  const badgeColor = useMemo(() => {
    return credits < 10 ? "bg-red-500" : "bg-green-500";
  }, [credits]);

  return (
    <div className="relative inline-block">
      <PiggyBank className="h-8 w-8 text-primary" />
      <span
        className={`absolute top-0 right-0 ${badgeColor} text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 z-10`}
      >
        {displayCredits}
      </span>
    </div>
  );
}
