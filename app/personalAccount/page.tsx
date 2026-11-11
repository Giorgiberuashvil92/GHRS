"use client";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { defaultMenuItems } from "../components/Header/Header";
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
import SubscriptionHistory from "../components/SubscriptionHistory";
import { useAllSets } from "../hooks/useSets";
import { useCategories } from "../hooks/useCategories";
import { useActivityTracker } from "../hooks/useAchievements";
import { useUserStatistics, formatTimeSpent, calculateAverageTime } from "../hooks/useUserStatistics";

// Removed dummy data - now using real user statistics

const PersonalAccountContent: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { t, locale } = useI18n();
  const router = useRouter();
  const { sets } = useAllSets();
  const { categories } = useCategories();
  const { recordActivity } = useActivityTracker();
  const { statistics: userStats, loading: statsLoading } = useUserStatistics();

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

  // Test functions for achievements
  // Generate real statistics from user data
  const statisticsData = React.useMemo(() => {
    if (!userStats) return [];
    
    const activeDays = userStats.activityDates?.length || 0;
    
    return [
      { 
        label: t("personal_account.stats.total_time") || "Total time",
        text: formatTimeSpent(userStats.totalTimeSpent || 0),
        icon: FaRegCheckCircle 
      },
      { 
        label: t("personal_account.stats.exercises") || "Exercises",
        text: `${userStats.totalExercisesCompleted || 0} ${t("personal_account.stats.exercises_label") || "exercises"}`,
        icon: FaStar 
      },
      { 
        label: t("personal_account.stats.average_time") || "Average time",
        text: calculateAverageTime(userStats.totalTimeSpent || 0, activeDays),
        icon: FaRegCheckCircle 
      },
    ];
  }, [userStats, t]);

  const testExerciseCompletion = async () => {
    try {
      await recordActivity("exercise", "test-exercise-1", 5);
      alert("Exercise activity recorded! Check achievements.");
    } catch (error) {
      console.error("Failed to record exercise:", error);
      alert("Failed to record exercise activity.");
    }
  };

  const testSetCompletion = async () => {
    try {
      await recordActivity("set", "test-set-1", 30);
      alert("Set activity recorded! Check achievements.");
    } catch (error) {
      console.error("Failed to record set:", error);
      alert("Failed to record set activity.");
    }
  };

  const testCourseCompletion = async () => {
    try {
      await recordActivity("course", "test-course-1", 120);
      alert("Course activity recorded! Check achievements.");
    } catch (error) {
      console.error("Failed to record course:", error);
      alert("Failed to record course activity.");
    }
  };

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
      <DesktopNavbar
        menuItems={defaultMenuItems}
        blogBg={false}
        allCourseBg={false}
      />
      <MobileNavbar />
      <ContinueWatchingBanner />
      
      {/* Goals and Days in Row Section */}
      <div className="mx-2 md:mx-10 md:mt-10 mt-5 flex flex-col gap-3 md:flex-row md:gap-6">
        <div className="flex-1">
          <PersonGoals
            goals={{
              currentStreak: userStats?.currentStreak || 0,
              recordStreak: userStats?.recordStreak || 0,
              calendarIntegration: "google"
            }}
          />
        </div>
        <div className="flex-1">
          <DaysInRow
            currentStreak={userStats?.currentStreak || 0}
            recordStreak={userStats?.recordStreak || 0}
            multiplier={2}
            timer="18:45:24"
          />
        </div>
      </div>

      {/* Person Info Section */}
      {user && (
        <div className="md:mt-10 mt-5">
          <PersonInfo user={user} />
        </div>
      )}

      {/* Statistics Section */}
      {statsLoading ? (
        <div className="bg-[#F9F7FE] p-10 mx-10 rounded-[20px] mt-5 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-5">
          <Statistics statistics={statisticsData} />
        </div>
      )}
      <div className="md:mt-10 mb-[100px]">
        {/* Tabs with click handler */}
        <div className="cursor-pointer px-10 bg-[#E9DFF6] mx-10 rounded-[20px]">
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
          <div>
            <Achievements alwaysShowAll />

            {/* Test buttons for achievements - Development only */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="p-4 md:px-10 md:mx-10 rounded-[20px] bg-yellow-50 border border-yellow-200 mt-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">🧪 Test Achievements (Dev Only)</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={testExerciseCompletion}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Test Exercise Completion
                  </button>
                  <button
                    onClick={testSetCompletion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Test Set Completion
                  </button>
                  <button
                    onClick={testCourseCompletion}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Test Course Completion
                  </button>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Click these buttons to simulate activities and test achievements!
                </p>
              </div>
            )} */}
          </div>
        ) : (
          <>
            {renderTabContent()}
            <WorksSlider
              title={t("personal_account.recommendations")}
              works={
                sets?.map((set) => {
                  const category = categories?.find(
                    (cat) => cat._id === set.categoryId
                  );

                  const getCategoryName = () =>
                    category?.name[locale as keyof typeof category.name] || category?.name.en || "Category";
                  const getSetTitle = () =>
                    set.name[locale as keyof typeof set.name] || set.name.en;
                  const getSetDescription = () =>
                    set.description[locale as keyof typeof set.description] || set.description.en;

                  return {
                    id: set._id,
                    title: getSetTitle(),
                    description: getSetDescription(),
                    image: set.thumbnailImage || "",
                    exerciseCount: set.totalExercises,
                    categoryName: getCategoryName(),
                    monthlyPrice: set.price?.monthly || 0,
                    categoryId: set.categoryId,
                    subcategoryId: set.subCategoryId,
                  };
                }) || []
              }
              linkType="complex"
              fromMain={false}
              seeAll={false}
              scrollable={true}
            />
            <Statistics statistics={statisticsData} />
            <Achievements />
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
