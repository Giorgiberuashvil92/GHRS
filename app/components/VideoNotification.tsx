import React from "react";
import Image from "next/image";
import { useI18n } from "../context/I18nContext";

interface VideoNotificationProps {
  variant?: "default" | "rehabilitation";
}

const VideoNotification = ({ variant }: VideoNotificationProps) => {
  const { t } = useI18n();

  return (
    <section
      className={`flex flex-col md:mx-10 md:mb-20 mt-56 mb-10 md:justify-between ${
        variant == "rehabilitation" ? "" : "mt-[500px] "
      }`}
    >
      <h2 className="md:text-[64px] px-2 md:px-0 items-start text-start flex justify-start w-full text-2xl text-[rgba(61,51,74,1)] md:pb-10 pb-6">
        {typeof t("video_notification.title") === "string" 
          ? t("video_notification.title") 
          : "Video Exercises"}
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 w-full items-center md:justify-between mx-auto">
        <div className="md:p-[30px] p-4 md:w-[456px] md:h-[505px] md:rounded-[40px] w-[359px] h-[397px] rounded-3xl bg-[rgba(212,186,252,1)]">
          <h3 className="md:pb-[34px] pb-8 md:text-[40px] text-4xl text-[rgba(255,255,255,1)] tracking-[-3%] leading-[120%]">
            {typeof t("video_notification.exercise_complexes.title") === "string"
              ? t("video_notification.exercise_complexes.title")
              : "Exercise Complexes"}
          </h3>
          <p className=" md:text-[18px] font-[Pt] font-medium text-[14px] text-[rgba(255,255,255,1)] tracking-[-3%]  leading-[120%]">
            {typeof t("video_notification.exercise_complexes.description") === "string"
              ? t("video_notification.exercise_complexes.description")
              : ""}
          </p>
        </div>
        <div className="relative md:p-[30px] p-4 md:w-[456px] md:h-[505px] md:rounded-[40px] w-[359px] h-[397px] rounded-3xl bg-[rgba(212,186,252,1)]">
          <h3 className="md:pb-[34px] pb-8 md:text-[40px] text-4xl text-[rgba(255,255,255,1)] tracking-[-3%] leading-[120%]">
            {typeof t("video_notification.for_children.title") === "string"
              ? t("video_notification.for_children.title")
              : "For Children"}
          </h3>
          <p className="md:text-[18px] font-[Pt] font-medium text-[14px] text-[rgba(255,255,255,1)] tracking-[-3%] leading-[120%]">
            {typeof t("video_notification.for_children.description") === "string"
              ? t("video_notification.for_children.description")
              : ""}
          </p>

          <div className="absolute bottom-4 right-4">
            <Image
              width={234}
              height={234}
              src="/assets/images/notification.png"
              alt={typeof t("video_notification.for_children.title") === "string"
                ? t("video_notification.for_children.title")
                : "For Children"}
              className="object-contain"
            />
          </div>
        </div>

        <div className=" relative md:p-[30px] p-4 md:w-[456px] md:h-[505px] md:rounded-[40px] w-[359px] h-[397px] rounded-3xl bg-[rgba(212,186,252,1)]">
          <h3 className=" md:pb-[34px] pb-8 md:text-[40px] text-4xl text-[rgba(255,255,255,1)] tracking-[-3%] leading-[120%]">
            {typeof t("video_notification.articles.title") === "string"
              ? t("video_notification.articles.title")
              : "Articles"}
          </h3>
          <p className=" md:text-[18px] font-[Pt] font-medium text-[14px] text-[rgba(255,255,255,1)] tracking-[-3%]  leading-[120%]">
            {typeof t("video_notification.articles.description") === "string"
              ? t("video_notification.articles.description")
              : ""}
          </p>
          <div className="absolute bottom-4 right-4">
            <Image
              src="/assets/images/pencil_paper.png"
              width={234}
              height={234}
              alt={typeof t("video_notification.articles.title") === "string"
                ? t("video_notification.articles.title")
                : "Articles"}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoNotification;
