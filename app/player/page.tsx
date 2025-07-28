"use client";
import React, { useRef, useState, Suspense, useEffect, useCallback } from "react";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../components/Header";
import Image from "next/image";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { useSearchParams } from "next/navigation";
import { useI18n } from "../context/I18nContext";

// ----- Types -----
interface LocalizedString {
  ka?: string;
  en: string;
  ru: string;
  _id: string;
  id?: string;
}

interface BackendExercise {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  videoUrl: string;
  thumbnailUrl: string;
  videoDuration: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  repetitions: string;
  sets: string;
  restTime: string;
  isActive: boolean;
  isPublished: boolean;
  isPopular: boolean;
  sortOrder: number;
  setId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  set?: {
    _id: string;
    name: LocalizedString;
    description: LocalizedString;
    id: string;
  };
  category?: {
    _id: string;
    name: LocalizedString;
  };
  subcategory: null | unknown;
  id: string;
}

interface BackendSet {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  recommendations: LocalizedString;
  thumbnailImage: string;
  totalExercises: number;
  totalDuration: string;
  difficultyLevels: number;
  levels: {
    beginner: {
      exerciseCount: number;
      isLocked: boolean;
    };
    intermediate: {
      exerciseCount: number;
      isLocked: boolean;
    };
    advanced: {
      exerciseCount: number;
      isLocked: boolean;
    };
  };
  price: {
    monthly: number;
    threeMonths: number;
    sixMonths: number;
    yearly: number;
  };
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  categoryId: string;
  subCategoryId?: string;
  exercises?: BackendExercise[];
  createdAt: string;
  updatedAt: string;
  id: string;
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
const getLocalizedText = (
  field: LocalizedString | undefined,
  locale: string = "ru"
): string => {
  if (!field) return "";
  return (
    field[locale as keyof typeof field] ||
    field.ru ||
    field.en ||
    field.ka ||
    ""
  );
};

// ვქმნით exercises მასივს setData-დან
const getExercises = (exercises: BackendExercise[]): Exercise[] => {
  if (!exercises) return [];

  return exercises.map((exercise: BackendExercise, index: number) => {
    // სტატუსის განსაზღვრა
    let status: ExerciseStatus = "locked";
    if (index === 0) status = "done";
    else if (index === 1) status = "waiting";

    // ვქმნით steps მასივს
    const steps = [
      {
        step: 1,
        title: "Описание упражнения",
        list: [getLocalizedText(exercise.description, "ru")],
        image: exercise.thumbnailUrl,
      },
      {
        step: 2,
        title: "Рекомендации",
        list: [getLocalizedText(exercise.description, "ru")], // აქ უნდა იყოს recommendations როცა დაემატება
        image: exercise.thumbnailUrl,
      },
    ];

    return {
      id: index + 1,
      _id: exercise._id, // დავამატოთ _id
      title: `УПРАЖНЕНИЕ ${index + 1}. ${getLocalizedText(exercise.name, "ru").toUpperCase()}`,
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

// ვიდეოს ტიპის შემოწმების ფუნქცია
const getVideoType = (url: string): 'youtube' | 'direct' | 'unknown' => {
  if (!url) return 'unknown';
  
  // YouTube URL პატერნები
  const youtubePatterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/([^?]+)/,
  ];

  if (youtubePatterns.some(pattern => pattern.test(url))) {
    return 'youtube';
  }

  // პირდაპირი ვიდეო URL-ის პატერნები
  const videoExtensions = /\.(mp4|webm|ogg)$/i;
  if (videoExtensions.test(url)) {
    return 'direct';
  }

  return 'unknown';
};

// YouTube API ტიპები
interface YouTubePlayer {
  Player: new (
    element: HTMLIFrameElement,
    config: {
      events: {
        onStateChange: (event: { data: number; target: { getCurrentTime: () => number; getDuration: () => number; } }) => void;
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
  onProgress
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
    if (videoType !== 'youtube') return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    return () => {
      tag.remove();
    };
  }, [videoType]);

  // YouTube ივენთების ჰენდლერი
  const handleYouTubeStateChange = useCallback((event: { data: number; target: { getCurrentTime: () => number; getDuration: () => number; } }) => {
    // YouTube Player States:
    // -1 (unstarted)
    // 0 (ended)
    // 1 (playing)
    // 2 (paused)
    // 3 (buffering)
    // 5 (video cued)
    
    if (event.data === 0) { // ვიდეო დასრულდა
      onVideoComplete();
    } else if (event.data === 1) { // ვიდეო დაიწყო
      // პროგრესის თრექინგი ყოველ წამში
      const interval = setInterval(() => {
        const progress = (event.target.getCurrentTime() / event.target.getDuration()) * 100;
        onProgress(progress);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [onVideoComplete, onProgress]);

  // ჩვეულებრივი ვიდეოს ივენთების ჰენდლერები
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    onProgress(progress);
  }, [onProgress]);

  const handleEnded = useCallback(() => {
    onVideoComplete();
  }, [onVideoComplete]);

  switch (videoType) {
    case 'youtube':
      return (
        <div className="relative w-full h-0 pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-[20px] md:rounded-[30px]"
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={(e) => {
              // YouTube Player API-ის ინიციალიზაცია
              if (window.YT) {
                new window.YT.Player((e.target as HTMLIFrameElement), {
                  events: {
                    onStateChange: handleYouTubeStateChange,
                  },
                });
              }
            }}
          />
        </div>
      );
    
    case 'direct':
      return (
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
        >
          Your browser does not support the video tag.
        </video>
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
  const { t } = useI18n();
  const [currentExercise, setCurrentExercise] = useState<BackendExercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  // URL-დან პარამეტრების ამოღება
  const setId = searchParams.get('setId') || '';
  const exercisesFromUrl = searchParams.get('exercises');
  const setFromUrl = searchParams.get('set');

  // ვარჯიშების დასრულების სტატუსის ჩატვირთვა
  useEffect(() => {
    if (!setId) return;
    const savedProgress = localStorage.getItem(`exercise_progress_${setId}`);
    if (savedProgress) {
      setCompletedExercises(JSON.parse(savedProgress));
    }
  }, [setId]);

  // ვარჯიშის დასრულების ფუნქცია
  const handleExerciseComplete = useCallback((exerciseId: string) => {
    console.log('✅ Completing exercise:', exerciseId);
    setCompletedExercises(prev => {
      const newCompleted = [...prev];
      const index = newCompleted.indexOf(exerciseId);
      
      if (index === -1) {
        newCompleted.push(exerciseId);
      } else {
        newCompleted.splice(index, 1);
      }
      
      localStorage.setItem(`exercise_progress_${setId}`, JSON.stringify(newCompleted));
      return newCompleted;
    });
  }, [setId]);

  // შემდეგ/წინა ვარჯიშზე გადასვლა


  // JSON-ის პარსვა
  let exercises: BackendExercise[] = [];
  let setData: BackendSet | null = null;
  try {
    exercises = exercisesFromUrl ? JSON.parse(exercisesFromUrl) : [];
    setData = setFromUrl ? JSON.parse(setFromUrl) : null;
    
    // Set first exercise as current by default
    if (exercises.length > 0 && !currentExercise) {
      setCurrentExercise(exercises[0]);
    }

    console.log('🎯 Player Data:', {
      setId,
      exercisesCount: exercises.length,
      exercises: exercises,
      set: setData
    });
  } catch (error) {
    console.error('Error parsing data:', error);
  }

  // Function to change current exercise
  const handleExerciseChange = (exercise: BackendExercise) => {
    setCurrentExercise(exercise);
  };

  // ვიდეოს დასრულების ჰენდლერი
  const handleVideoComplete = useCallback(() => {
    if (!currentExercise) return;
    
    console.log('🎬 Video completed:', currentExercise._id);
    // ვიდეოს დასრულებისას ავტომატურად ვნიშნავთ ვარჯიშს შესრულებულად
    if (!completedExercises.includes(currentExercise._id)) {
      handleExerciseComplete(currentExercise._id);
    }
  }, [currentExercise, completedExercises, handleExerciseComplete]);

  // ვიდეოს პროგრესის ჰენდლერი
  const handleVideoProgress = useCallback((progress: number) => {
    setVideoProgress(progress);
    console.log('📊 Video progress:', progress.toFixed(1) + '%');
  }, []);

  const loading = false;

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // const [centers, setCenters] = useState<number[]>([]);

  // useLayoutEffect(() => {
  //   setCenters(
  //     cardRefs.current.map((el) =>
  //       el ? el.offsetTop + markerOffset + markerSize / 2 : 0
  //     )
  //   );
  // }, []);
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

  return (
    <div>
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} allCourseBg={true} />
      <MobileNavbar />
      <div className="flex flex-col items-center md:overflow-hidden">
        <div className="w-full max-w-[1400px] aspect-video md:mx-auto px-1 rounded-[20px] md:rounded-[30px] overflow-hidden">
          {currentExercise?.videoUrl ? (
            <VideoPlayer 
              url={currentExercise.videoUrl} 
              title={getLocalizedText(currentExercise.name)}
              onVideoComplete={handleVideoComplete}
              onProgress={handleVideoProgress}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[20px] md:rounded-[30px]">
              <p className="text-gray-500">{t("common.noVideo")}</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {currentExercise?.videoUrl && (
          <div className="w-full max-w-[1400px] px-4 mt-2">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Exercise Details */}
       

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:m-5 md:gap-5 mx-auto justify-center md:w-auto mt-4 md:mt-8">
          {exercises.map((exercise, index) => {
            const isWatching = currentExercise?._id === exercise._id;
            const isCompleted = completedExercises.includes(exercise._id);
            
            return (
              <button
                key={exercise._id}
                type="button"
                onClick={() => handleExerciseChange(exercise)}
                className={`flex flex-row items-center md:w-auto mb-2 md:mb-0 rounded-[10px] px-4 py-2 ${
                  isWatching ? 'bg-[#E8D5FF]' : 
                  isCompleted ? 'bg-[#F3D57F]' : 
                  'bg-[#F9F7FE]'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-[#3D334A] mb-1">
                    {t("common.exercise")} {index + 1}
                  </span>
                  <span className="text-sm font-[Pt] text-[#3D334A]">
                    {getLocalizedText(exercise.name, "ru")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* bg-[#F9F7FE] */}
      <section className="w-full bg-[#F9F7FE] rounded-[16px] md:rounded-[30px] md:mb-10 flex flex-col items-center min-h-screen py-4 px-2 md:px-5 mt-4 md:mt-8">
        <div className="relative w-full flex flex-col gap-4 md:gap-6">
          {/* ვერტიკალური ხაზების კონტეინერი */}
          <div className="hidden md:block absolute left-6 w-[2px] h-full">
            {getExercises(setData?.exercises || []).map((exercise, idx, arr) => {
              const nextExercise = arr[idx + 1];
              if (!nextExercise) return null;
              
              // ვამოწმებთ წინა ვარჯიშების დასრულების სტატუსს
              const prevExercises = arr.slice(0, idx);
              const allPreviousCompleted = prevExercises.every(ex => 
                completedExercises.includes(ex._id)
              );
              
              let lineColor = "#F1EEF6"; // locked ფერი
              
              if (completedExercises.includes(exercise._id)) {
                lineColor = "#F3D57F"; // done ფერი
              } else if (currentExercise?._id === exercise._id && allPreviousCompleted) {
                lineColor = "#E8D5FF"; // waiting/active ფერი
              } else if (currentExercise?._id === nextExercise._id && allPreviousCompleted) {
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
            })}
          </div>
          
          {getExercises(setData?.exercises || []).map((exercise, idx, arr) => {
            // ვამოწმებთ წინა ვარჯიშების დასრულების სტატუსს
            const prevExercises = arr.slice(0, idx);
            const allPreviousCompleted = prevExercises.every(ex => 
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
                <div className={`hidden md:flex absolute left-0 items-center justify-center w-12 h-12 rounded-full z-10 ${
                  completedExercises.includes(exercise._id) 
                    ? 'bg-[#F3D57F] border-[#F3D57F]' 
                    : currentExercise?._id === exercise._id && allPreviousCompleted
                      ? 'bg-white border-[#E8D5FF]'
                      : 'bg-white border-[#F1EEF6]'
                } border-4`}>
                  <span className={`text-xl font-semibold ${
                    completedExercises.includes(exercise._id)
                      ? 'text-[#92400E]'
                      : 'text-[#3D334A]'
                  }`}>
                    {exercise.id}
                  </span>
                </div>

                {/* მთავარი კონტენტი */}
                <div className="flex-1 ml-0 md:ml-20">
                  <div className="bg-white rounded-[16px] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#3D334A]">{exercise.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        completedExercises.includes(exercise._id) 
                          ? 'bg-[#F3D57F] text-[#92400E]' 
                          : currentExercise?._id === exercise._id && allPreviousCompleted
                            ? 'bg-[#E8D5FF] text-[#6D28D9]'
                            : 'bg-[#F1EEF6] text-[#9CA3AF]'
                      }`}>
                        {completedExercises.includes(exercise._id)
                          ? "Просмотрено"
                          : currentExercise?._id === exercise._id && allPreviousCompleted
                            ? "Ожидает просмотра"
                            : "Посмотрите предыдущее упражнение"}
                      </span>
                    </div>

                    {exercise.steps.map((step) => (
                      <div key={step.step} className="mb-4 last:mb-0">
                        <h4 className="text-[#6D28D9] font-medium mb-2">{step.title}</h4>
                        <div className="flex gap-4">
                          {step.image && (
                            <div className="w-24 h-24 flex-shrink-0">
                              <Image
                                src={step.image}
                                alt={step.title}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <ul className="flex-1 text-sm text-[#3D334A] space-y-2">
                            {step.list.map((item, i) => (
                              <li key={i} className="font-[Pt]">{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function Player() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-cinzel font-semibold text-gray-700">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  );
}
