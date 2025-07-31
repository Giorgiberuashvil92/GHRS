/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Header from "./components/Header";
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

const Home = () => {
  const { sets } = useAllSets();
  const { t } = useI18n();

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Header variant="default" />
      <div>
        <Rehabilitation />
        <Category bgColor="#F9F7FE" customRounded={""} customMx={""} />
        <hr className="text-[#D5D1DB] bg-[#D5D1DB] w-[95%] mx-auto" />
        <Works 
          title={t("navigation.sets")} 
          sets={sets} 
          fromMain={true} 
          customMargin="20px" 
          customBorderRadius="" 
          seeAll={false} 
          scrollable={true} 
        />
        <Subscribe
          backgroundImage="/assets/images/categorySliderBgs/bg1.jpg"
          titleKey="subscription.title"
          buttonTextKey="buttons.subscribe"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
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
          />
        </div>
        <MarketPlace />
        <Subscribe
          backgroundImage="/assets/images/categorySliderBgs/bg1.jpg"
          titleKey="subscription.test_title"
          buttonTextKey="buttons.take_test"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
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
