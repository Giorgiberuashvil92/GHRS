import React from "react";
import Header from "../components/Header";
import WorksSlider from "../components/WorksSlider";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import Blog from "../components/Blog";
import CourseSlider from "../components/CourseSlider";

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
  },
];

const Section = () => {
  return (
    <div>
      <Header
        variant="section"
        title="Название секции"
        info={{
          subcategoriesCount: 5,
          setsCount: 12,
          exercisesCount: 48,
        }}
      />
      <WorksSlider works={homePageWorks} title="Subcategories"/>
      <WorksSlider works={homePageWorks} />
      <Subscribe
        backgroundImage="/assets/images/categorySliderBgs/bg4.jpg"
        titleKey="subscription.title"
        buttonTextKey="buttons.subscribe"
        buttonTextColor="#3D334A"
        buttonBgColor="#FFFFFF"
        containerStyles="custom-class"
        titleStyles="text-white"
        buttonStyles="hover:opacity-80"
      />
      <ReviewSlider />
      <Blog
        title="GRS МЕДИА"
        withSlider={true}
        layoutType="default"
        withBanner={false}
      />
      <CourseSlider />
    </div>
  );
};

export default Section;
