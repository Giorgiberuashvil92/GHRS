"use client";
import React from "react";
import Header from "../components/Header";

import VideoNotification from "../components/VideoNotification";
import Advantages from "../components/Advantages";
import Image from "next/image";
import Category from "../components/Category";

const Rehabilitation = () => {
  return (
    <div className="">
      <Header variant="rehabilitation" />
      <VideoNotification variant="default" />
      <Advantages />
      <section className="md:max-w-full flex flex-col gap-5 px-2 md:px-8">
        <h2 className="md:text-[64px] text-2xl text-[rgba(61,51,74,1)] md:pb-10 pb-6">
          Подписка
        </h2>
        <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover w-full  overflow-hidden  bg-center md:p-5 p-4 h-[260px] md:h-[386px] md:rounded-[20px] rounded-3xl">
          <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
              <h3 className="md:text-[42px] text-2xl text-[rgba(255,255,255,1)] uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                Различные способы оплаты
              </h3>
              <Image
                src="/assets/images/wallet.png"
                alt="vallet"
                width={23}
                height={21}
              />
            </div>
            <p
              className="
           text-[rgba(255,255,255,1)] font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full md:mt-5 mt-[60px]"
            >
              Оплатить подписку можно с помощью банковской карты или QR-кода в
              личном кабинете
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
          <div className="grid grid-cols-1 gap-5">
            <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover bg-center w-full max-w-full overflow-hidden h-[260px] md:h-[386px] rounded-3xl md:rounded-[20px] p-4 md:p-5">
              <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
                  <h3 className="md:text-[42px] text-2xl text-white uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                    Планирование
                  </h3>
                  <Image
                    src="/assets/images/Pin.png"
                    alt="vallet"
                    width={39}
                    height={39}
                  />
                </div>
                <p className="text-white font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full mt-[60px] md:mt-5">
                  Возможность составлять график тренировок и получать
                  уведомления от платформы об очередной тренировке
                </p>
              </div>
            </div>
            <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover bg-center w-full max-w-full overflow-hidden h-[260px] md:h-[386px] rounded-3xl md:rounded-[20px] p-4 md:p-5">
              <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
                  <h3 className="md:text-[42px] text-2xl text-white uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                    Тестовая подписка
                  </h3>
                  <Image
                    src="/assets/images/Key.png"
                    alt="vallet"
                    width={45}
                    height={25}
                  />
                </div>
                <p className="text-white font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full mt-[60px] md:mt-5">
                  Это подписка на 3 или 5 календарных дней с возможностью
                  автоматического продления на 3 или 5 календарных дней
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover bg-center w-full max-w-full overflow-hidden h-[260px] md:h-[386px] rounded-3xl md:rounded-[20px] p-4 md:p-5">
              <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
                  <h3 className="md:text-[42px] text-2xl text-white uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                    Доступ к курсам
                  </h3>
                  <Image
                    src="/assets/images/Alarm.png"
                    alt="vallet"
                    width={41}
                    height={41}
                  />
                </div>
                <p className="text-white font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full mt-[60px] md:mt-5">
                  После оплаты подписки в вашем личном кабинете автоматически
                  активируется доступ к выбранному вами комплексу
                  видеоупражнений
                </p>
              </div>
            </div>

            <div className="relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover bg-center w-full max-w-full overflow-hidden h-[260px] md:h-[386px] rounded-3xl md:rounded-[20px] p-4 md:p-5">
              <div className="md:absolute md:bottom-0 md:left-0 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:gap-5 gap-[10px] md:items-center items-start">
                  <h3 className="md:text-[42px] text-2xl text-white uppercase md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
                    Отмена подписки
                  </h3>
                  <Image
                    src="/assets/images/Cross.png"
                    alt="vallet"
                    width={54}
                    height={54}
                  />
                </div>
                <p className="text-white font-[Pt] text-[14px] md:text-[18px] tracking-[0%] leading-[120%] font-medium md:max-w-[413px] w-full mt-[60px] md:mt-5">
                  Отменить автоматическое продление подписки можно в личном
                  кабинете сняв соответствующую отметку
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" relative bg-[url('/assets/images/orangeBg.jpg')] bg-no-repeat bg-cover w-full  overflow-hidden  bg-center md:p-10 p-4 h-[260px] md:h-[386px] md:rounded-[20px] rounded-3xl">
          <h3 className="md:text-[42px] text-2xl text-[rgba(255,255,255,1)]  md:tracking-[-1%] tracking-[-3%] md:leading-[100%] leading-[120%]">
            Скидка 10% на 3 месяца <br />и 25% на 6 месяцев подписки
          </h3>
          <div className="md:max-w-[862px] md:ml-4 cursor-pointer max-w-[327px] md:p-5 p-[10px] rounded-[10px] bg-[rgba(255,255,255,1)] flex items-center gap-5 absolute bottom-4 left-4 ">
            <span className="md:text-[32px] text-[rgba(61,51,74,1)]">
              Приобрести подписку
            </span>
            <Image
              src="/assets/images/rightArrow.svg"
              alt="vallet"
              width={41}
              height={41}
            />
          </div>
        </div>
      </section>

      <Category />
      <section className="px-2 md:px-8 mx-2 mt-6 md:mx-8 relative md:max-w-full md:h-[404px] h-[471px] bg-[rgba(249,247,254,1)] rounded-[20px] mx:p-[40] pt-[40px] pb-0 flex flex-col md:justify-between overflow-visible ">
        <div className="flex flex-col justify-between md:pb-[40px] gap-[35px]">
          <div className="md:pb-25">
            <h2 className="md:text-[48px] text-xl text-[rgba(61,51,74,1)] uppercase tracking-[-3%] leading-[100%] pb-4">
              нет плана реабилитации?
            </h2>
            <p className="md:text-2xl text-[14px] text-[rgba(61,51,74,1)] font-medium  tracking-[-3%] leading-[100%]">
              Запишитесь на консультацию <br /> ко врачу реабилитологу
            </p>
          </div>
          <div className="md:max-w-[562px] max-w-[327px] md:p-5 p-[10px] rounded-[10px] bg-[rgba(255,255,255,1)] flex items-center gap-5  ">
            <span className="md:text-[32px] text-[rgba(61,51,74,1)]">
              Приобрести подписку
            </span>
            <Image
              className="w-[26px] h-[19px]"
              src="/assets/images/rightArrow.svg"
              alt=""
              width={26}
              height={19}
            />
          </div>
        </div>
        <div className="absolute bottom-0 md:right-[64px] right-0 pb-0 ">
          <Image
            className="md:w-[316px] w-[197px] h-[267px] md:h-[427px] relative top-[-12px] object-cover object-top"
            src="/assets/images/doctor.png"
            alt="doctor picture"
            width={316}
            height={427}
          />
        </div>
      </section>
    </div>
  );
};

export default Rehabilitation;
