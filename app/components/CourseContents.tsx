"use client";
import React from "react";
import DynamicCard from "./DynamicCard";

const CourseContents = () => {
  return (
    <div className="bg-[#F9F7FE]">
      <DynamicCard
        imageSrc="/assets/images/workWoman2.png"
        imageAlt="work woman"
        tag="Ортопедия"
        title="Комплекс упражнений №1 для грудного отдела позвоночника"
        description="Улучшение динамики и подвижности грудного отдела"
        duration="56 минут"
        progress="2 из 5 уроков"
        buttonText="Продолжить просмотр"
        onButtonClick={() => alert("Hello")}
      />
      <DynamicCard
        imageSrc="/assets/images/workWoman2.png"
        imageAlt="work woman"
        tag="Ортопедия"
        title="Комплекс упражнений №1 для грудного отдела позвоночника"
        description="Улучшение динамики и подвижности грудного отдела"
        duration="56 минут"
        progress="2 из 5 уроков"
        buttonText="Продолжить просмотр"
        onButtonClick={() => alert("Hello")}
      />
    </div>
  );
};

export default CourseContents;
