import React from "react";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { defaultMenuItems } from "../components/Header";
import { FaPhoneAlt } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Image from "next/image";
import { Footer } from "../components/Footer";

const ClockIcon = () => (
  <svg
    className="w-7 h-7 md:w-9 md:h-9 text-[#3D334A]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M12 6v6l4 2" strokeWidth="2" />
  </svg>
);

const Contact = () => {
  return (
    <div>
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} />
      <MobileNavbar />
      <section className="px-2 md:px-8 py-4">
        <h2 className="font-medium text-xl md:text-2xl mb-2 md:mb-4">
          Контакты
        </h2>
        {/* Info ბლოკები */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-2 md:mb-4 w-full">
          <div className="bg-[#f7f4ff] rounded-2xl flex-1 flex flex-col justify-between p-4 gap-4 md:min-h-[192px] min-h-[163px]">
            <ClockIcon />
            <div>
              <div className="font-bold text-lg md:text-xl text-[#3D334A]">
                09:00 - 19:00 МСК
              </div>
              <div className="text-[#898989] text-sm md:text-base">
                Режим работы
              </div>
            </div>
          </div>
          <div className="bg-[#f7f4ff] rounded-2xl flex-1 flex flex-col justify-between p-4 gap-4 min-h-[192px]">
            <FaPhoneAlt className="w-5 h-7 md:w-8 md:h-8 text-[#3D334A]" />
            <div>
              <div className="font-bold text-lg md:text-xl text-[#3D334A]">
                +7 (916) 856-11-45
              </div>
              <div className="text-[#898989] text-sm md:text-base">
                Телефон горячей линии
              </div>
            </div>
          </div>
          <div className="bg-[#f7f4ff] rounded-2xl flex-1 flex flex-col justify-between p-4 gap-4 min-h-[192px]">
            <CiMail className="w-7 h-7 md:w-9 md:h-9 text-[#3D334A]" />
            <div>
              <div className="font-bold text-lg md:text-xl break-all text-[#3D334A]">
                OFFICE@GHRS-GROUP.COM
              </div>
              <div className="text-[#898989] text-sm md:text-base">
                По любым вопросам пишите сюда
              </div>
            </div>
          </div>
        </div>
        {/* ყურსასმენი + ფორმა */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
          {/* ყურსასმენების დივი */}
          <div className="bg-[#f7f4ff] rounded-2xl flex justify-center items-center p-4 mb-2 md:mb-0 w-full md:w-[453px] flex-shrink-0">
            <Image
              src="/assets/images/costumer.png"
              alt="costumerImage"
              className="w-full h-full object-contain max-w-[340px] max-h-[340px]"
              width={340}
              height={340}
            />
          </div>
          {/* ფორმის დივი */}
          <div className="bg-[#f7f4ff] rounded-2xl flex-1 px-4 py-4 md:py-5 md:px-6 flex flex-col justify-between">
            <div className="font-bold text-xl md:text-2xl mb-3 md:mb-4 flex items-center gap-2">
              <span className="text-[#3D334A]">
                ФОРМА{" "}
                <span className="font-normal text-[#B393F9]">
                  ОБРАТНОЙ СВЯЗИ
                </span>
              </span>
            </div>
            <form className="flex flex-col gap-3 md:gap-3 text-[#846FA0]">
              <div className="flex flex-col md:flex-row gap-3 text-[#846FA0]">
                <input
                  type="text"
                  placeholder="Имя"
                  className="bg-white  rounded-lg px-4 py-2 w-full border-none outline-none text-base md:text-lg"
                  aria-label="Имя"
                />
                <input
                  type="text"
                  placeholder="Фамилия"
                  className="bg-white rounded-lg px-4 py-2 w-full border-none outline-none text-base md:text-lg"
                  aria-label="Фамилия"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Адрес электронной почты"
                  className="bg-white rounded-lg px-4 py-2 w-full border-none outline-none text-base md:text-lg"
                  aria-label="Адрес электронной почты"
                />
                <input
                  type="text"
                  placeholder="Тема"
                  className="bg-white rounded-lg px-4 py-2 w-full border-none outline-none text-base md:text-lg"
                  aria-label="Тема"
                />
              </div>
              <textarea
                placeholder="Текст вашего письма"
                className="bg-white rounded-lg px-4 py-2 w-full border-none outline-none text-base md:text-lg min-h-[80px] md:min-h-[90px] resize-none"
                aria-label="Текст вашего письма"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-[#B393F9] cursor-pointer hover:bg-[#a179f7] text-white font-bold rounded-lg px-8 py-2 text-base md:text-lg transition"
                >
                  ОТПРАВИТЬ
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
