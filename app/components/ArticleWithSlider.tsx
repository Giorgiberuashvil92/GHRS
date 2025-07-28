"use client";
import React, { useState } from "react";
import Image from "next/image";

const images = [
  "/assets/images/article.jpg",
  "/assets/images/blog1.png",
  "/assets/images/blog.png",
];

const Arrow = ({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-[70px] h-[70px] flex items-center justify-center bg-white rounded-[16px] shadow transition border border-gray-200
      ${direction === "left" ? "mr-2" : ""}
      ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-black"
          : "hover:bg-gray-100"
      }`}
    aria-label={direction === "left" ? "Previous image" : "Next image"}
    type="button"
    style={{ pointerEvents: disabled ? "none" : "auto" }}
  >
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
      {direction === "left" ? (
        <path
          d="M15 18l-6-6 6-6"
          stroke={disabled ? "#aaa" : "#333"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 6l6 6-6 6"
          stroke={disabled ? "#aaa" : "#333"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  </button>
);

const ArticleWithSlider = () => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const goToPrev = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
  };
  const goToNext = () => {
    if (current < total - 1) setCurrent((prev) => prev + 1);
  };

  return (
    <div className="relative w-full max-w-full h-[518px] mb-10">
      <Image
        src={images[current]}
        width={1400}
        height={518}
        alt={`article-image-${current}`}
        className="w-full max-w-full h-[518px] object-cover rounded-[40px]"
        priority
      />
      {total > 1 && (
        <div className="absolute flex bottom-6 right-6 z-10">
          <Arrow direction="left" onClick={goToPrev} disabled={current === 0} />
          <Arrow
            direction="right"
            onClick={goToNext}
            disabled={current === total - 1}
          />
        </div>
      )}
    </div>
  );
};

export default ArticleWithSlider;
