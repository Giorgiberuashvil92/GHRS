import React from "react";
import { useI18n } from "../context/I18nContext";

const DayBoxes = () => {
  const { t } = useI18n();
  
  const days = [
    { label: t("days.monday"), color: "#D4BAFC" },
    { label: t("days.tuesday"), color: "#D4BAFC" },
    { label: t("days.wednesday"), color: "#D4BAFC" },
    { label: t("days.thursday"), color: "#D4BAFC" },
    { label: t("days.friday"), color: "#F9F7FE" },
    { label: t("days.saturday"), color: "#F9F7FE" },
    { label: t("days.sunday"), color: "#F9F7FE" },
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
