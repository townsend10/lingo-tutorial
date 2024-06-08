"use client";
import {
  challengeOptions,
  challengeProgress,
  challenges,
  lessons,
} from "@/db/schema";
import { useState, useTransition } from "react";
import Conffeti from "react-confetti";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challange } from "./challange";
import { Footer } from "./footer";
import { upsertChallangeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

type Props = {
  initaLessonId: number;
  initalLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initalHearts: number;
  initalPercentage: number;
  userSubscription?: any;
};
export const Quiz = ({
  initaLessonId,
  initalHearts,
  initalLessonChallenges,
  initalPercentage,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initalPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();
  const router = useRouter();
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [correctAudio, _c, correctControls] = useAudio({
    src: "/correct.wav",
  });
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [pending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initalHearts);

  //guarda estados / info

  const [percentage, setPercentage] = useState(() => {
    return initalPercentage === 100 ? 0 : initalPercentage;
  });
  const [challanges, setChallenges] = useState(initalLessonChallenges);
  const [lessonId] = useState(initaLessonId);
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challanges.findIndex(
      //encontra o desafio que não foi competado
      (challange) => !challange.completed
    );
    //ira pegar sempre o primeiro index do desafio
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();

  const onSelect = (id: number) => {
    if (status !== "none") {
      return;
    }
    setSelectedOption(id);
  };
  const challange = challanges[activeIndex];
  const options = challange?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onContinue = () => {
    if (!selectedOption) {
      return;
    }

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }
    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallangeProgress(challange.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challanges.length);

            if (initalPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong"));
      });
    } else {
      startTransition(() => {
        reduceHearts(challange.id)
          .then((res) => {
            if (res?.error === "hearts") {
              openHeartsModal();
              return;
            }
            incorrectControls.play();
            setStatus("wrong");

            if (!res?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch((error: any) =>
            toast.error("Something went wrong in quiz", error)
          );
      });
    }
  };

  if (!challange) {
    return (
      <>
        {finishAudio}
        <Conffeti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={1000}
          width={width}
          height={height}
        />
        <div
          className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto
        text-center items-center justify-center h-full">
          <Image
            src="/finish.svg"
            alt="finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className="text-lg lg:text-3xl font-bold text-neutral-700">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variants="points" value={challanges.length * 10} />
            <ResultCard variants="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challange.type === "ASSIST"
      ? "Select the correct meaning"
      : challange.question;
  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1 ">
        <div className="h-full flex items-center justify-center">
          <div
            className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col
           gap-y-12 ">
            <h1
              className="text-lg lg:text-3xl text-center lg:text-start
            font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challange.type === "ASSIST" && (
                <QuestionBubble question={challange.question} />
              )}
              <Challange
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challange.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
