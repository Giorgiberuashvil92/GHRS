"use client";
import React, {
  useRef,
  useState,
  Suspense,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getVideoType, resolveExerciseVideo } from "../../lib/exercise-video";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../components/Header/Header";
// import Image from "next/image";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { useSearchParams } from "next/navigation";
import { useI18n } from "../context/I18nContext";
// import { useAuth } from "../context/AuthContext";
import { useUserAccess } from "../hooks/useUserAccess";
// import PurchasePrompt from "../components/PurchasePrompt";
import { useExercisesBySet } from "../hooks/useExercises";
import { useSet } from "../hooks/useSet";
import { useActivityTracker } from "../hooks/useAchievements";

// ----- Types -----
interface LocalizedString {
  ka?: string;
  en: string;
  ru: string;
  _id: string;
  id?: string;
}

interface LocalizedVideoUrl {
  en: string;
  ru: string;
  _id: string;
  id: string;
}

interface BackendExercise {
  videoUrlEn?: string;
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  videoUrl?: string;
  thumbnailUrl?: string;
  videoDuration: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  repetitions: string;
  sets: string;
  restTime: string;
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  setId: string;
  categoryId: string;
  subCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  set?: {
    _id: string;
    name: LocalizedString;
    description: LocalizedString;
  };
  category?: {
    _id: string;
    name: LocalizedString;
  };
  subcategory?: {
    _id: string;
    name: LocalizedString;
  } | null;
}

type ExerciseStatus = "done" | "waiting" | "locked";

type Exercise = {
  id: number;
  _id: string; // დავამატოთ _id ველი
  title: string;
  steps: {
    step: number;
    title: string;
    list: string[];
    image?: string;
  }[];
  status: ExerciseStatus;
};

// ლოკალიზაციის ფუნქცია
const getLocale = () => {
  if (typeof window !== "undefined") {
    const storedLocale = localStorage.getItem("locale");

    const result =
      storedLocale && ["ka", "ru", "en"].includes(storedLocale)
        ? storedLocale
        : "ru";

    return result;
  }
  return "ru";
};

const getLocalizedText = (
  field: LocalizedString | undefined,
  forcedLocale?: string
): string => {
  if (!field) return "";
  const locale = forcedLocale || getLocale();
  return (
    field[locale as keyof typeof field] ||
    field.ru ||
    field.en ||
    field.ka ||
    ""
  );
};

// ვქმნით exercises მასივს setData-დან
const getExercises = (
  exercises: BackendExercise[],
  t: (key: string) => string,
  completedExercises: string[] = []
): Exercise[] => {

  if (!exercises) return [];

  return exercises.map((exercise: BackendExercise, index: number) => {
    // სტატუსის განსაზღვრა
    let status: ExerciseStatus = "locked";

    // თუ წინა ყველა სავარჯიშო შესრულებულია, ეს სავარჯიშო ხელმისაწვდომია
    const prevExercises = exercises.slice(0, index);
    const allPreviousCompleted = prevExercises.every((ex) =>
      completedExercises.includes(ex._id)
    );

    if (allPreviousCompleted) {
      status = "waiting";
    }
    if (completedExercises.includes(exercise._id)) {
      status = "done";
    }

    // ვქმნით steps მასივს
    const description = getLocalizedText(exercise.description);
    const paragraphs = description
      .split("{new paragraph}")
      .map((p) => p.trim());

    // ერთი საერთო step ყველა პარაგრაფით
    const steps = [
      {
        step: 1,
        title: t("exercise.description"),
        list: paragraphs,
        image: exercise.thumbnailUrl,
      },
    ];

    return {
      id: index + 1,
      _id: exercise._id, // დავამატოთ _id
      title: `${t("exercise.title")} ${index + 1}. ${getLocalizedText(
        exercise.name
      ).toUpperCase()}`,
      steps,
      status,
    };
  });
};

