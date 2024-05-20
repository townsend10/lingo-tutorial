"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useExitModal } from "@/store/use-exit-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/use-hearts-modal";
export const HeartsModal = () => {
  const router = useRouter();

  const [isClient, setIsCLient] = useState(false);
  const { isOpen, close } = useHeartsModal();

  const onClick = () => {
    close();
    router.push("/store");
  };
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
            <Image
              src="/mascot_bad.svg"
              alt="mascot_bad"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Get Pro for unlimited hearts, or puchase them in store{" "}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            You&apos;re about to leave the lesson. Are you sure?
          </DialogDescription>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={onClick}>
                Get unlimited hearts{" "}
              </Button>
              <Button
                variant="primaryOutline"
                className="w-full"
                size="lg"
                onClick={close}>
                No thanks!{" "}
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
