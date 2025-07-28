import React from "react";

const DayBoxes = () => {
  const days = [
    { label: "Пн", color: "#D4BAFC" },
    { label: "Вт", color: "#D4BAFC" },
    { label: "СР", color: "#D4BAFC" },
    { label: "ЧТ", color: "#D4BAFC" },
    { label: "ПТ", color: "#F9F7FE" },
    { label: "СБ", color: "#F9F7FE" },
    { label: "ВС", color: "#F9F7FE" },
  ];

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-row items-center gap-[4px]">
        {days.map((day, index) => (
          <div key={index}>
            <span className="text-[#3D334A] text-[14px] md:text-[18px] tracking-[-1%]">
              {day.label}
            </span>
            <div
              className="w-[30px] h-[30px] md:w-10 md:h-10 rounded-[4px]"
              style={{ backgroundColor: day.color }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayBoxes;
