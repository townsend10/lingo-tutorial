"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePracticeModal } from "@/store/use-practice-modal";
import Image from "next/image";
import { useEffect, useState } from "react";
export const PracticeModal = () => {
  const [isClient, setIsCLient] = useState(false);
  const { isOpen, close } = usePracticeModal();

  useEffect(() => {
    setIsCLient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md ">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image src="/heart.svg" alt="heart" height={100} width={100} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Practice Lesson{" "}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Use practice lessons to regain hearts and points. You cannot lose
            hearts or points in practice lessons{" "}
          </DialogDescription>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={close}>
                I understand{" "}
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
