"use client";

import React, { useEffect, useState, useMemo } from "react";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../components/Header";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { CiSearch } from "react-icons/ci";
import CategoryFilter from "../components/CategoryFilter";
import { useRouter } from "next/navigation";
import { Footer } from "../components/Footer";
import CustomBadge from "../components/CustomBadge";
import { API_CONFIG } from "../config/api";

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
}

const AllCourse = () => {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("По популярности");
  
  const ITEMS_PER_PAGE = 9;

  // ყველა კურსის ჩამოტვირთვა ერთხელ
  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/courses?limit=1000&isPublished=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setAllCourses(data.courses || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      filtered = filtered.filter(course => 
        course.title.ru.toLowerCase().includes(searchLower) ||
        course.title.en.toLowerCase().includes(searchLower) ||
        course.description.ru.toLowerCase().includes(searchLower) ||
        course.description.en.toLowerCase().includes(searchLower) ||
        course.instructor.name.toLowerCase().includes(searchLower)
      );
    }

    // კატეგორიის ფილტრი
    if (selectedCategoryId) {
      filtered = filtered.filter(course => course.categoryId === selectedCategoryId);
    }

    // საბკატეგორიის ფილტრი
    if (selectedSubcategoryId) {
      filtered = filtered.filter(course => course.subcategoryId === selectedSubcategoryId);
    }

    // სორტირება
    if (sortBy === "По популярности") {
      // შეგვიძლია დავამატოთ popularityScore თუ არსებობს, ან დავტოვოთ ისე როგორც არის
      filtered.sort((a, b) => b.price - a.price); // მაგალითად ფასის მიხედვით
    } else if (sortBy === "По новизне") {
      // თუ createdAt ველი გვაქვს
      filtered.sort((a, b) => new Date(b._id).getTime() - new Date(a._id).getTime());
    } else if (sortBy === "По цене (возрастание)") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "По цене (убывание)") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [allCourses, searchTerm, selectedCategoryId, selectedSubcategoryId, sortBy]);

  // პაგინაცია
  const paginatedCourses = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, page]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

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
    setSortBy(newSortBy);
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
            მონაცემები იტვირთება...
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
            შეცდომა კურსების ჩატვირთვაში
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
          Курсы
        </h1>
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Введите название курса или имя инструктора"
            className="w-full bg-white border focus:outline-purple-[#D4BAFC] font-[Pt] border-[#D4BAFC] rounded-[54px] px-[50px] py-[15px] mb-2 text-[#846FA0] text-[19px] font-medium"
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
                  alt={course.title.ru}
                  className="w-[690px] h-[249px] object-cover rounded-[20px]"
                />
                <CustomBadge text="нА АНГЛИЙСКОМ" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#3D334A] mb-2">
                    {course.title.ru}
                  </h3>
                  <p className="text-[#846FA0] mb-4">
                    Инструктор: {course.instructor.name}
                  </p>
                  <div className="flex justify-end">
                    <div className="bg-[#D4BAFC] py-[10px] px-10 rounded-[6px] inline-block">
                      <span className="text-2xl font-bold text-white leading-[100%] font-[Pt]">
                        ${course.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-[#846FA0] mb-4">კურსები არ მოიძებნა</h3>
              <p className="text-[#846FA0]">სცადეთ სხვა ძებნის პარამეტრები</p>
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
        <button className="text-white text-[22px] leading-[100%] tracking-[-1%]">Показать еще</button>
      </div>
      <Footer />
    </div>
  );
};

export default AllCourse;
