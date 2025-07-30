import React, { useState } from "react";
import ChallengeCard from "./ChallengeCard";
import { useI18n } from "../context/I18nContext";

type Achievement = {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageBg?: string;
  current?: number;
  total?: number;
};

type Props = {
  achievements: Achievement[];
  alwaysShowAll?: boolean;
};

const Achievements: React.FC<Props> = ({ achievements, alwaysShowAll }) => {
  const [showAll, setShowAll] = useState(false);
  const showEverything = alwaysShowAll || showAll;
  const visibleAchievements = showEverything
    ? achievements
    : achievements.slice(0, 4);
  const { t } = useI18n();

  return (
    <div>
      <div className="p-4 md:px-10 md:mx-10 rounded-[20px] bg-[#F9F7FE] mt-2 md:mt-5">
        <h1 className="text-[#3D334A] mb-4 text-[18px] md:text-[40px] leading-[120%] tracking-[-3%]">
          {t("personal_account.achievements.title")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
          {visibleAchievements.map((item) => (
            <ChallengeCard key={item.id} {...item} />
          ))}
        </div>
      </div>
      {!alwaysShowAll && (
        <button
          className="md:w-[632px] items-end justify-end absolute right-14 text-white mt-6 py-3 px-6 bg-[#D4BAFC] text-lg md:text-xl rounded-[10px] font-bold hover:bg-[#B1E5FC] transition-colors"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll
                      ? t("personal_account.achievements.hide")
          : t("personal_account.achievements.share")}
        </button>
      )}
    </div>
  );
};

export default Achievements;