// Helper function to get YouTube video ID
const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// YouTube API ტიპები
interface YouTubePlayer {
  Player: new (
    element: HTMLIFrameElement,
    config: {
      events: {
        onStateChange: (event: {
          data: number;
          target: { getCurrentTime: () => number; getDuration: () => number };
        }) => void;
      };
    }
  ) => void;
}

declare global {
  interface Window {
    YT?: YouTubePlayer;
  }
}

// ვიდეო პლეიერის კომპონენტი
const VideoPlayer = ({
  url,
  title,
  onVideoComplete,
  onProgress,
}: {
  url: string;
  title: string;
  onVideoComplete: () => void;
  onProgress: (progress: number) => void;
}) => {
  const videoType = getVideoType(url);
  const videoRef = useRef<HTMLVideoElement>(null);

  // YouTube Player API-ის ჩატვირთვა
  useEffect(() => {
    if (videoType !== "youtube") return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    return () => {
      tag.remove();
    };
  }, [videoType]);

  // YouTube ივენთების ჰენდლერი
  const handleYouTubeStateChange = useCallback(
    (event: {
      data: number;
      target: { getCurrentTime: () => number; getDuration: () => number };
    }) => {
      // YouTube Player States:
      // -1 (unstarted)
      // 0 (ended)
      // 1 (playing)
      // 2 (paused)
      // 3 (buffering)
      // 5 (video cued)

      if (event.data === 0) {
        // ვიდეო დასრულდა
        onVideoComplete();
      } else if (event.data === 1) {
        // ვიდეო დაიწყო
        // პროგრესის თრექინგი ყოველ წამში
        const interval = setInterval(() => {
          const progress =
            (event.target.getCurrentTime() / event.target.getDuration()) * 100;
          onProgress(progress);
        }, 1000);

        return () => clearInterval(interval);
      }
    },
    [onVideoComplete, onProgress]
  );

  // ჩვეულებრივი ვიდეოს ივენთების ჰენდლერები
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    onProgress(progress);
  }, [onProgress]);

  const handleEnded = useCallback(() => {
    onVideoComplete();
  }, [onVideoComplete]);

  switch (videoType) {
    case "youtube":
      return (
        <div className="relative w-full h-0 pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-[20px] md:rounded-[30px]"
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(
              url
            )}?autoplay=1&mute=0&modestbranding=1&rel=0&enablejsapi=1&playlist=${getYouTubeVideoId(
              url
            )}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={(e) => {
              // YouTube Player API-ის ინიციალიზაცია
              if (window.YT) {
                new window.YT.Player(e.target as HTMLIFrameElement, {
                  events: {
                    onStateChange: handleYouTubeStateChange,
                  },
                });
              }
            }}
          />
        </div>
      );

    case "direct":
      return (
        <div className="w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full rounded-[20px] md:rounded-[30px]"
            src={url}
            title={title}
            controls
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={(e) => {
              // const video = e.target as HTMLVideoElement;
              console.error("Video error:", e);
            }}
            onLoadedData={() => {

              if (videoRef.current) {
                videoRef.current
                  .play()
                  .then(() => console.log("▶️ Video playing"))
                  .catch((e) => console.error("❌ Video autoplay failed:", e));
              }
            }}
          >
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      );

    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[20px] md:rounded-[30px]">
          <p className="text-gray-500">Unsupported video format</p>
        </div>
      );
  }
};

