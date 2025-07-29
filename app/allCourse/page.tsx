"use client";

import React, { useEffect, useState } from "react";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import { defaultMenuItems } from "../components/Header";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { CiSearch } from "react-icons/ci";
import CategoryFilter from "../components/CategoryFilter";
import { useRouter } from "next/navigation";
import { Footer } from "../components/Footer";
import CustomBadge from "../components/CustomBadge";

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
}

const AllCourse = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:4000/courses?page=${page}&limit=10&isPublished=true`;
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      if (selectedCategoryId) {
        url += `&categoryId=${selectedCategoryId}`;
      }
      if (selectedSubcategoryId) {
        url += `&subcategoryId=${selectedSubcategoryId}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, searchTerm, selectedCategoryId, selectedSubcategoryId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
    setPage(1);
  };

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    setSelectedSubcategoryId(subcategoryId);
    setPage(1);
  };

  const handleCourseClick = (courseId: string) => {
    console.log('Clicking course with ID:', courseId);
    const url = `/singleCourse/${courseId}`;
    console.log('Navigating to:', url);
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
            placeholder="Введите название упражнения"
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
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {courses.map((course) => (
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
          ))}
        </div>
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
      <Footer />
    </div>
  );
};

export default AllCourse;
