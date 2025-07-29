// import React from "react";
// import Image from "next/image";
// import SliderArrows from "./SliderArrows";
// import CustomBadge from "./CustomBadge";
// const Section = ({
//   border,
//   borderColor,
// }: {
//   border: number;
//   borderColor: string;
// }) => {
//   return (
//     <div
//       style={{ border: `${border}px solid ${borderColor}` }}
//       className="px-10 py-[50px] rounded-[30px] bg-[#F9F7FE] mx-6 md:mb-10"
//     >
//       <div className=" flex items-center justify-between">
//         <div className="flex flex-col gap-5">
//           <h1 className="text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%]">
//             Разделы
//           </h1>
//           <span className="text-[#D4BAFC] text-[24px] leading-[90%] uppercase">
//             Смотреть все →
//           </span>
//         </div>
//         <div>
//           <SliderArrows
//             onScrollLeft={function (): void {
//               throw new Error("Function not implemented.");
//             }}
//             onScrollRight={function (): void {
//               throw new Error("Function not implemented.");
//             }}
//           />
//         </div>
//       </div>
//       {/*  */}
//       <div className="flex flex-row items-center gap-[28px] overflow-x-auto whitespace-nowrap scrollbar-hide md:overflow-visible md:whitespace-normal">
//         <div className="mt-[48px] w-[558px] relative h-[283px] bg-white p-2 rounded-[20px] ">
//         <div className="absolute top-1">
//             <CustomBadge text="Ортопедия" margin="m-3" />
//           </div>
//           <Image
//             src={"/assets/images/category1.png"}
//             width={542}
//             height={181}
//             alt="category1"
//           />
//           <div className="flex items-end justify-between mt-[22px] relative">
//             <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
//               Шейный отдел позвоночника
//             </h1>
//             <span className="text-[#D4BAFC] absolute -bottom-0 right-0 leading-[120%] font-medium">
//               12 комплексов
//             </span>
//           </div>
//         </div>
//         {/*  */}

//         <div className="mt-[48px] w-[558px] relative h-[283px] bg-white p-2 rounded-[20px] ">
//         <div className="absolute top-1">
//             <CustomBadge text="Ортопедия" margin="m-3" />
//           </div>
//           <Image
//             src={"/assets/images/category1.png"}
//             width={542}
//             height={181}
//             alt="category1"
//           />
//           <div className="flex items-end justify-between mt-[22px] relative">
//             <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
//               Шейный отдел позвоночника
//             </h1>
//             <span className="text-[#D4BAFC] absolute -bottom-0 right-0 leading-[120%] font-medium">
//               12 комплексов
//             </span>
//           </div>
//         </div>

//         {/*  */}

//         <div className="mt-[48px] w-[558px] h-[283px] relative bg-white p-2 rounded-[20px]">
//           <div className="absolute top-1">
//             <CustomBadge text="Ортопедия" margin="m-3" />
//           </div>
//           <Image
//             src={"/assets/images/category1.png"}
//             width={542}
//             height={181}
//             alt="category1"
//           />
//           <div className="flex items-center justify-between relative mt-[22px]">
//             <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
//               Шейный отдел позвоночника
//             </h1>
//             <span className="text-[#D4BAFC] leading-[120%] absolute -bottom-0 right-0 font-medium">
//               12 комплексов
//             </span>
//           </div>
//         </div>
//         {/*  */}
//         <div className="mt-[48px] w-[558px] h-[283px] relative bg-white p-2 rounded-[20px]">
//         <div className="absolute top-1">
//             <CustomBadge text="Ортопедия" margin="m-3" />
//           </div>
//           <Image
//             src={"/assets/images/category1.png"}
//             width={542}
//             height={181}
//             alt="category1"
//           />
//           <div className="flex items-center justify-between relative mt-[22px]">
//             <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%]">
//               Шейный отдел позвоночника
//             </h1>
//             <span className="text-[#D4BAFC] leading-[120%] absolute -bottom-0 right-0 font-medium">
//               12 комплексов
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Section;


import React, { useRef } from "react";
import CustomBadge from "./CustomBadge";

// Mock CustomBadge component
// const CustomBadge = ({ text, margin }: {text: string, margin: string}) => (
//   <div className={`bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium ${margin}`}>
//     {text}
//   </div>
// );

