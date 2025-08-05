import React from "react";
import { useI18n } from "../context/I18nContext";

interface DayBoxesProps {
  onDaySelect?: (dayKey: string) => void;
  selectedDays?: string[];
}

const DayBoxes: React.FC<DayBoxesProps> = ({ onDaySelect, selectedDays = [] }) => {
  const { t } = useI18n();
  
  const days = [
    { key: "monday", label: t("days.monday"), color: "#F9F7FE" },
    { key: "tuesday", label: t("days.tuesday"), color: "#F9F7FE" },
    { key: "wednesday", label: t("days.wednesday"), color: "#F9F7FE" },
    { key: "thursday", label: t("days.thursday"), color: "#F9F7FE" },
    { key: "friday", label: t("days.friday"), color: "#F9F7FE" },
    { key: "saturday", label: t("days.saturday"), color: "#F9F7FE" },
    { key: "sunday", label: t("days.sunday"), color: "#F9F7FE" },
  ];

  const handleDayClick = (dayKey: string) => {
    if (onDaySelect) {
      onDaySelect(dayKey);
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-row items-center gap-[4px]">
        {days.map((day, index) => {
          const isSelected = selectedDays.includes(day.key);
          return (
            <div key={index}>
              <span className="text-[#3D334A] text-[14px] md:text-[18px] tracking-[-1%]">
                {day.label}
              </span>
              <div
                onClick={() => handleDayClick(day.key)}
                className={`w-[30px] h-[30px] md:w-10 md:h-10 rounded-[4px] cursor-pointer transition-all duration-200 hover:opacity-80`}
                style={{ 
                  backgroundColor: isSelected ? '#D4BAFC' : day.color
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayBoxes;
