"use client";
import React from "react";
import { CiBookmark } from "react-icons/ci";
import { IoIosShareAlt } from "react-icons/io";

import Image from "next/image";
import BlogCard from "./BlogCard";

interface Blog {
  _id: string;
  title: { [key in "ka" | "en" | "ru"]: string };
  description: { [key in "ka" | "en" | "ru"]: string };
  excerpt: { [key in "ka" | "en" | "ru"]: string };
  imageUrl: string;
  articles: Array<{
    _id: string;
    title: { [key in "ka" | "en" | "ru"]: string };
    excerpt: { [key in "ka" | "en" | "ru"]: string };
    author: { name: string; bio?: string; avatar?: string };
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

const ThirdGrid: React.FC<ThirdGridProps> = ({ blogs, language }) => {
  const orderedBlogs = blogs.slice(1, 8);

  if (orderedBlogs.length < 7) {
    return <div>ბლოგების რაოდენობა საკმარისი არ არის</div>;
  }

  const gridMap = [
    { className: "col-span-2 row-span-2", index: 0 },
    { className: "row-span-2 col-start-1 row-start-3", index: 1 },
    { className: "row-span-2 col-start-2 row-start-3", index: 2 },
    { className: "row-span-2 col-start-3 row-start-1", index: 3 },
    {
      className: "row-span-4 col-start-4 row-start-1",
      index: 4,
      showImage: true,
      height: "h-full min-h-[100%]",
    },
    { className: "row-span-2 row-start-3", index: 5 },
  ];

  return (
    <div>
      <h1 className="px-5 text-[#3D334A] text-[40px] leading-[120%] tracking-[-3%] mb-2">
        ორთოპედია
      </h1>
      <span className="text-[#D4BAFC] px-5 text-[24px] leading-[90%] uppercase mt-2">
        ყველას ნახვა →
      </span>

      <div className="hidden sm:grid grid-cols-4 grid-rows-4 gap-4 p-2">
        {gridMap.map(({ className, index, showImage, height }) => (
          <div className={className} key={orderedBlogs[index]._id}>
            <BlogCard
              blog={orderedBlogs[index]}
              language={language}
              showImage={showImage}
              height={height}
            />
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden gap-4 overflow-x-auto p-2">
        {orderedBlogs.map((blog) => (
          <div
            className="min-w-[260px] max-w-[260px] flex-shrink-0 p-5 bg-red-500 flex flex-col justify-between rounded-[20px]"
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
              <div className="w-10 h-10 rounded-[6px] flex justify-center items-center">
                <CiBookmark className="w-[14.2px] h-[18.68px] text-black" />
              </div>
              <div className="w-10 h-10 rounded-[6px] flex justify-center items-center">
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
