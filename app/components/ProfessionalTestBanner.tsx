"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "../context/I18nContext";

interface ProfessionalTestBannerProps {
  href?: string;
  backgroundImage?: string;
}

function resolveTranslation(t: (key: string) => string, key: string): string {
  const value = t(key);
  return value !== key ? value : "";
}

const ProfessionalTestBanner = ({
  href = "/test",
  backgroundImage = "/assets/images/bluebg.jpg",
}: ProfessionalTestBannerProps) => {
  const { t, locale } = useI18n();
  const router = useRouter();

  const titleLine1 =
    resolveTranslation(t, "professional.test_banner.title_line1") ||
    resolveTranslation(t, "professional.test_banner.title");
  const titleLine2 = resolveTranslation(t, "professional.test_banner.title_line2");
  const buttonText = resolveTranslation(t, "professional.test_banner.button");

  const titleClassName = [
    "text-white text-[16px] md:text-[28px] lg:text-[34px] md:max-w-[960px] lg:max-w-[1100px] tracking-[-0.02em] leading-[118%] md:leading-[112%] font-bowler",
    locale === "ru" ? "normal-case" : "uppercase",
  ].join(" ");

  return (
    <div className="mb-6 md:mb-10 mt-10 md:mt-0 md:px-5">
      <div
        className="w-[359px] md:w-full md:h-[424px] bg-center rounded-[20px] mx-auto md:mx-0 p-4 md:p-8 bg-cover flex flex-col justify-between"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1
          className={titleClassName}
          style={{
            wordSpacing: "normal",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            hyphens: "none",
          }}
        >
          {titleLine2 ? (
            <>
              <span className="block">{titleLine1}</span>
              <span className="block">{titleLine2}</span>
            </>
          ) : (
            titleLine1
          )}
        </h1>

        <div
          className="flex items-center cursor-pointer rounded-[12px] md:rounded-[14px] gap-4 md:gap-5 px-4 md:px-6 py-1 md:py-1.5 w-full max-w-[359px] md:max-w-[640px] bg-white text-[#3D334A] hover:opacity-80 mt-6 md:mt-0 shrink-0"
          onClick={() => router.push(href)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push(href);
            }
          }}
        >
          <button
            type="button"
            className="w-full py-4 md:py-5 text-[20px] md:text-[26px] font-medium font-bowler uppercase text-left leading-tight"
          >
            {buttonText}
          </button>
          <Image
            src="/assets/images/rightArrow.svg"
            alt=""
            width={48}
            height={18}
            className="shrink-0"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTestBanner;
