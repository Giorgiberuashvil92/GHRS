"use client";
import Image from "next/image";
import { CiBookmark } from "react-icons/ci";
import { IoIosShareAlt } from "react-icons/io";
import React from "react";
import Link from "next/link";
import { FaShare } from "react-icons/fa6";

interface Blog {
  _id: string;
  title: {
    [key in "ka" | "en" | "ru"]: string;
  };
  description: {
    [key in "ka" | "en" | "ru"]: string;
  };
  excerpt: {
    [key in "ka" | "en" | "ru"]: string;
  };
  imageUrl: string;
  articles: Array<{
    _id: string;
    title: {
      [key in "ka" | "en" | "ru"]: string;
    };
    excerpt: {
      [key in "ka" | "en" | "ru"]: string;
    };
    author: {
      name: string;
      bio?: string;
      avatar?: string;
    };
    readTime: string;
    viewsCount: number;
    likesCount: number;
    createdAt: string;
  }>;
}

interface OtherGridProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  blogsPerPage: number;
  blogs: Blog[];
  language: "ka" | "en" | "ru";
}

const OtherGrid: React.FC<OtherGridProps> = ({
  blogs,
  language
}) => {
  const otherBlogs = blogs.slice(1, 6);

  if (otherBlogs.length < 5) {
    return <div>ბლოგების რაოდენობა საკმარისი არ არის</div>;
  }

  const orderedBlogs = [
    otherBlogs[0], // 1
    otherBlogs[1], // 2
    otherBlogs[2], // 3
    otherBlogs[3], // 4
    otherBlogs[4], // 5
  ];

  const gridClasses = [
    "row-span-5", // 1
    "row-span-5", // 2
    "col-span-2 row-span-3", // 3
    "row-span-2 col-start-3 row-start-4", // 4
    "row-span-2 col-start-4 row-start-4", // 5
  ];

  return (
    <div>
      <h1 className="px-5 text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%] mb-2">
        პოპულარული სტატიები
      </h1>
      <span className="text-[#D4BAFC] px-5 text-[24px] leading-[90%] uppercase mt-2">
        ყველას ნახვა →
      </span>
      <div className="grid grid-cols-4 grid-rows-5 gap-4 p-2 max-h-[518px]">
        <div className="row-span-5">
          {/* ბლოგი 1 */}
          {orderedBlogs[0] && (
            <Link href={`/blogs/${orderedBlogs[0]._id}`}>
              <div className="min-h-full h-full flex flex-col justify-between bg-white rounded-[20px] p-2">
                <Image
                  src={orderedBlogs[0].imageUrl}
                  width={319}
                  height={247}
                  alt={orderedBlogs[0].title[language]}
                  className="rounded-[12px] object-cover w-full h-[247px] mb-3"
                />
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-1 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[0].title[language]}
                </p>
                <p className="mt-0 text-[#846FA0] font-[Pt] font-medium leading-[120%] tracking-[0%] px-3">
                  {orderedBlogs[0].excerpt[language]}
                </p>
                <div className="flex items-center gap-1.5 flex-col absolute top-2 right-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <CiBookmark className="md:w-[14.2px] md:h-[18.68px] text-white" />
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <IoIosShareAlt className="md:w-[14.2px] md:h-[18.68px]" />
                  </div>
                </div>
                <div className="px-3 pb-3 font-[Bowler] mt-2">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[0].articles.length} სტატია
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="row-span-5">
          {/* ბლოგი 2 */}
          {orderedBlogs[1] && (
            <Link href={`/blogs/${orderedBlogs[1]._id}`}>
              <div className="min-h-full h-full flex flex-col justify-between bg-white rounded-[20px] p-2">
                <Image
                  src={orderedBlogs[1].imageUrl}
                  width={319}
                  height={247}
                  alt={orderedBlogs[1].title[language]}
                  className="rounded-[12px] object-cover w-full h-[247px] mb-3"
                />
                <p className="text-[#3D334A] tracking-[0%] font-[Pt] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[1].title[language]}
                </p>
                <p className="mt-0 text-[#846FA0] font-medium font-[Pt] leading-[120%] tracking-[0%] px-3">
                  {orderedBlogs[1].excerpt[language]}
                </p>
                <div className="flex items-center gap-1.5 flex-col absolute top-2 right-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <CiBookmark className="md:w-[14.2px] md:h-[18.68px] text-white" />
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <IoIosShareAlt className="md:w-[14.2px] md:h-[18.68px]" />
                  </div>
                </div>
                <div className="px-3 pb-3 font-[Bowler] mt-1">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[1].articles.length} სტატია
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="col-span-2 row-span-3">
          {/* ბლოგი 3 */}
          {orderedBlogs[2] && (
            <Link href={`/blogs/${orderedBlogs[2]._id}`}>
              <div className="min-h-full relative h-full flex flex-col justify-between bg-white rounded-[20px] p-5">
                <p className="text-[#3D334A] tracking-[0%] font-[Pt] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[2].title[language]}
                </p>
                <p className="mt-0 text-[#846FA0] font-[Pt] font-medium leading-[120%] tracking-[0%] px-3">
                  {orderedBlogs[2].excerpt[language]}
                </p>
                <div className="flex items-center gap-1.5 flex-col absolute top-2 right-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <CiBookmark className="md:w-[14.2px] md:h-[18.68px] text-white" />
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <IoIosShareAlt className="md:w-[14.2px] md:h-[18.68px]" />
                  </div>
                </div>
                <div className="px-3 pb-3 font-[Bowler] mt-4">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[2].articles.length} სტატია
                  </span>
                </div>
                <div className="absolute flex items-center right-5 bottom-[25px] gap-2">
                  <div className="bg-[#F9F7FE] w-10 h-10 flex items-center justify-center rounded-md">
                    <CiBookmark color="black" />
                  </div>
                  <div className="bg-[#F9F7FE] w-10 h-10 flex items-center justify-center rounded-md">
                    <FaShare color="black" />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="row-span-2 col-start-3 row-start-4">
          {/* ბლოგი 4 */}
          {orderedBlogs[3] && (
            <Link href={`/blogs/${orderedBlogs[3]._id}`}>
              <div className="min-h-full relative h-full flex flex-col justify-between bg-white rounded-[20px] p-5">
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[3].title[language]}
                </p>

                <div className="flex items-center gap-1.5 flex-col absolute top-2 right-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <CiBookmark className="md:w-[14.2px] md:h-[18.68px] text-white" />
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <IoIosShareAlt className="md:w-[14.2px] md:h-[18.68px]" />
                  </div>
                </div>
                <div className="px-3 pb-3 font-[Bowler] mt-4">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[3].articles.length} სტატია
                  </span>
                </div>
                <div className="absolute flex items-center right-5 bottom-[25px] gap-2">
                  <div className="bg-[#F9F7FE] w-10 h-10 flex items-center justify-center rounded-md">
                    <CiBookmark color="black" />
                  </div>
                  <div className="bg-[#F9F7FE] w-10 h-10 flex items-center justify-center rounded-md">
                    <FaShare color="black" />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="row-span-2 col-start-4 row-start-4">
          {/* ბლოგი 5 */}
          {orderedBlogs[4] && (
            <Link href={`/blogs/${orderedBlogs[4]._id}`}>
              <div className="min-h-full relative h-full flex flex-col justify-between bg-white rounded-[20px] p-5">
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[4].title[language]}
                </p>

                <div className="flex items-center gap-1.5 flex-col absolute top-2 right-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <CiBookmark className="md:w-[14.2px] md:h-[18.68px] text-white" />
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                    <IoIosShareAlt className="md:w-[14.2px] md:h-[18.68px]" />
                  </div>
                </div>
                <div className="px-3 pb-3 font-[Bowler] mt-4">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[4].articles.length} სტატია
                  </span>
                </div>
                <div className="absolute flex items-center right-5 bottom-[25px] gap-2">
                  <div className="bg-[#F9F7FE] w-10 h-10 flex items-center justify-center rounded-md">
                    <CiBookmark color="black" />
                  </div>
                  <div className="bg-[#F9F7FE] w-10 h-10 flex items-center justify-center rounded-md">
                    <FaShare color="black" />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* Mobile: horizontal scroll */}
      <div className="flex sm:hidden gap-4 overflow-x-auto p-2">
        {orderedBlogs.map((blog, idx) => (
          <Link key={blog._id} href={`/blogs/${blog._id}`}>
            <div
              className={`min-w-[200px] max-w-full p-5 bg-white flex flex-col justify-between rounded-[20px] ${gridClasses[idx]}`}
            >
              <Image
                src={blog.imageUrl}
                width={300}
                height={160}
                alt={blog.title[language]}
                className="rounded-md object-cover w-full h-[120px] mb-3"
              />
              <p className="text-[#3D334A] tracking-[0%] md:mt-[10px] mt-0 md:mb-2 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                {blog.title[language]}
              </p>
              <p className="mt-0 text-[#846FA0] font-medium leading-[120%] tracking-[0%] px-3">
                {blog.excerpt[language]}
              </p>
              <div className="flex items-center gap-1.5 flex-col absolute top-2 right-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                  <CiBookmark className="md:w-[14.2px] md:h-[18.68px] text-white" />
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#F9F7FE]/30 rounded-[6px] flex justify-center items-center">
                  <IoIosShareAlt className="md:w-[14.2px] md:h-[18.68px]" />
                </div>
              </div>
              <div className="px-3 pb-3 font-[Bowler] mt-4">
                <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                  {blog.articles.length} სტატია
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OtherGrid;
