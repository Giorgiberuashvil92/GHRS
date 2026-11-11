import React from "react";
import Image from "next/image";
import Link from "next/link";
import { extractImageUrl } from "../../utils/extractImageUrl";
import { useArticleText } from "../../hooks/useArticleText";
import { pickLocalized } from "../../utils/pickLocalized";
import { CiBookmark } from "react-icons/ci";
import { RiShareForwardLine } from "react-icons/ri";
import { useI18n } from "../../context/I18nContext";

/**
 * @param {{ ShowText?: boolean, ShowIcons?: boolean, categoryName?: { en?: string, ru?: string, ka?: string }, article?: import("../../api/articles").Article }} props
 */
function SubHeader({ ShowText = true, ShowIcons = true, article, categoryName }) {
  const { t, locale } = useI18n();
  const articleText = useArticleText();
  const title = article ? articleText(article, "title") : t("blog.banner.title");
  const description = article ? articleText(article, "excerpt") : t("blog.banner.description");
  const categoryRef = Array.isArray(article?.categoryId) ? article.categoryId[0] : article?.categoryId;
  const categoryData = article?.categories?.[0] ?? article?.category ??
    (typeof categoryRef === "object" ? categoryRef : undefined);
  const categoryId = categoryData?._id ?? (typeof categoryRef === "string" ? categoryRef : undefined);
  const category = article
    ? pickLocalized(categoryData?.name ?? categoryName, locale) || t("navigation.blog")
    : t("blog.banner.category");
  const categoryBadgeClass = "mt-3 inline-block rounded-[8px] bg-[#E9DFF6] p-2 font-bowler uppercase text-[#3D334A]";

  return (
    <div>
      <div className="rounded-[20px] px-5 relative mx-6">
        <Image
          width={1020}
          height={718}
          src={extractImageUrl(article?.featuredImages?.[0]) || "/assets/images/blogbg.jpg"}
          alt=""
          className="md:h-[718px] md:w-full h-[317px] w-full object-cover object-center rounded-[20px]"
          priority
        />
        {ShowText && (
          <div className="absolute inset-x-5 bottom-0 rounded-[20px] bg-[#3D334A]/70 p-4 text-white md:bottom-5 md:inset-x-10 md:max-w-[945px] md:p-8">
            <h2 className="font-bowler text-[18px] leading-tight md:text-[40px]">
              {article ? (
                <Link href={`/article/${article._id}`} className="line-clamp-3 hover:underline">
                  {title}
                </Link>
              ) : (
                <>
                  <span className="hidden md:inline">{title}</span>
                  <span className="md:hidden">{t("blog.banner.mobile_title")}</span>
                </>
              )}
            </h2>
            {description && <p className="mt-3 line-clamp-2 font-pt md:mt-5 md:line-clamp-3">{description}</p>}
            {category && (article ? (
              <Link
                href={categoryId ? `/categories/${categoryId}` : "/categories"}
                className={`${categoryBadgeClass} hover:underline`}
              >
                {category}
              </Link>
            ) : (
              <span className={categoryBadgeClass}>{category}</span>
            ))}
          </div>
        )}
        {ShowIcons && (
          <div className="absolute md:top-5 top-2 md:right-5 right-2 mr-5 flex flex-col gap-2">
            <CiBookmark
              size={40}
              color="#3D334A"
              className="w-10 h-10 bg-white/30 rounded-[6px] p-2.5 cursor-pointer"
            />
            <RiShareForwardLine
              size={40}
              color="#3D334A"
              className="w-10 h-10 bg-white/30 rounded-[6px] p-2.5 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SubHeader;
