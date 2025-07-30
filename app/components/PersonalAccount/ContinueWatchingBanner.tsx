import Image from "next/image";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { useI18n } from "../../context/I18nContext";

const ContinueWatchingBanner = () => {
  const { t } = useI18n();

  return (
    <div className="mx-10">
      <div className="relative bg-[url('/assets/images/orangeBg.jpg')] w-full bg-cover rounded-[20px] hidden lg:flex p-10 flex-col">
        <h1 className="text-[40px] tracking-[-3%] md:max-w-[844px]">
          {t("personal_account.continue_watching.title")}
        </h1>
        <button
          className="flex items-center mt-10 cursor-pointer bg-white py-[17px] w-[370px] px-10 text-[#3D334A] justify-between rounded-[10px]"
        >
          {t("personal_account.continue_watching.button")} <GoArrowRight size={20} className="mb-1" />
        </button>
        <Image
          src={"/assets/images/laptop.png"}
          width={347}
          height={347}
          alt="laptop"
          className="absolute object-cover -top-10 right-[50px]"
        />
      </div>
    </div>
  );
};

export default ContinueWatchingBanner;
