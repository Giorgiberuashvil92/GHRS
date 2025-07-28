import React from "react";

type StatisticItem = {
  label: string;
  text: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type Props = {
  statistics: StatisticItem[];
};

const Statistics: React.FC<Props> = ({ statistics }) => {
  return (
    <div className="bg-[#F9F7FE] p-4 md:p-10 md:px-10 md:mx-10 rounded-[20px] mt-2 md:mt-5">
      <h1 className="text-[#3D334A] text-[18px] md:mb-10 mb-4 leading-[120%] tracking-[-3%] md:text-[40px]">
        Статистика
      </h1>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-6">
        {statistics.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-[15px] max-w-[316px]"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-[#D4BAFC] text-[24px] leading-[100%] tracking-[-3%]">
                  {item.label}
                </h2>
                {Icon && (
                  <Icon className="text-[#D4BAFC] w-6 h-6 hidden md:block" />
                )}
              </div>
              <p className="text-[#846FA0] leading-[120%] mt-3 font-[Pt]">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Statistics;
