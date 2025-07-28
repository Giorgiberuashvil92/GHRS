import Image from "next/image";
import React from "react";
import DayBoxes from "../DayBoxes";

type DaysInRowProps = {
  currentStreak: number;
  recordStreak: number;
  multiplier?: number;
  timer?: string;
};

const DaysInRow: React.FC<DaysInRowProps> = ({
  currentStreak,
  recordStreak,
  multiplier = 1,
  timer = "00:00:00",
}) => {
  return (
    <div className="border-2 border-[#D4BAFC] rounded-[10px] p-5 md:w-full flex flex-col justify-between">
      <div className="flex items-start gap-2.5 mb-10">
        <Image
          src={"/assets/images/personalEnergy.png"}
          width={18}
          height={25}
          alt="fire"
        />
        <div className="flex flex-col md:w-full">
          <h4 className="text-[#D4BAFC] text-[18px] md:text-[24px] tracking-[-3%]">
            {currentStreak} ДНЯ ПОДРЯД
          </h4>
          <span className="text-[#846FA0] font-[Pt] font-medium md:text-[18px] leading-[120%]">
            Рекорд: {recordStreak} дней подряд
          </span>
        </div>
        <h4 className="text-[#D4BAFC] md:text-[24px] md:tracking-[-3%] md:w-full md:text-end">
          {timer}
        </h4>
      </div>
      <div className="flex items-center gap-2.5">
        <DayBoxes />
        <span className="text-[#D4BAFC] tracking-[-3%] text-[18px] md:text-[24px] mt-4">
          X{multiplier}
        </span>
      </div>
    </div>
  );
};

export default DaysInRow;
