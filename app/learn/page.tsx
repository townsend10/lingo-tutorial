import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
} from "@/db/queries";
import { redirect } from "next/navigation";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Header } from "./_components/header";
import { Unit } from "./_components/unit";

const LearnPage = async () => {
  const userProgressData = getUserProgress(); // userProgress de usuario logueado
  const courseProgressData = getCourseProgress(); // activeLesson: firstUncompletedLesson,activeLessonId: firstUncompletedLesson?.id,
  const lessonPercentageData = getLessonPercentage(); // porcentaje de desafíos completados en una lección activa.
  const unitsData = getUnits();

  const [userProgress, units, courseProgress, lessonPercentage] =
    await Promise.all([
      // Resolución de la promesa de userProgress, unitsData, courseProgressData y lessonPercentageData
      userProgressData,
      unitsData,
      courseProgressData,
      lessonPercentageData,
    ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>

      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={
                courseProgress.activeLesson as
                  | (typeof lessons.$inferSelect & {
                      unit: typeof unitsSchema.$inferSelect;
                    })
                  | undefined
              }
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;