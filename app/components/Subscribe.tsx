"use client";

import Image from "next/image";
import React from "react";
import { useI18n } from "../context/I18nContext";

interface SubscribeProps {
  backgroundImage?: string;
  titleKey?: string;
  buttonTextKey?: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
  containerStyles?: string;
  titleStyles?: string;
  buttonStyles?: string;
  subTitleKey?: string;
  bgColor?: string;
  // Fallback props for backward compatibility
  title?: string;
  buttonText?: string;
  subTitle?: string;
  bgCenter?: boolean;
}

const Subscribe = ({
  backgroundImage = "/assets/images/continueWatchingBanner.jpg",
  titleKey,
  buttonTextKey,
  buttonTextColor = "#3D334A",
  buttonBgColor = "#ffffff",
  containerStyles = "",
  titleStyles = "",
  buttonStyles = "",
  subTitleKey,
  bgColor = "",
  bgCenter = false,
  // Fallback props
  title = "Приобретите подписку для получения доступа к контенту платформы",
  buttonText = "Приобрести подписку",
  subTitle = "",
}: SubscribeProps) => {
  const { t } = useI18n();
  return (
    <div className={`mb-6 md:mb-10 mt-10 md:mt-0 md:px-5 ${containerStyles}`}>
      <div
        className={` w-[359px] md:w-full md:h-[424px] ${
          bgCenter && "bg-center"
        } rounded-[20px] md:px-5 mx-auto md:mx-0 p-4 gap-5`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: bgColor,
        }}
      >
        <div>
          <h1
            className={`mb-5 text-[#3D334A] text-[20px] md:text-[64px] md:max-w-[1308px] md:pr-[52px] tracking-[-3%] md:pt-[48px] leading-[100%] ${titleStyles}`}
          >
            {titleKey && typeof t(titleKey) === "string" ? t(titleKey) : title}
          </h1>
          <p className="text-[#3D334A]">
            {subTitleKey && typeof t(subTitleKey) === "string"
              ? t(subTitleKey)
              : subTitle}
          </p>
        </div>
        <div
          className={`flex items-center cursor-pointer md:mt-[70px] mt-10 rounded-[10px] gap-5 px-[15px] w-[327px] md:w-[562px]`}
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor,
          }}
        >
          <button
            className={`py-[13px] text-[18px] font-medium  ${buttonStyles}`}
          >
            {buttonTextKey ? t(buttonTextKey) : buttonText}
          </button>
          <Image
            src="/assets/images/rightArrow.svg"
            alt="rightArrow"
            width={13}
            height={9.5}
          />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
