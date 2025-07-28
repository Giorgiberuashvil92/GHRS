"use client";
import React from "react";
import Banner from "./Banner";
import { useI18n } from "../context/I18nContext";

const MarketPlace = () => {
  const { t } = useI18n();

  return (
    <div className="bg-[#F9F7FE] md:mx-5 md:mb-10 mb-6 rounded-[30px]">
      <Banner
        backgroundUrl="/assets/images/marketPlace.png"
        logoUrl="/assets/images/simpleLogo.svg"
        icon="/assets/images/marketplacetxt.png"
      />
      <div className="flex flex-col items-start md:items-baseline gap-10 px-4 pb-4 ">
        <p className="text-[#3D334A] md:text-[24px] md:px-5 md:pt-10 md:max-w-[838px] font-bold leading-[120%] font-[Pt]">
          {typeof t("marketplace.description") === "string"
            ? t("marketplace.description")
            : ""}
        </p>
        <span className="text-[#846FA0] md:items-end w-full  items-end flex md:justify-end md:pr-10 md:pb-10 md:text-[32px] md:leading-[90%]">
          {typeof t("marketplace.status") === "string"
            ? t("marketplace.status")
            : ""}
        </span>
      </div>
    </div>
  );
};

export default MarketPlace;
