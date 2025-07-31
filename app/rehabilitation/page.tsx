"use client";
import React from "react";
import Header from "../components/Header";
import VideoNotification from "../components/VideoNotification";
import Advantages from "../components/Advantages";
import Image from "next/image";
import Category from "../components/Category";
import { Footer } from "../components/Footer";
import { useI18n } from "../context/I18nContext";

const Rehabilitation = () => {
  const { t } = useI18n();

  return (
    <div className="">
      <Header variant="rehabilitation" />
      <VideoNotification variant="default" />
      <Advantages />
      <section className="md:max-w-full flex flex-col gap-5 px-2 md:px-8">
        <h2 className="md:text-[64px] text-2xl text-[rgba(61,51,74,1)] md:pb-10 pb-6">
          {typeof t("rehabilitation.page.subscription.title") === "string"
            ? t("rehabilitation.page.subscription.title")
            : "Subscription"}
        </h2>
        <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover w-full  overflow-hidden  bg-center md:p-5 p-4 h-[260px] md:h-[386px] md:rounded-[20px] rounded-3xl">
          <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
              <h3 className="md:text-[42px] text-2xl text-[rgba(255,255,255,1)] uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                {typeof t("rehabilitation.page.subscription.payment.title") === "string"
                  ? t("rehabilitation.page.subscription.payment.title")
                  : "Various Payment Methods"}
              </h3>
              <Image
                src="/assets/images/wallet.png"
                alt="wallet"
                width={23}
                height={21}
              />
            </div>
            <p className="text-[rgba(255,255,255,1)] font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full md:mt-5 mt-[60px]">
              {typeof t("rehabilitation.page.subscription.payment.description") === "string"
                ? t("rehabilitation.page.subscription.payment.description")
                : ""}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
          <div className="grid grid-cols-1 gap-5">
            <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover bg-center w-full max-w-full overflow-hidden h-[260px] md:h-[386px] rounded-3xl md:rounded-[20px] p-4 md:p-5">
              <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
                  <h3 className="md:text-[42px] text-2xl text-white uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                    {typeof t("rehabilitation.page.subscription.planning.title") === "string"
                      ? t("rehabilitation.page.subscription.planning.title")
                      : "Planning"}
                  </h3>
                  <Image
                    src="/assets/images/Pin.png"
                    alt="pin"
                    width={39}
                    height={39}
                  />
                </div>
                <p className="text-white font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full mt-[60px] md:mt-5">
                  {typeof t("rehabilitation.page.subscription.planning.description") === "string"
                    ? t("rehabilitation.page.subscription.planning.description")
                    : ""}
                </p>
              </div>
            </div>
            <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover bg-center w-full max-w-full overflow-hidden h-[260px] md:h-[386px] rounded-3xl md:rounded-[20px] p-4 md:p-5">
              <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
                  <h3 className="md:text-[42px] text-2xl text-white uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                    {typeof t("rehabilitation.page.subscription.trial.title") === "string"
                      ? t("rehabilitation.page.subscription.trial.title")
                      : "Trial Subscription"}
                  </h3>
                  <Image
                    src="/assets/images/Key.png"
                    alt="key"
                    width={45}
                    height={25}
                  />
                </div>
                <p className="text-white font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full mt-[60px] md:mt-5">
                  {typeof t("rehabilitation.page.subscription.trial.description") === "string"
                    ? t("rehabilitation.page.subscription.trial.description")
                    : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover bg-center w-full max-w-full overflow-hidden h-[260px] md:h-[386px] rounded-3xl md:rounded-[20px] p-4 md:p-5">
              <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
                  <h3 className="md:text-[42px] text-2xl text-white uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                    {typeof t("rehabilitation.page.subscription.course_access.title") === "string"
                      ? t("rehabilitation.page.subscription.course_access.title")
                      : "Course Access"}
                  </h3>
                  <Image
                    src="/assets/images/Alarm.png"
                    alt="alarm"
                    width={41}
                    height={41}
                  />
                </div>
                <p className="text-white font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full mt-[60px] md:mt-5">
                  {typeof t("rehabilitation.page.subscription.course_access.description") === "string"
                    ? t("rehabilitation.page.subscription.course_access.description")
                    : ""}
                </p>
              </div>
            </div>

            <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover bg-center w-full max-w-full overflow-hidden h-[260px] md:h-[386px] rounded-3xl md:rounded-[20px] p-4 md:p-5">
              <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
                  <h3 className="md:text-[42px] text-2xl text-white uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                    {typeof t("rehabilitation.page.subscription.cancellation.title") === "string"
                      ? t("rehabilitation.page.subscription.cancellation.title")
                      : "Cancel Subscription"}
                  </h3>
                  <Image
                    src="/assets/images/Cross.png"
                    alt="cross"
                    width={54}
                    height={54}
                  />
                </div>
                <p className="text-white font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full mt-[60px] md:mt-5">
                  {typeof t("rehabilitation.page.subscription.cancellation.description") === "string"
                    ? t("rehabilitation.page.subscription.cancellation.description")
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover w-full overflow-hidden bg-center md:p-10 p-4 h-[260px] md:h-[386px] md:rounded-[20px] rounded-3xl">
          <h3 className="md:text-[42px] text-2xl text-[rgba(255,255,255,1)] md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
            {typeof t("rehabilitation.page.subscription.discount.title") === "string"
              ? t("rehabilitation.page.subscription.discount.title")
              : ""}
          </h3>
          <div className="md:max-w-[862px] md:ml-4 cursor-pointer max-w-[327px] md:p-5 p-[10px] rounded-[10px] bg-[rgba(255,255,255,1)] flex items-center gap-5 absolute bottom-4 left-4">
            <span className="md:text-[32px] text-[rgba(61,51,74,1)]">
              {typeof t("rehabilitation.page.subscription.discount.button") === "string"
                ? t("rehabilitation.page.subscription.discount.button")
                : "Purchase Subscription"}
            </span>
            <Image
              src="/assets/images/rightArrow.svg"
              alt="right arrow"
              width={41}
              height={41}
            />
          </div>
        </div>
      </section>

      <div className="md:mt-10 mt-5 md:mx-5">
        <Category bgColor={""} customRounded="30px" customMx="10px" />
      </div>
      <section className="px-2 md:px-8 mx-2 mt-10 md:mx-8 relative md:max-w-full md:h-[404px] h-[471px] bg-[rgba(249,247,254,1)] rounded-[20px] mx:p-[40] pt-[40px] pb-0 flex flex-col md:justify-between overflow-visible">
        <div className="flex flex-col justify-between md:pb-[40px] gap-[35px]">
          <div className="md:pb-25">
            <h2 className="md:text-[48px] text-xl text-[rgba(61,51,74,1)] uppercase tracking-[-3%] leading-[100%] pb-4">
              {typeof t("rehabilitation.page.no_plan.title") === "string"
                ? t("rehabilitation.page.no_plan.title")
                : "No Rehabilitation Plan?"}
            </h2>
            <p className="md:text-2xl text-[14px] text-[rgba(61,51,74,1)] font-medium tracking-[-3%] leading-[100%]">
              {typeof t("rehabilitation.page.no_plan.description") === "string"
                ? t("rehabilitation.page.no_plan.description")
                : ""}
            </p>
          </div>
          <div className="md:max-w-[562px] max-w-[327px] md:p-5 p-[10px] rounded-[10px] bg-[rgba(255,255,255,1)] flex items-center gap-5">
            <span className="md:text-[32px] text-[rgba(61,51,74,1)]">
              {typeof t("rehabilitation.page.no_plan.button") === "string"
                ? t("rehabilitation.page.no_plan.button")
                : "Book Consultation"}
            </span>
            <Image
              className="w-[26px] h-[19px]"
              src="/assets/images/rightArrow.svg"
              alt="right arrow"
              width={26}
              height={19}
            />
          </div>
        </div>
        <div className="absolute bottom-0 md:right-[64px] right-0 pb-0">
          <Image
            className="md:w-[316px] w-[197px] h-[267px] md:h-[427px] relative top-[-12px] object-cover object-top"
            src="/assets/images/doctor.png"
            alt="doctor picture"
            width={316}
            height={427}
          />
        </div>
      </section>
      <div className="md:mt-10 mt-5">
        <Footer />
      </div>
    </div>
  );
};

export default Rehabilitation;
