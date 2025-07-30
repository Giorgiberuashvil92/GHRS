"use client";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { defaultMenuItems } from "../components/Header";
import PersonInfo from "../components/PersonalAccount/PersonInfo";
import PersonGoals from "../components/PersonalAccount/PersonGoals";
import Achievements from "../components/Achievements";
import Statistics from "../components/Statistics";
import DaysInRow from "../components/PersonalAccount/DaysInRow";
import ContinueWatchingBanner from "../components/PersonalAccount/ContinueWatchingBanner";
import PurchasedCourses from "../components/PersonalAccount/PurchasedCourses";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { FaRegCheckCircle, FaStar } from "react-icons/fa";
import WorksSlider from "../components/WorksSlider";
import { chapterSliderInfo } from "../chapter/page";
import { users } from "../data/dummyUsers";
import SubscriptionHistory from "../components/SubscriptionHistory";

const dummyData = {
  goals: {
    currentStreak: 5,
    recordStreak: 10,
    calendarIntegration: "google",
  },
  statistics: [
    { label: "Общее время", text: "24:00:00", icon: FaRegCheckCircle },
    { label: "Упражнения", text: "150 упражнений", icon: FaStar },
    { label: "Среднее время", text: "00:45:00", icon: FaRegCheckCircle },
  ],
  achievements: [
    {
      id: "first-exercise",
      title: "Первое упражнение",
      description: "Успешно завершили первое упражнение",
      current: 1,
      total: 1,
    },
    {
      id: "five-day-streak",
      title: "5 дней подряд",
      description: "Тренировались 5 дней подряд",
      current: 5,
      total: 5,
    },
    {
      id: "professional",
      title: "Профессионал",
      description: "Завершили 50 упражнений",
      current: 25,
      total: 50,
    },
  ],
};

const PersonalAccountContent: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const tabItems = [
    { label: t("personal_account.tabs.description"), href: "#description" },
    { label: t("personal_account.tabs.additional"), href: "#extra" },
    { label: t("personal_account.tabs.demo_video"), href: "#demo" },
  ];

  // Tab state
  const [activeTab, setActiveTab] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700">
            {t("personal_account.loading")}
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen md:px-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#3D334A] mb-4">
            {t("personal_account.user_not_found")}
          </h2>
          <p className="text-[#846FA0]">
            {t("personal_account.auth_required")}
          </p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (activeTab === 0) {
      return (
        <div className="flex flex-col gap-6 mt-8 bg-[#F9F7FE] mb-5 md:m-10 md:p-10 md:rounded-[40px]">
          <PurchasedCourses />
        </div>
      );
    } else if (activeTab === 1) {
      return null;
    } else if (activeTab === 2) {
      return <SubscriptionHistory />;
    }
    return null;
  };

  return (
    <div className="md:gap-20 px-4 md:px-5">
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} allCourseBg={false} />
      <MobileNavbar />
      <ContinueWatchingBanner />
      <div className="mx-2 md:mx-10 md:mt-10 mt-0  flex flex-col gap-3 md:flex-row-reverse">
        <PersonGoals goals={dummyData.goals} />
        <DaysInRow
          currentStreak={dummyData.goals.currentStreak}
          recordStreak={dummyData.goals.recordStreak}
          multiplier={2}
          timer="18:45:24"
        />
      </div>
      <div className="md:mt-10 mb-[100px]">
        <PersonInfo user={user} />
        {/* Tabs with click handler */}
        <div className="cursor-pointer px-10">
          <div
            className={`md:col-span-2 order-2 md:order-1 md:p-[40px] p-4 rounded-[20px] flex md:gap-[40px] gap-6 items-center relative`}
          >
            {tabItems.map((item, idx) => (
              <div
                className="relative group"
                key={idx}
                onClick={() => setActiveTab(idx)}
              >
                <span
                  className={`text-[rgba(132,111,160,1)] md:text-2xl text-[14px] leading-[90%] md:leading-[120%] tracking-[0%] uppercase group-hover:text-[rgba(61,51,74,1)] ${
                    activeTab === idx ? "text-[rgba(61,51,74,1)]" : ""
                  }`}
                >
                  {item.label}
                </span>
                <div
                  className={`absolute left-0 -bottom-[42px] h-[2px] w-full bg-[rgba(61,51,74,1)] transition-transform ${
                    activeTab === idx ? "scale-x-100" : "scale-x-0"
                  } origin-left`}
                ></div>
              </div>
            ))}
          </div>
        </div>
        {/* Tab content */}
        {activeTab === 2 ? (
          <SubscriptionHistory />
        ) : activeTab === 1 ? (
          <Achievements achievements={users[0].achievements} alwaysShowAll />
        ) : (
          <>
            {renderTabContent()}
            <WorksSlider 
              title={t("personal_account.recommendations")}
              works={chapterSliderInfo.map(item => ({
                ...item,
                categoryId: item.id
              }))} 
              fromMain={false}
              seeAll={false}
              scrollable={true}
            />
            <Statistics statistics={users[0].statistics} />
            <Achievements achievements={users[0].achievements} />
          </>
        )}
      </div>
    </div>
  );
};

const PersonalAccount: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
            <h2 className="text-2xl font-semibold text-gray-700">
              {t("personal_account.loading")}
            </h2>
          </div>
        </div>
      }
    >
      <PersonalAccountContent />
    </Suspense>
  );
};

export default PersonalAccount;
