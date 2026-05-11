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

  const resolvedTitle =
    titleKey && t(titleKey) !== titleKey ? t(titleKey) : title;
  const resolvedSubtitle =
    subTitleKey && t(subTitleKey) !== subTitleKey ? t(subTitleKey) : subTitle;
  const resolvedButton = buttonTextKey
    ? t(buttonTextKey) !== buttonTextKey
      ? t(buttonTextKey)
      : buttonText
    : buttonText;

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
            className={`mb-3 md:mb-5 text-[#3D334A] text-[16px] md:text-[28px] lg:text-[34px] md:max-w-[960px] lg:max-w-[1100px] md:pr-6 tracking-[-0.02em] md:pt-5 lg:pt-7 leading-[118%] md:leading-[112%] font-bowler ${titleStyles}`}
            style={{ 
              wordSpacing: 'normal',
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              hyphens: 'none'
            }}
          >
            {resolvedTitle}
          </h1>
          <p className="text-[#3D334A] font-pt text-[14px] md:text-[17px] leading-[128%] md:leading-[122%] font-medium max-w-2xl min-h-0 empty:hidden">
            {resolvedSubtitle}
          </p>
        </div>
        <div
          className={`flex items-center cursor-pointer md:mt-9 mt-7 rounded-[10px] gap-3 md:gap-4 px-3 md:px-[15px] w-[327px] md:max-w-[500px]`}
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor,
          }}
          onClick={() => {
            if (href) router.push(href);
          }}
        >
          <button
            className={`w-full py-3 md:py-[13px] text-[18px] md:text-[22px] font-medium hover:opacity-80 font-bowler ${buttonStyles}`}
          >
            {resolvedButton}
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
