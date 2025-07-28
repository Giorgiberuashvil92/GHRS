"use client";
import React from "react";
import Header from "../components/Header";
import WorksSlider from "../components/WorksSlider";

import Subscribe from "../components/Subscribe";
import ReviewSlider from "../components/ReviewSlider";
import Blog from "../components/Blog";

export const chapterSliderInfo = [
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

const Chapter = () => {
  return (
    <div>
      <Header />
      <div className="mt-40 px-6">
        <WorksSlider title="Популярные упражнения" works={chapterSliderInfo} />
      </div>
      <div className="mt-10 px-6">
        <WorksSlider
          title="Шейный отдел позвоночника"
          works={chapterSliderInfo}
        />
      </div>
      <Subscribe />
      <ReviewSlider />
      <Blog
        withBanner={false}
        withSlider={true}
        layoutType="default"
        title={""}
      />
    </div>
  );
};

export default Chapter;
