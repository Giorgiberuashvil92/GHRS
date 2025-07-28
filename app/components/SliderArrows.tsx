import Image from "next/image";
import React from "react";

interface SliderArrowsProps {
  onScrollLeft: () => void;
  onScrollRight: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

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
        className={`p-[14px_17px] rounded-[16px] inline-block cursor-pointer ${
          canScrollLeft
            ? "bg-[#846FA0] hover:bg-[#735A8D]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <Image
          src="/assets/images/rightIcon.svg"
          width={11}
          height={19}
          alt="leftIcon"
          className={!canScrollLeft ? "opacity-50" : ""}
        />
      </div>
      <div
        onClick={canScrollRight ? onScrollRight : undefined}
        className={`p-[14px_17px] rounded-[16px] inline-block cursor-pointer ${
          canScrollRight
            ? "bg-[#846FA0] hover:bg-[#735A8D]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <Image
          src="/assets/images/leftIcon.svg"
          width={11}
          height={19}
          alt="rightIcon"
          className={!canScrollRight ? "opacity-50" : ""}
        />
      </div>
    </div>
  );
};

export default SliderArrows;
