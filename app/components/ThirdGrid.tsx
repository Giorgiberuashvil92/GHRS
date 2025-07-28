"use client";
import Image from "next/image";
import { CiBookmark } from "react-icons/ci";
import { IoIosShareAlt } from "react-icons/io";
import React from "react";
import Link from "next/link";

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

interface ThirdGridProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  blogsPerPage: number;
  blogs: Blog[];
  language: "ka" | "en" | "ru";
}

const ThirdGrid: React.FC<ThirdGridProps> = ({
  blogs,
  language
}) => {
  // 7 ელემენტი
  const otherBlogs = blogs.slice(1, 8);

  if (otherBlogs.length < 7) {
    return <div>ბლოგების რაოდენობა საკმარისი არ არის</div>;
  }

  // სწორი თანმიმდევრობა: [1, 2, 3, 4, 5, 7, 8]
  const orderedBlogs = [
    otherBlogs[0], // 1
    otherBlogs[1], // 2
    otherBlogs[2], // 3
    otherBlogs[3], // 4
    otherBlogs[4], // 5
    otherBlogs[5], // 7
    otherBlogs[6], // 8
  ];

  return (
    <div>
      <h1 className="px-5 text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%] mb-2">
        ორთოპედია
      </h1>
      <span className="text-[#D4BAFC] px-5 text-[24px] leading-[90%] uppercase mt-2">
        ყველას ნახვა →
      </span>
      {/* Desktop: grid, Mobile: horizontal scrollable flex */}
      <div
        className="
          hidden
          sm:grid
          grid-cols-4 grid-rows-4 gap-4 p-2
        "
      >
        <div className="col-span-2 row-span-2">
          {/* 1 */}
          {orderedBlogs[0] && (
            <Link href={orderedBlogs[0].articles.length > 0 ? `/article/${orderedBlogs[0].articles[0]._id}` : '#'}>
              <div className="h-[249px] flex flex-col justify-between bg-white rounded-[20px] p-2">
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-1 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[0].title[language]}
                </p>
                <p className="mt-0 text-[#846FA0] font-[Pt] font-medium leading-[120%] tracking-[0%] px-3">
                  {orderedBlogs[0].excerpt[language]}
                </p>
                <div className="px-3 pb-3 font-[Bowler] mt-2">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[0].articles.length} სტატია
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="row-span-2 col-start-1 row-start-3">
          {/* 2 */}
          {orderedBlogs[1] && (
            <Link href={orderedBlogs[1].articles.length > 0 ? `/article/${orderedBlogs[1].articles[0]._id}` : '#'}>
              <div className="h-[249px] flex flex-col justify-between bg-white rounded-[20px] p-2">
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[1].title[language]}
                </p>
                <div className="px-3 pb-3 font-[Bowler] mt-1">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%]  rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[1].articles.length} სტატია
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="row-span-2 col-start-2 row-start-3">
          {/* 3 */}
          {orderedBlogs[2] && (
            <Link href={orderedBlogs[2].articles.length > 0 ? `/article/${orderedBlogs[2].articles[0]._id}` : '#'}>
              <div className="h-[249px] flex flex-col justify-between bg-white rounded-[20px] p-2">
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[2].title[language]}
                </p>
                <div className="px-3 pb-3 font-[Bowler] mt-1">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%]  rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[2].articles.length} სტატია
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="row-span-2 col-start-3 row-start-1">
          {/* 4 */}
          {orderedBlogs[3] && (
            <Link href={orderedBlogs[3].articles.length > 0 ? `/article/${orderedBlogs[3].articles[0]._id}` : '#'}>
              <div className="h-[249px] flex flex-col justify-between bg-white rounded-[20px] p-2">
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[3].title[language]}
                </p>
                <div className="px-3 pb-3 font-[Bowler] mt-1">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%]  rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[3].articles.length} სტატია
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="row-span-4 col-start-4 row-start-1">
          {/* 5 */}
          {orderedBlogs[4] && (
            <Link href={orderedBlogs[4].articles.length > 0 ? `/article/${orderedBlogs[4].articles[0]._id}` : '#'}>
              <div className="h-full flex flex-col justify-between bg-white rounded-[20px] p-2 min-h-[100%]">
                <Image
                  src={orderedBlogs[4].imageUrl}
                  width={319}
                  height={247}
                  alt={orderedBlogs[4].title[language]}
                  className="rounded-[12px] object-cover w-full h-[247px] mb-3"
                />
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[4].title[language]}
                </p>
                <p className="mt-0 text-[#846FA0] font-medium font-[Pt] leading-[120%] tracking-[0%] px-3">
                  {orderedBlogs[4].excerpt[language]}
                </p>
                <div className="px-3 pb-3 font-[Bowler] mt-1">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[4].articles.length} სტატია
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="row-span-2 row-start-3">
          {/* 6 */}
          {orderedBlogs[5] && (
            <Link href={orderedBlogs[5].articles.length > 0 ? `/article/${orderedBlogs[5].articles[0]._id}` : '#'}>
              <div className="h-[249px] flex flex-col justify-between bg-white rounded-[20px] p-2">
                <p className="text-[#3D334A] font-[Pt] tracking-[0%] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
                  {orderedBlogs[5].title[language]}
                </p>
                <div className="px-3 pb-3 font-[Bowler] mt-1">
                  <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] rounded-[6px] text-[14px] uppercase">
                    {orderedBlogs[5].articles.length} სტატია
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* Mobile: horizontal scroll */}
      <div className="flex sm:hidden gap-4 overflow-x-auto p-2">
        {orderedBlogs.map((blog) => (
          <div
            className="min-w-[260px] max-w-[260px] flex-shrink-0 p-5 bg-white flex flex-col justify-between rounded-[20px]"
            key={blog._id}
          >
            <Image
              src={blog.imageUrl}
              alt={blog.title[language]}
              width={300}
              height={160}
              className="rounded-md object-cover w-full h-[120px] mb-3"
            />
            <p className="text-[#3D334A] text-[18px] leading-[120%] line-clamp-2 font-bold">
              {blog.title[language]}
            </p>
            <span className="text-[#3D334A] font-[Bowler] p-1.5 leading-[90%] rounded-[6px] text-[14px] uppercase mt-2 inline-block">
              {blog.articles.length} სტატია
            </span>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="w-10 h-10  rounded-[6px] flex justify-center items-center">
                <CiBookmark className="w-[14.2px] h-[18.68px] text-black" />
              </div>
              <div className="w-10 h-10  rounded-[6px] flex justify-center items-center">
                <IoIosShareAlt className="w-[14.2px] h-[18.68px] text-black" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThirdGrid;
