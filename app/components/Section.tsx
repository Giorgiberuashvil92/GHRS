import React from "react";
import Image from "next/image";
import SliderArrows from "./SliderArrows";
const Section = ({
  border,
  borderColor,
}: {
  border: number;
  borderColor: string;
}) => {
  return (
    <div
      style={{ border: `${border}px solid ${borderColor}` }}
      className="px-10 py-[50px] rounded-[30px] bg-[#F9F7FE] mx-6 md:mb-10"
    >
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <h1 className="text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%]">
            Разделы
          </h1>
          <span className="text-[#D4BAFC] text-[24px] leading-[90%] uppercase">
            Смотреть все →
          </span>
        </div>
        <div>
          <SliderArrows
            onScrollLeft={function (): void {
              throw new Error("Function not implemented.");
            }}
            onScrollRight={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      </div>
      {/*  */}
      <div className="flex flex-row items-center gap-[28px] overflow-x-auto whitespace-nowrap scrollbar-hide md:overflow-visible md:whitespace-normal">
        <div className="mt-[48px] w-[558px] bg-white p-2 rounded-[20px] ">
          <Image
            src={"/assets/images/category1.png"}
            width={542}
            height={181}
            alt="category1"
          />
          <div className="flex items-center justify-between mt-[22px]">
            <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
              Шейный отдел позвоночника
            </h1>
            <span className="text-[#D4BAFC] leading-[120%] font-medium">
              12 комплексов
            </span>
          </div>
        </div>
        {/*  */}

        <div className="mt-[48px] w-[558px] min-w-[320px] md:min-w-[558px] bg-white p-2 rounded-[20px] inline-block align-top">
          <Image
            src={"/assets/images/category1.png"}
            width={542}
            height={181}
            alt="category1"
          />
          <div className="flex items-center justify-between mt-[22px]">
            <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
              Шейный отдел позвоночника
            </h1>
            <span className="text-[#D4BAFC] leading-[120%] font-medium">
              12 комплексов
            </span>
          </div>
        </div>
        {/*  */}
        <div className="mt-[48px] w-[558px] min-w-[320px] md:min-w-[558px] bg-white p-2 rounded-[20px] inline-block align-top">
          <Image
            src={"/assets/images/category1.png"}
            width={542}
            height={181}
            alt="category1"
          />
          <div className="flex items-center justify-between mt-[22px]">
            <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
              Шейный отдел позвоночника
            </h1>
            <span className="text-[#D4BAFC] leading-[120%] font-medium">
              12 комплексов
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
