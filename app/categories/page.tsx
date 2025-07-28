"use client";
// import { useCategories } from "../context/CategoryContext";
import Header from "../components/Header";
import WorksSlider from "../components/WorksSlider";
import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import Professional from "../components/Professional";
import Blog from "../components/Blog";
import Section from "../components/Section";
export default function CategoriesPage() {
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
      categoryId: "1",
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
      categoryId: "1",
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
      categoryId: "1",
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
      categoryId: "1",
    },
  ];

  return (
    <div className="">
      {/* Header Section */}
      <Header variant="categories" />
      <div className="md:pt-[100px] pt-[400px]">
        {/*  */}
        <Section border={0} borderColor="none" />
        <WorksSlider title="Комплексы" works={homePageWorks} fromMain={false} />
        <div className="md:my-10">
          <Subscribe
            backgroundImage="/assets/images/categorySliderBgs/bg4.jpg"
            titleKey="subscription.title"
            buttonTextKey="buttons.subscribe"
            buttonTextColor="#3D334A"
            buttonBgColor="#FFFFFF"
            containerStyles="custom-class"
            titleStyles="text-white"
            buttonStyles="hover:opacity-80"
            bgCenter={true}
          />
        </div>
        <div className="md:mb-10">
          {" "}
          <ReviewSlider />
        </div>
        <div
          className="md:mb-10
        "
        >
          {" "}
          <Blog
            withBanner={false}
            withSlider={true}
            layoutType="default"
            title={""}
          />
        </div>
        <Professional withBanner={false} />
      </div>
    </div>
  );
}
