"use client";
import React from "react";
import Rehabilitation from "./components/Rehabilitation";
import Category from "./components/Category";
import Works from "./components/Works";
import Subscribe from "./components/Subscribe";
import Professional from "./components/Professional";
import MarketPlace from "./components/MarketPlace";
import Blog from "./components/Blog";
import Download from "./components/Download";
import Reviews from "./components/Reviews";
import { useAllSets } from "./hooks/useSets";
import { Footer } from "./components/Footer";
import { useI18n } from "./context/I18nContext";
import MainHeader from "./components/Header/MainHeader";
import FuelPromoBanner from "./components/FuelPromoBanner";
import useStatistics from "./hooks/useStatistics";
import Image from "next/image";

const Home = () => {
  const { sets } = useAllSets();
  const { t } = useI18n();
  const { statistics } = useStatistics();
  console.log('📊 Total sets fetched:', sets?.length);
  console.log('📦 Sets data:', sets);
  console.log('📊 Statistics from hook:', statistics);

  // Use statistics from hook (more accurate) - fallback to sets calculation if not available
  const setsCount = statistics?.total?.sets || sets?.length || 0;
  const exercisesCount = statistics?.total?.exercises || (sets ? sets.reduce((acc, set) => acc + (set.totalExercises || 0), 0) : 0);
  
  // Hours: use statistics if available, otherwise calculate from sets
  const hoursCount = React.useMemo(() => {
    // First try to use statistics hook (most accurate)
    if (statistics?.total?.hours && statistics.total.hours > 0) {
      return statistics.total.hours;
    }
    
    // Fallback: calculate from sets
    if (!sets || sets.length === 0) return 0;
    
    const totalMinutes = sets.reduce((acc, set) => {
      if (!set.totalDuration) return acc;
      
      // Parse duration format "HH:MM:SS" or "MM:SS"
      const parts = set.totalDuration.split(':').map(Number);
      let minutes = 0;
      
      if (parts.length === 3) {
        // HH:MM:SS format
        const [hours, mins, secs] = parts;
        minutes = hours * 60 + mins + secs / 60;
      } else if (parts.length === 2) {
        // MM:SS format
        const [mins, secs] = parts;
        minutes = mins + secs / 60;
      }
      
      return acc + minutes;
    }, 0);
    
    return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal
  }, [sets, statistics]);

  console.log('📈 Final stats:', {
    setsCount,
    exercisesCount,
    hoursCount,
    fromStatistics: !!statistics?.total
  });

  // Add stats data using statistics hook (accurate data)
  const statsData = [
    {
      icon: <Image src="/assets/icons/Video.png" alt="Complexes" width={24} height={24} className="w-6 h-6" />,
      value: setsCount,
      label: t("header.sets_count", { count: String(setsCount) }).replace(/\d+\s*/, ""),
    },
    {
      icon: <Image src="/assets/icons/Pulse.png" alt="Exercises" width={24} height={24} className="w-6 h-6" />,
      value: exercisesCount,
      label: t("header.exercises_count", { count: String(exercisesCount) }).replace(/\d+\s*/, ""),
    },
    {
      icon: <Image src="/assets/icons/Book.png" alt="Hours" width={24} height={24} className="w-6 h-6" />,
      value: hoursCount,
      label: t("header.hours_count", { count: String(hoursCount) }).replace(/\d+\s*/, ""),
    },
  ];

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <MainHeader
        ShowBlock={true}
        OptionalComponent={null}
        stats={statsData as never[]}
        useVideo={true}
        backgroundImage="/assets/images/main-header-bg.jpg"
        customBlockTitle=""
        customBlockDescription=""
      />
      <div>
        <Rehabilitation />
        <Category bgColor="#F9F7FE" customRounded={""} customMx={""} />
        <hr className="border-[#D5D1DB] w-[95%] mx-auto my-8" />
        <Works
          title={t("navigation.sets")}
          sets={sets}
          fromMain={true}
          customMargin="20px"
          customBorderRadius=""
          seeAll={true}
          scrollable={true}
          totalCount={sets?.length || 0}
          linkHref="/allComplex"
        />
        <Subscribe
          backgroundImage="/assets/images/categorySliderBgs/bg1.jpg"
          titleKey="subscription.title"
          buttonTextKey="buttons.subscribe"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
          href="/shoppingcard"
          bgCenter={true}
          containerStyles="custom-class"
          titleStyles="text-white"
          buttonStyles="hover:opacity-80"
        />
        <Professional
          withBanner={true}
          title={t("sections.professional")}
          bgColor={"#F9F7FE"}
          withProfText={true}
        />
        <div className="mb-10">
          <Blog
            withBanner={true}
            withSlider={true}
            layoutType="default"
            title={t("navigation.blog")}
            showCategories={false}
          />
        </div>
        <MarketPlace />
        <Subscribe
          backgroundImage="/assets/images/categorySliderBgs/bg1.jpg"
          titleKey="subscription.test_title"
          buttonTextKey="buttons.take_test"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
          href="/test"
          bgCenter={true}
          containerStyles="custom-class"
          titleStyles="text-white"
          buttonStyles="hover:opacity-80"
        />
        <Download />
        <Reviews />
        <Subscribe
          backgroundImage=""
          titleKey="subscription.feedback_title"
          subTitleKey="subscription.feedback_subtitle"
          buttonTextKey="buttons.take_survey"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
          href="/shoppingcard"
          containerStyles="custom-class"
          titleStyles="text-[#3D334A]"
          buttonStyles="hover:opacity-80"
          bgColor="#F9F7FE"
        />
        <Footer />
      </div>
    </div>
  );
};

export default Home;