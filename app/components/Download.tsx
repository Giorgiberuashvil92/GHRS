"use client";
import Image from "next/image";
import React from "react";
import { useI18n } from "../context/I18nContext";

const Download = () => {
  const { t } = useI18n();

  return (
    <div className="my-6 px-2 md:px-5">
      <section className="bg-[rgba(249,247,254,1)] rounded-[30px] md:pl-10 md:pt-10 flex flex-col md:flex-row md:justify-between ">
        <div className="flex flex-col justify-between md:pb-10 pl-4 py-4  pb-4">
          <p
            className="bg-[url('/assets/images/categorySliderBgs/bg1.jpg')] bg-cover text-transparent bg-clip-text md:text-[64px] text-[20px] leading-[100%] tracking-[-3%]"
            dangerouslySetInnerHTML={{
              __html:
                typeof t("download.title") === "string"
                  ? t("download.title")
                  : "Download",
            }}
          />

          <div className="flex gap-[8.6px] mt-4">
            <div className="md:w-[204px] md:h-[68px] w-[80px] h-[26px] cursor-pointer">
              <Image
                width={80}
                height={26}
                className="w-full h-full"
                src="/assets/icons/ios.png"
                alt="app store icon"
              />
            </div>

            <div className="md:w-[229px] md:h-[68px] w-[93px] h-[28px] cursor-pointer">
              <Image
                className="w-full h-full"
                width={93}
                height={28}
                src="/assets/icons/android.png"
                alt="app store icon"
              />
            </div>
          </div>
        </div>
        <div className="md:w-[382px] md:h-[440px] w-[172px] h-[170px] md:mr-[150px] m-auto">
          <Image
            width={172}
            height={170}
            className="w-full h-full"
            src="/assets/images/mobile.png"
            alt="iphone 14 pro mockup"
          />
        </div>
      </section>
    </div>
  );
};

export default Download;
