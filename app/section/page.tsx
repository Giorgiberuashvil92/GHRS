"use client";

import React from "react";
import Header from "../components/Header/Header";
import WorksSlider from "../components/WorksSlider";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import Blog from "../components/Blog";
import CourseSlider from "../components/CourseSlider";
import Professional from "../components/Professional";
import { Footer } from "../components/Footer";
import MainHeader from "../components/Header/MainHeader";
import { useI18n } from "../context/I18nContext";

const homePageWorks = [
  {
    id: "1",
    title: "Ортопедия",
    description: "Улучшение динамики и подвижности грудного отдела",
    price: "920 ₽/мес",
    image: "/assets/images/workMan.png",
    exerciseCount: 10,
    categoryName: "Ортопедия",
    monthlyPrice: 920,
    categoryId: "orthopedics-1",
  },
  {
    id: "2",
    title: "Ортопедия",
    description: "Улучшение динамики и подвижности грудного отдела",
    price: "920 ₽/мес",
    image: "/assets/images/workMan.png",
    exerciseCount: 10,
    categoryName: "Ортопедия",
    monthlyPrice: 920,
    categoryId: "orthopedics-2",
  },
  {
    id: "3",
    title: "Ортопедия",
    description: "Улучшение динамики и подвижности грудного отдела",
    price: "920 ₽/мес",
    image: "/assets/images/workMan.png",
    exerciseCount: 10,
    categoryName: "Ортопедия",
    monthlyPrice: 920,
    categoryId: "orthopedics-3",
  },
  {
    id: "4",
    title: "Ортопедия",
    description: "Улучшение динамики и подвижности грудного отдела",
    price: "920 ₽/мес",
    image: "/assets/images/workMan.png",
    exerciseCount: 10,
    categoryName: "Ортопедия",
    monthlyPrice: 920,
    categoryId: "orthopedics-4",
  },
];

const Section = () => {
  const { t } = useI18n();
  
  return (
    <div>
      {/* <Header
        variant="section"
        title="Название секции"
        info={{
          subcategoriesCount: 5,
          setsCount: 12,
          exercisesCount: 48,
        }}
      /> */}
      <MainHeader ShowBlock={false} OptionalComponent={null} stats={[]} showArrows={false} />
      <div className="my-8">
        <WorksSlider 
          works={homePageWorks} 
          title="Subcategories" 
          fromMain={false} 
          seeAll={false} 
          scrollable={false} 
        />
      </div>
      <div className="mb-8">
        <WorksSlider 
          works={homePageWorks} 
          fromMain={false} 
          seeAll={false} 
          scrollable={false} 
        />
      </div>
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
      <div className="mb-8">
        <ReviewSlider title={""} />
      </div>
      <div className="mb-10">
        <Blog
          withBanner={true}
          withSlider={true}
          layoutType="default"
          title={t("navigation.blog")}
          showCategories={false}
        />
      </div>
      <Professional withBanner={false} title="" bgColor="" withProfText={false} />
      <Footer />
    </div>
  );
};

export default Section;
