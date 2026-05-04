"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
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
  href?: string;
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
  href,
  // Fallback props
  title = "Завершая курс НА НАШЕЙ ПЛАТФОРМЕ ВЫ ПОЛУЧАЕТЕ СЕРТИФИКАТ ПРИОБРЕТЕННОЙ ПРОФЕССИИ! ",
  buttonText = "Приобрести курс",
  subTitle = "",
}: SubscribeProps) => {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <div className={`mb-6 md:mb-10 mt-10 md:mt-0 md:px-5 ${containerStyles}`}>
      <div
        className={` w-[359px] md:w-full md:h-[424px] ${bgCenter && "bg-center"
          } rounded-[20px] md:px-5 mx-auto md:mx-0 p-4 gap-5`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: bgColor,
        }}
      >
        <div>
          <h1
            className={`mb-5 text-[#3D334A] text-[18px] md:text-[54px] md:max-w-[1308px] md:pr-[52px] tracking-[-3%] md:pt-[48px] leading-[110%] md:leading-[100%] font-bowler ${titleStyles}`}
            style={{ 
              wordSpacing: 'normal',
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              hyphens: 'none'
            }}
          >
            {titleKey && typeof t(titleKey) === "string" ? t(titleKey) : title}
          </h1>
          <p className="text-[#3D334A] font-pt text-[18px] md:text-[20px] leading-[120%] md:leading-[100%] font-medium">
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
          onClick={() => {
            if (href) router.push(href);
          }}
        >
          <button
            className={`w-full py-[13px] text-[32px]  md:w-[562px] font-medium hover:opacity-80 font-bowler ${buttonStyles}`}
          >
            {buttonTextKey ? t(buttonTextKey) : buttonText}
          </button>

          <Image
            src="/assets/images/rightArrow.svg"
            alt="rightArrow"
            width={42}
            height={15}

          />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