function PlayerContent() {
  const searchParams = useSearchParams();
  const { t, locale } = useI18n();
  // const { isAuthenticated } = useAuth();
  const { recordActivity } = useActivityTracker();
  const [currentExercise, setCurrentExercise] =
    useState<BackendExercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [exerciseStartTime, setExerciseStartTime] = useState<number | null>(
    null
  );

  // URL-დან პარამეტრების ამოღება
  const setId = searchParams.get("setId") || "";
  const difficulty = searchParams.get("difficulty") || "";

  // API-დან მონაცემების მოღება
  const { set: setData, loading: setLoading, error: setError } = useSet(setId);
  const { exercises: allExercises, loading: exercisesLoading } =
    useExercisesBySet(setId);

  // Access control
  const { loading: accessLoading } = useUserAccess(setId);

  // ვარჯიშების დასრულების სტატუსის ჩატვირთვა
  useEffect(() => {
    if (!setId) return;
    const savedProgress = localStorage.getItem(`exercise_progress_${setId}`);
    if (savedProgress) {
      setCompletedExercises(JSON.parse(savedProgress));
    }
  }, [setId]);

  // ვარჯიშის დაწყების დრო
  useEffect(() => {
    if (currentExercise && !exerciseStartTime) {
      setExerciseStartTime(Date.now());
    }
  }, [currentExercise, exerciseStartTime]);

  // ვარჯიშის დასრულების ფუნქცია
  const handleExerciseComplete = useCallback(
    async (exerciseId: string) => {

      // გამოვთვალოთ დახარჯული დრო
      const timeSpent = exerciseStartTime
        ? Math.floor((Date.now() - exerciseStartTime) / 1000 / 60)
        : 0; // წუთებში

      // ჩავწეროთ აქტივობა
      try {
        await recordActivity("exercise", exerciseId, timeSpent);

      } catch (error) {
        console.error("❌ Failed to record activity:", error);
      }

      setCompletedExercises((prev) => {
        const newCompleted = [...prev];
        const index = newCompleted.indexOf(exerciseId);

        if (index === -1) {
          newCompleted.push(exerciseId);
        } else {
          newCompleted.splice(index, 1);
        }

        localStorage.setItem(
          `exercise_progress_${setId}`,
          JSON.stringify(newCompleted)
        );
        return newCompleted;
      });

      // Reset start time for next exercise
      setExerciseStartTime(null);
    },
    [setId, recordActivity, exerciseStartTime]
  );

  // შემდეგ/წინა ვარჯიშზე გადასვლა

  // ვარჯიშების ფილტრაცია difficulty-ის მიხედვით და რიგის შეცვლა
  const exercises = useMemo(() => (
    allExercises?.filter(exercise => !difficulty || exercise.difficulty === difficulty) || []
  ).reverse(), [allExercises, difficulty]);

  // Keep the selected exercise in sync with the latest response and route filters.
  useEffect(() => {
    if (exercisesLoading) return;
    const next = exercises.find(exercise => exercise._id === currentExercise?._id) || exercises[0] || null;
    if (next !== currentExercise) setCurrentExercise(next);
  }, [exercises, currentExercise, exercisesLoading]);

  // Function to change current exercise
  const handleExerciseChange = (exercise: BackendExercise, index: number) => {
    setCurrentExercise(exercise);
    // Reset start time when changing exercise
    setExerciseStartTime(null);

    // სქროლი აქტიურ ქარდზე
    if (scrollContainerRef.current) {
      const cardWidth = 280; // ქარდის სიგანე
      const gap = 12; // gap-3 = 12px
      const scrollPosition = index * (cardWidth + gap);
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // Check if set is completed and record set activity
  useEffect(() => {
    if (!exercises.length || !setId) return;

    const allExercisesCompleted = exercises.every((ex) =>
      completedExercises.includes(ex._id)
    );

    if (allExercisesCompleted && exercises.length > 0) {
      // Set completed - record set activity
      recordActivity("set", setId)
        .then(() => {

        })
        .catch((error) => {
          console.error("❌ Failed to record set completion:", error);
        });
    }
  }, [completedExercises, exercises, setId, recordActivity]);

  // ვიდეოს დასრულების ჰენდლერი
  const handleVideoComplete = useCallback(() => {
    if (!currentExercise) return;

    // ვიდეოს დასრულებისას ავტომატურად ვნიშნავთ ვარჯიშს შესრულებულად
    if (!completedExercises.includes(currentExercise._id)) {
      handleExerciseComplete(currentExercise._id);
    }

    // გადავდივართ შემდეგ ვარჯიშზე
    const currentIndex = exercises.findIndex(
      (ex) => ex._id === currentExercise._id
    );
    if (currentIndex < exercises.length - 1) {
      handleExerciseChange(exercises[currentIndex + 1], currentIndex + 1);
    }
  }, [currentExercise, completedExercises, handleExerciseComplete, exercises]);

  useEffect(() => {
    if (progressBarRef.current) progressBarRef.current.style.width = '0%';
  }, [currentExercise?._id]);

  // ვიდეოს პროგრესის ჰენდლერი
  const handleVideoProgress = useCallback((progress: number) => {
    if (progressBarRef.current) progressBarRef.current.style.width = `${Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0))}%`;

  }, []);

  const loading = setLoading || exercisesLoading;

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // სქროლი პირველ ქარდზე კომპონენტის ჩატვირთვისას
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);

  // Access control checks
  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700">იტვირთება...</h2>
        </div>
      </div>
    );
  }

  // Access denied - show purchase prompt
  // if (!isAuthenticated || !hasAccess) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="bg-white shadow-sm border-b">
  //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //           <div className="flex justify-between items-center py-4">
  //             <div className="flex items-center">
  //               <Image
  //                 src="/assets/images/logo.png"
  //                 alt="Logo"
  //                 width={120}
  //                 height={40}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="max-w-4xl mx-auto py-12 px-4">
  //         <PurchasePrompt
  //           setId={setId}
  //           setName={setData?.name ? getLocalizedText(setData.name) : undefined}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-cinzel font-semibold text-gray-700">
            {t("common.loading")}
          </h2>
        </div>
      </div>
    );
  }

  if (setError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Error loading set data
          </h2>
          <p className="text-gray-600">{setError}</p>
        </div>
      </div>
    );
  }

  return (
    <div>

      <DesktopNavbar
        menuItems={defaultMenuItems}
        blogBg={false}
        allCourseBg={true}
      />
      <MobileNavbar />
      <div className="flex flex-col items-center md:overflow-hidden">
        <div className="w-full h-[calc(100vh-200px)] rounded-[20px] md:rounded-[30px] overflow-hidden">
          {(() => {

            if (!currentExercise) {
              return (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[20px] md:rounded-[30px]">
                  <p className="text-gray-500">{t("common.noVideo")}</p>
                </div>
              );
            }

            let videoUrl = resolveExerciseVideo(currentExercise, locale);
            let videoType = getVideoType(videoUrl || "");

            // If both exercise URLs are invalid, try set's demo video
            if (
              videoType === "unknown" &&
              setData &&
              "demoVideoUrl" in setData
            ) {

              let demoUrl: string | undefined;

              if (typeof setData.demoVideoUrl === "object") {
                // ვცდილობთ შესაბამისი ენის demo ვიდეოს
                if (
                  locale === "en" &&
                  (setData.demoVideoUrl as LocalizedVideoUrl).en
                ) {
                  demoUrl = (setData.demoVideoUrl as LocalizedVideoUrl).en;
                } else if (
                  locale === "ru" &&
                  (setData.demoVideoUrl as LocalizedVideoUrl).ru
                ) {
                  demoUrl = (setData.demoVideoUrl as LocalizedVideoUrl).ru;
                } else if (
                  locale === "ka" &&
                  (setData.demoVideoUrl as LocalizedVideoUrl).ru
                ) {
                  demoUrl = (setData.demoVideoUrl as LocalizedVideoUrl).ru; // KA-სთვის ვიყენებთ RU-ს
                }

                // fallback-ად ვცდილობთ სხვა ენის ვიდეოს
                if (!demoUrl) {
                  demoUrl =
                    (setData.demoVideoUrl as LocalizedVideoUrl).en ||
                    (setData.demoVideoUrl as LocalizedVideoUrl).ru;
                }
              } else {
                demoUrl = setData.demoVideoUrl as string;
              }

              if (demoUrl) {
                videoUrl = demoUrl;
                videoType = getVideoType(videoUrl || "");
              }
            }

            return videoUrl && getVideoType(videoUrl) !== "unknown" ? (
              <VideoPlayer
                key={`${currentExercise._id}:${videoUrl}`}
                url={videoUrl}
                title={getLocalizedText(currentExercise.name)}
                onVideoComplete={handleVideoComplete}
                onProgress={handleVideoProgress}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[20px] md:rounded-[30px]">
                <p className="text-gray-500">{t("common.noVideo")}</p>
              </div>
            );
          })()}
        </div>

        {/* Progress Bar */}
        {currentExercise && (
          <div className="w-full max-w-[1400px] px-4 mt-2">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                ref={progressBarRef}
                style={{ width: "0%" }}
              />
            </div>
          </div>
        )}

        {/* Exercise List Slider Controls + Items */}
        <div className="w-full max-w-[1400px] px-4 mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              if (!currentExercise || exercises.length === 0) return;
              const idx = exercises.findIndex((ex) => ex._id === currentExercise._id);
              if (idx > 0) {
                handleExerciseChange(exercises[idx - 1], idx - 1);
              }
            }}
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg bg-[#E9DFF6] hover:bg-[#D4BAFC] transition"
            aria-label="scroll-left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3D334A]">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!currentExercise || exercises.length === 0) return;
              const idx = exercises.findIndex((ex) => ex._id === currentExercise._id);
              if (idx > -1 && idx < exercises.length - 1) {
                handleExerciseChange(exercises[idx + 1], idx + 1);
              }
            }}
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg bg-[#E9DFF6] hover:bg-[#D4BAFC] transition"
            aria-label="scroll-right"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3D334A]">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="w-full mt-5 ml-2.5 mr-2.5 px-4 overflow-x-auto scrollbar-hide"
        >
          <div
            className="flex gap-3 md:gap-5 pb-4"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {exercises.map((exercise, index) => {
              const isWatching = currentExercise?._id === exercise._id;
              const isCompleted = completedExercises.includes(exercise._id);

              // Determine background color based on status
              let bgColor = "bg-gray-200"; // Default/locked
              let textColor = "text-gray-600";

              if (isCompleted) {
                bgColor = "bg-[#F3D57F]"; // Yellow for completed
                textColor = "text-[#92400E]";
              } else if (isWatching) {
                bgColor = "bg-[#E8D5FF]"; // Purple for watching
                textColor = "text-[#6D28D9]";
              } else {
                bgColor = "bg-[#F9F7FE]"; // Light purple for available
                textColor = "text-[#3D334A]";
              }

              return (
                <button
                  key={exercise._id}
                  type="button"
                  onClick={() => handleExerciseChange(exercise, index)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center rounded-[10px] px-4 py-2 ${bgColor} transition-all duration-200 hover:scale-105 w-[280px] h-[100px]`}
                  style={{ scrollSnapAlign: "start" }}
                >
                  <span
                    className={`text-xs font-medium ${textColor} mb-1 uppercase`}
                  >
                    {t("exercise.title")} {index + 1}
                  </span>
                  <span
                    className={`text-xs font-normal ${textColor} text-center leading-tight`}
                  >
                    {getLocalizedText(exercise.name).length > 40
                      ? getLocalizedText(exercise.name).substring(0, 40) + "..."
                      : getLocalizedText(exercise.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exercise Details Section */}
      <section className="w-full bg-[#F9F7FE] rounded-[16px] md:rounded-[30px] md:mb-10 flex flex-col items-center py-8 px-4 md:px-8 mt-6 md:mt-10">
        <div className="relative w-full flex flex-col gap-4 md:gap-6">
          {/* ვერტიკალური ხაზების კონტეინერი */}
          <div className="hidden md:block absolute left-6 w-[2px] h-full">
            {getExercises(exercises || [], t, completedExercises).map(
              (exercise, idx, arr) => {
                const nextExercise = arr[idx + 1];
                if (!nextExercise) return null;

                // ვამოწმებთ წინა ვარჯიშების დასრულების სტატუსს
                const prevExercises = arr.slice(0, idx);
                const allPreviousCompleted = prevExercises.every((ex) =>
                  completedExercises.includes(ex._id)
                );

                let lineColor = "#F1EEF6"; // locked ფერი

                if (completedExercises.includes(exercise._id)) {
                  lineColor = "#F3D57F"; // done ფერი
                } else if (
                  currentExercise?._id === exercise._id &&
                  allPreviousCompleted
                ) {
                  lineColor = "#E8D5FF"; // waiting/active ფერი
                } else if (
                  currentExercise?._id === nextExercise._id &&
                  allPreviousCompleted
                ) {
                  lineColor = "#F3D57F"; // done ფერი - ხაზი ყვითელი იქნება მიმდინარე ვარჯიშამდე
                }

                const lineHeight = idx === arr.length - 1 ? "50%" : "100%";

                return (
                  <div
                    key={exercise.id}
                    className="absolute w-full"
                    style={{
                      top: `${idx * 100}%`,
                      height: lineHeight,
                      backgroundColor: lineColor,
                    }}
                  />
                );
              }
            )}
          </div>

          {getExercises(exercises || [], t, completedExercises).map(
            (exercise, idx, arr) => {
              // ვამოწმებთ წინა ვარჯიშების დასრულების სტატუსს
              const prevExercises = arr.slice(0, idx);
              const allPreviousCompleted = prevExercises.every((ex) =>
                completedExercises.includes(ex._id)
              );

              return (
                <div
                  key={exercise.id}
                  className="relative flex flex-col md:flex-row w-full"
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                >
                  {/* ნომერი წრეში - სტატუსის მიხედვით */}
                  <div
                    className={`hidden md:flex absolute left-0 items-center justify-center w-12 h-12 rounded-full z-10 ${
                      completedExercises.includes(exercise._id)
                        ? "bg-[#F3D57F] text-[#92400E]"
                        : currentExercise?._id === exercise._id &&
                          allPreviousCompleted
                        ? "bg-[#E8D5FF] text-[#6D28D9]"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <span className="text-xl font-bold">{exercise.id}</span>
                  </div>

                  {/* მთავარი კონტენტი */}
                  <div className="flex-1 ml-0 md:ml-20">
                    <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#3D334A]">
                          {exercise.title}
                        </h3>
                        <span
                          className={`px-4 py-2 rounded-[6px] text-sm font-medium ${
                            completedExercises.includes(exercise._id)
                              ? "bg-[#F3D57F] text-[#92400E]"
                              : currentExercise?._id === exercise._id &&
                                allPreviousCompleted
                              ? "bg-[#E8D5FF] text-[#6D28D9]"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {completedExercises.includes(exercise._id)
                            ? t("exercise.status.completed")
                            : currentExercise?._id === exercise._id &&
                              allPreviousCompleted
                            ? t("exercise.status.waiting")
                            : t("exercise.status.locked")}
                        </span>
                      </div>

                      {exercise.steps.map((step) => (
                        <div key={step.step} className="mb-6 last:mb-0">
                          <h4 className="text-[#6D28D9] font-pt font-extrabold  text-2xl mb-3 ">
                            {step.title}
                          </h4>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              {step.list.map((item, i) => (
                                <p
                                  key={i}
                                  className="text-md text-[#3D334A] mb-2 last:mb-0 leading-relaxed font-pt font-normal"
                                >
                                  {i + 1}. {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}

export default function Player() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
            <h2 className="text-2xl font-cinzel font-semibold text-gray-700">
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <PlayerContent />
    </Suspense>
  );
}
