import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogCardProps {
  blog: any;
  language: "ka" | "en" | "ru";
  className?: string;
  showImage?: boolean;
  height?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  language,
  className = "",
  showImage = false,
  height = "h-[249px]",
}) => {
  const link =
    blog.articles.length > 0 ? `/article/${blog.articles[0]._id}` : "#";

  return (
    <Link href={link}>
      <div
        className={`flex flex-col justify-between bg-white rounded-[20px] p-2 ${height} ${className}`}
      >
        {showImage && (
          <Image
            src={blog.imageUrl}
            width={319}
            height={247}
            alt={blog.title[language]}
            className="rounded-[12px] object-cover w-full h-[247px] mb-3"
          />
        )}
        <p className="text-[#3D334A] font-pt tracking-[0%] mt-0 mb-2 text-[16px] md:text-[24px] leading-[120%] font-semibold px-3">
          {blog.title[language]}
        </p>
        {blog.excerpt?.[language] && (
          <p className="text-[#846FA0] font-pt font-medium leading-[120%] tracking-[0%] px-3">
            {blog.excerpt[language]}
          </p>
        )}
        <div className="px-3 pb-3 font-[Bowler] mt-1">
          <span className="text-[#3D334A] p-1.5 leading-[90%] bg-[#E9DFF6] rounded-[6px] text-[14px] uppercase">
            {blog.articles.length} სტატია
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
