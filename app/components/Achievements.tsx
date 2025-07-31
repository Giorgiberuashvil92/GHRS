import React, { useState, useEffect } from "react";
import ChallengeCard from "./ChallengeCard";
import { useI18n } from "../context/I18nContext";
import { useAchievements, Achievement } from "../hooks/useAchievements";

type Props = {
  alwaysShowAll?: boolean;
};

const Achievements: React.FC<Props> = ({ alwaysShowAll }) => {
  const [showAll, setShowAll] = useState(false);
  const { achievements, loading, error, refetch } = useAchievements();
  const { t, locale } = useI18n();

  // Listen for achievement updates
  useEffect(() => {
    const handleAchievementsUpdate = () => {
      refetch();
    };

    window.addEventListener('achievementsUpdate', handleAchievementsUpdate);
    return () => {
      window.removeEventListener('achievementsUpdate', handleAchievementsUpdate);
    };
  }, [refetch]);

  // Get localized text from achievement
  const getLocalizedText = (textObj: { en: string; ru: string; ka: string }) => {
    if (locale === 'ka') return textObj.ka || textObj.ru || textObj.en;
    if (locale === 'ru') return textObj.ru || textObj.en;
    return textObj.en || textObj.ru;
  };

  // Transform achievements for ChallengeCard
  const transformedAchievements = achievements.map((achievement: Achievement) => ({
    id: achievement.id,
    title: getLocalizedText(achievement.title),
    description: getLocalizedText(achievement.description),
    image: achievement.image,
    imageBg: achievement.imageBg,
    current: achievement.current,
    total: achievement.total,
  }));

  const showEverything = alwaysShowAll || showAll;
  const visibleAchievements = showEverything
    ? transformedAchievements
    : transformedAchievements.slice(0, 4);

  if (loading) {
    return (
      <div className="p-4 md:px-10 md:mx-10 rounded-[20px] bg-[#F9F7FE] mt-2 md:mt-5">
        <h1 className="text-[#3D334A] mb-4 text-[18px] md:text-[40px] leading-[120%] tracking-[-3%]">
          {t("personal_account.achievements.title")}
        </h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:px-10 md:mx-10 rounded-[20px] bg-[#F9F7FE] mt-2 md:mt-5">
        <h1 className="text-[#3D334A] mb-4 text-[18px] md:text-[40px] leading-[120%] tracking-[-3%]">
          {t("personal_account.achievements.title")}
        </h1>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {t("common.retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 md:px-10 md:mx-10 rounded-[20px] bg-[#F9F7FE] mt-2 md:mt-5">
        <h1 className="text-[#3D334A] mb-4 text-[18px] md:text-[40px] leading-[120%] tracking-[-3%]">
          {t("personal_account.achievements.title")}
        </h1>
        {visibleAchievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-xl p-12">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {t("personal_account.achievements.no_achievements")}
              </h3>
              <p className="text-gray-600">
                {t("personal_account.achievements.start_exercising")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
            {visibleAchievements.map((item) => (
              <ChallengeCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
      {!alwaysShowAll && transformedAchievements.length > 4 && (
        <div className="flex justify-end mt-6 px-4 md:px-10 md:mx-10">
          <button
            className="bg-[#D4BAFC] hover:bg-[#be9def] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll
              ? t("personal_account.achievements.hide")
              : t("personal_account.achievements.share")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Achievements;
