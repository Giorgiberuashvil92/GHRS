"use client";

import React, { useEffect, useState, useMemo } from "react";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../components/Header/Header";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { CiSearch } from "react-icons/ci";
import CategoryFilter from "../components/CategoryFilter";
import { useRouter } from "next/navigation";
import { Footer } from "../components/Footer";
import CustomBadge from "../components/CustomBadge";
import { API_CONFIG } from "../config/api";
import { useI18n } from "../context/I18nContext";

interface Course {
  _id: string;
  title: {
    en: string;
    ru: string;
  };
  description: {
    en: string;
    ru: string;
  };
  price: number;
  thumbnail: string;
  instructor: {
    name: string;
  };
  categoryId?: string;
  subcategoryId?: string;
  categoryIds?: string[];
}

const AllCourse = () => {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const { t, locale } = useI18n();
  type SortKey = "popularity" | "newest" | "priceAsc" | "priceDesc";
  const [sortKey, setSortKey] = useState<SortKey>("popularity");
  const sortByLabel = t(`sort.${sortKey}`);

  const getLocalizedTitle = (title: Course["title"]) => {
    if (typeof title === "string") return title;
    const key = locale as keyof typeof title;
    return (title[key] || title.ru || title.en || "").trim() || String(title.ru || title.en || "");
  };

  const ITEMS_PER_PAGE = 9;

  // ყველა კურსის ჩამოტვირთვა ერთხელ
  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      
      // ✅ FIXED: Always use /api prefix - Next.js rewrites will handle routing
      const endpoint = '/api/courses?limit=1000&isPublished=true';
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${endpoint}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setAllCourses(data.courses || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ლოკალური ფილტრაცია და სორტირება
  const filteredCourses = useMemo(() => {
    let filtered = [...allCourses];

    // ძებნა
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.ru.toLowerCase().includes(searchLower) ||
          course.title.en.toLowerCase().includes(searchLower) ||
          course.description.ru.toLowerCase().includes(searchLower) ||
          course.description.en.toLowerCase().includes(searchLower) ||
          course.instructor.name.toLowerCase().includes(searchLower)
      );
    }

    // კატეგორიის ფილტრი (categoryIds ან categoryId)
    if (selectedCategoryId) {
      filtered = filtered.filter(
        (course) =>
          (course.categoryIds && course.categoryIds.includes(selectedCategoryId)) ||
          course.categoryId === selectedCategoryId
      );
    }

    // საბკატეგორიის ფილტრი
    if (selectedSubcategoryId) {
      filtered = filtered.filter(
        (course) =>
          (course.categoryIds && course.categoryIds.includes(selectedSubcategoryId)) ||
          course.subcategoryId === selectedSubcategoryId
      );
    }

    // სორტირება
    if (sortKey === "popularity") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortKey === "newest") {
      filtered.sort(
        (a, b) => new Date(b._id).getTime() - new Date(a._id).getTime()
      );
    } else if (sortKey === "priceAsc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortKey === "priceDesc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [
    allCourses,
    searchTerm,
    selectedCategoryId,
    selectedSubcategoryId,
    sortKey,
  ]);

  // პაგინაცია
  const paginatedCourses = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, page]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  // კატეგორია/საბკატეგორია -> კურსების რაოდენობა (ჩიპებზე [N]-ისთვის)
  const courseCountByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    allCourses.forEach((c) => {
      if (c.categoryIds?.length) {
        c.categoryIds.forEach((id) => {
          map[id] = (map[id] || 0) + 1;
        });
      } else {
        if (c.categoryId) map[c.categoryId] = (map[c.categoryId] || 0) + 1;
        if (c.subcategoryId) map[c.subcategoryId] = (map[c.subcategoryId] || 0) + 1;
      }
    });
    return map;
  }, [allCourses]);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // როცა ფილტრები იცვლება, გვერდი უნდა დავაბრუნოთ პირველზე
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategoryId, selectedSubcategoryId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
  };

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
  };

  const handleSortChange = (newSortBy: string) => {
    const key = (["popularity", "newest", "priceAsc", "priceDesc"] as const).find(
      (k) => t(`sort.${k}`) === newSortBy
    );
    if (key) setSortKey(key);
  };

  const handleCourseClick = (courseId: string) => {
    const url = `/singleCourse/${courseId}`;
    router.push(url);
  };

  if (loading) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-700">
            {t("course.all_courses.loading")}
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F9F7FE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-600 mb-4">
            {t("course.all_courses.error")}
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7FE] pb-40">
      <DesktopNavbar
        allCourseBg={true}
        menuItems={defaultMenuItems}
        blogBg={false}
      />
      <MobileNavbar />
      <div className="mx-2 px-4">
        <h1 className="text-[#3D334A] text-[40px] mx-5 leading-[120%] tracking-[-3%] mb-[61px]">
          {t("course.all_courses.title")}
        </h1>
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={t("course.all_courses.search_placeholder")}
            className="w-full bg-white border focus:outline-purple-[#D4BAFC] border-[#D4BAFC] rounded-[54px] px-[50px] py-[15px] mb-2 text-[#846FA0] text-[19px] font-medium"
          />
          <CiSearch
            color="black"
            size={25}
            className="absolute top-[16px] left-4"
          />
        </div>
        <CategoryFilter
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onSortChange={handleSortChange}
          courseCountByCategory={courseCountByCategory}
          sortValue={sortByLabel}
          forCourses
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {paginatedCourses.length > 0 ? (
            paginatedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-[20px] shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCourseClick(course._id)}
              >
                <img
                  src={course.thumbnail}
                  alt={getLocalizedTitle(course.title)}
                  className="w-[690px] h-[249px] object-cover rounded-[20px]"
                />
                <CustomBadge text={t("course.all_courses.badge_english")} />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#3D334A] mb-2">
                    {getLocalizedTitle(course.title)}
                  </h3>
                  <p className="text-[#846FA0] mb-4">
                    {t("course.all_courses.instructor")}: {course.instructor.name}
                  </p>
                  <div className="flex justify-end">
                    <div className="bg-[#D4BAFC] py-[10px] px-10 rounded-[6px] inline-block">
                      <span className="text-2xl font-bold text-white leading-[100%]">
                        ${course.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-[#846FA0] mb-4">
                {t("course.all_courses.no_courses")}
              </h3>
              <p className="text-[#846FA0]">{t("course.all_courses.try_other_search")}</p>
            </div>
          )}
        </div>

        {/* პაგინაცია */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  page === i + 1
                    ? "bg-[#D4BAFC] text-white"
                    : "bg-white text-[#3D334A] hover:bg-[#f0e6ff]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mb-40 flex items-center justify-center mx-auto bg-[#D4BAFC] cursor-pointer rounded-[8px] w-[300px] py-[12px] hover:bg-[#be9def] mt-20">
        <button className="text-white text-[22px] leading-[100%] tracking-[-1%]">
          {t("course.all_courses.show_more")}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default AllCourse;
