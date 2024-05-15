import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  variants: "points" | "hearts";
  value: number;
};

export const ResultCard = ({ value, variants }: Props) => {
  const imageSrc = variants === "hearts" ? "/heart.svg" : "/points.svg";
  return (
    <div
      className={cn(
        "rounded-2xl border-2 w-full",
        variants === "points" && "bg-orange-400 border-orange-400 ",
        variants === "hearts" && "bg-rose-500 border-rose-500 "
      )}>
      <div
        className={cn(
          "p-1.5 text-white rounded-xl font-bold text-center uppercase text-xs",
          variants === "hearts" && "bg-rose-500",
          variants === "points" && "bg-orange-500"
        )}>
        {variants === "hearts" ? "Hearts left" : "Total XP"}
      </div>
      <div
        className={cn(
          "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
          variants === "points" && "text-orange-500",
          variants === "hearts" && "text-rose-500"
        )}>
        <Image
          src={imageSrc}
          alt="image"
          height={30}
          width={30}
          className="mr-1.5"
        />
        {value}
      </div>
    </div>
  );
};
