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
      className={`flex flex-col md:mx-10 md:mb-8 mt-8 mb-6 md:justify-between ${
        variant == "rehabilitation" ? "" : "mt-[500px] "
      }`}
    >
      <h2 className="md:text-[64px] px-2 md:px-0 items-start text-start flex justify-start w-full text-2xl text-[rgba(61,51,74,1)] md:pb-6 pb-4">
        {typeof t("video_notification.title") === "string"
          ? t("video_notification.title")
          : "Video Exercises"}
      </h2>
      <div className="flex flex-col md:flex-row md:gap-5 gap-4 w-full items-stretch justify-start md:px-0 px-2">
        <div
          className="md:p-[30px] p-4 md:flex-1 md:h-[505px] md:rounded-[40px] w-full h-[397px] rounded-3xl"
          style={{
            backgroundImage: "url('/assets/images/orangeBg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h3 className="font-bowler md:pb-[34px] pb-8 md:text-[40px] text-4xl text-[rgba(255,255,255,1)] tracking-[-3%] leading-[120%]">
            {typeof t("video_notification.exercise_complexes.title") ===
            "string"
              ? t("video_notification.exercise_complexes.title")
              : "Exercise Complexes"}
          </h3>
          <p className="font-pt md:text-[18px] font-medium text-[14px] text-[rgba(255,255,255,1)] tracking-[-3%]  leading-[120%] normal-case">
            {typeof t("video_notification.exercise_complexes.description") ===
            "string"
              ? t("video_notification.exercise_complexes.description")
              : ""}
          </p>
        </div>
        <div
          className="relative md:p-[30px] p-4 md:flex-1 md:h-[505px] md:rounded-[40px] w-full h-[397px] rounded-3xl"
          style={{
            backgroundImage: "url('/assets/images/orangeBg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h3 className="font-bowler md:pb-[34px] pb-8 md:text-[40px] text-4xl text-[rgba(255,255,255,1)] tracking-[-3%] leading-[120%]">
            {typeof t("video_notification.for_children.title") === "string"
              ? t("video_notification.for_children.title")
              : "For Children"}
          </h3>
          <p className="font-pt md:text-[18px] font-medium text-[14px] text-[rgba(255,255,255,1)] tracking-[-3%] leading-[120%] normal-case">
            {typeof t("video_notification.for_children.description") ===
            "string"
              ? t("video_notification.for_children.description")
              : ""}
          </p>

          <div className="absolute bottom-4 right-4">
            <Image
              width={234}
              height={234}
              src="/assets/images/notification.png"
              alt={
                typeof t("video_notification.for_children.title") === "string"
                  ? t("video_notification.for_children.title")
                  : "For Children"
              }
              className="object-contain"
            />
          </div>
        </div>

        <div
          className="relative md:p-[30px] p-4 md:flex-1 md:h-[505px] md:rounded-[40px] w-full h-[397px] rounded-3xl"
          style={{
            backgroundImage: "url('/assets/images/orangeBg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h3 className="font-bowler md:pb-[34px] pb-8 md:text-[40px] text-4xl text-[rgba(255,255,255,1)] tracking-[-3%] leading-[120%]">
            {typeof t("video_notification.articles.title") === "string"
              ? t("video_notification.articles.title")
              : "Articles"}
          </h3>
          <p className="font-pt md:text-[18px] font-medium text-[14px] text-[rgba(255,255,255,1)] tracking-[-3%]  leading-[120%] normal-case">
            {typeof t("video_notification.articles.description") === "string"
              ? t("video_notification.articles.description")
              : ""}
          </p>
          <div className="absolute bottom-4 right-4">
            <Image
              src="/assets/images/pencil_paper.png"
              width={234}
              height={234}
              alt={
                typeof t("video_notification.articles.title") === "string"
                  ? t("video_notification.articles.title")
                  : "Articles"
              }
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoNotification;