// SliderArrows component with working functionality
type SliderArrowsProps = {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
};

const SliderArrows = ({
  onScrollLeft,
  onScrollRight,
  canScrollLeft = true,
  canScrollRight = true,
}: SliderArrowsProps) => {
  return (
    <div className="items-center hidden md:flex gap-2">
      <div
        onClick={canScrollLeft ? onScrollLeft : undefined}
        className={`p-[14px_17px] rounded-[16px] inline-block cursor-pointer transition-colors ${
          canScrollLeft
            ? "bg-[#846FA0] hover:bg-[#735A8D]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <svg
          width={11}
          height={19}
          viewBox="0 0 11 19"
          fill="none"
          className={!canScrollLeft ? "opacity-50" : ""}
        >
          <path
            d="M9.5 1.5L2 9.5L9.5 17.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        onClick={canScrollRight ? onScrollRight : undefined}
        className={`p-[14px_17px] rounded-[16px] inline-block cursor-pointer transition-colors ${
          canScrollRight
            ? "bg-[#846FA0] hover:bg-[#735A8D]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <svg
          width={11}
          height={19}
          viewBox="0 0 11 19"
          fill="none"
          className={!canScrollRight ? "opacity-50" : ""}
        >
          <path
            d="M1.5 1.5L9 9.5L1.5 17.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

const Section = ({
  border = 0,
  borderColor = "transparent",
}: {
  border?: number;
  borderColor?: string;
}) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current && 'scrollBy' in scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollBy({
        left: -586, // width of card + gap
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current && 'scrollBy' in scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollBy({
        left: 586, // width of card + gap
        behavior: 'smooth'
      });
    }
  };

  // Sample data for cards
  const cardData = [
    {
      id: 1,
      category: "Ортопедия",
      title: "Шейный отдел позвоночника",
      complexCount: "12 комплексов",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=542&h=181&fit=crop&crop=center"
    },
    {
      id: 2,
      category: "Ортопедия",
      title: "Поясничный отдел",
      complexCount: "8 комплексов",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=542&h=181&fit=crop&crop=center"
    },
    {
      id: 3,
      category: "Кардиология",
      title: "Сердечно-сосудистая система",
      complexCount: "15 комплексов",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=542&h=181&fit=crop&crop=center"
    },
    {
      id: 4,
      category: "Неврология",
      title: "Центральная нервная система",
      complexCount: "10 комплексов",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=542&h=181&fit=crop&crop=center"
    },
    {
      id: 5,
      category: "Ортопедия",
      title: "Коленные суставы",
      complexCount: "6 комплексов",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=542&h=181&fit=crop&crop=center"
    }
  ];

  return (
    <div
      style={{ border: `${border}px solid ${borderColor}` }}
      className="px-10 py-[50px] rounded-[30px] bg-[#F9F7FE] mx-6 md:mb-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <h1 className="text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%] font-bold">
            Разделы
          </h1>
          <span className="text-[#D4BAFC] text-[24px] leading-[90%] uppercase cursor-pointer hover:text-[#B69EE8] transition-colors">
            Смотреть все →
          </span>
        </div>
        <div>
          <SliderArrows
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
          />
        </div>
      </div>

      {/* Slider container */}
      <div 
        ref={scrollRef}
        className="flex flex-row items-center gap-[28px] overflow-x-auto scrollbar-hide mt-[48px] scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {cardData.map((card) => (
          <div
            key={card.id}
            className="min-w-[558px] h-[283px] relative bg-white p-2 rounded-[20px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="absolute top-1 z-10">
              <CustomBadge text={card.category} margin="m-3" />
            </div>
            <img
              src={card.image}
              width={542}
              height={181}
              alt={`category-${card.id}`}
              className="w-full h-[181px] object-cover rounded-[16px]"
            />
            <div className="flex items-end justify-between mt-[22px] relative">
              <h1 className="text-[#3D334A] w-[342px] text-[28px] leading-[100%] font-semibold">
                {card.title}
              </h1>
              <span className="text-[#D4BAFC] absolute -bottom-0 right-0 leading-[120%] font-medium">
                {card.complexCount}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Section;