import React from "react";
import Header from "../components/Header";
import WorksSlider from "../components/WorksSlider";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import Blog from "../components/Blog";
import CourseSlider from "../components/CourseSlider";
import Professional from "../components/Professional";
import { Footer } from "../components/Footer";

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
      <div className="md:my-4">
      <WorksSlider works={homePageWorks} title="Subcategories"/>
      </div>
      <div className="md:mb-8">
      <WorksSlider works={homePageWorks} />
      </div>
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
      <div className="md:mb-8">
      <ReviewSlider title={""} />
      </div>
      <div className="md:my-8">
      <Blog
        title="GRS МЕДИА"
        withSlider={true}
        layoutType="default"
        withBanner={false}
        />
        </div>
        <Professional withBanner={false} title="" />
        <Footer />
    </div>
  );
};

export default Section;
