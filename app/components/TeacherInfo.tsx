"use client"
import Image from "next/image";
import { PiStudent } from "react-icons/pi";
import { FaCertificate } from "react-icons/fa6";
import { MdOutlineWeb } from "react-icons/md";
import DesktopNavbar from "./Navbar/DesktopNavbar";
import { defaultMenuItems } from "./Header";
import { useI18n } from "../context/I18nContext";

import Professional from "./Professional";
import Certificate from "./Certificate";
import Subscribe from "./Subscribe";
import { Footer } from "./Footer";
import { useInstructor } from "../hooks/useInstructor";

const ContentsSidebar = ({ htmlContent }: { htmlContent?: string }) => {
  const { t } = useI18n();
  
  // Extract headings from HTML content
  const extractHeadings = (html: string) => {
    
    if (!html) return [];
    
    // First, let's see if there are any h3-like patterns
    
    const headings: { id: string; text: string; index: number }[] = [];
    let index = 1;
    
    // Try different patterns for h3 headings
    const patterns = [
      // Standard h3 tags
      /<h3[^>]*>(.*?)<\/h3>/gi,
      // HTML encoded h3 tags  
      /&lt;h3[^&]*&gt;(.*?)&lt;\/h3&gt;/gi,
      // Mixed patterns
      /&lt;h3&gt;(.*?)&lt;\/h3&gt;/gi,
    ];
    
    for (const pattern of patterns) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      
      while ((match = regex.exec(html)) !== null) {
        
        const headingText = match[1]
          .replace(/<[^>]*>/g, '') // Remove any HTML tags inside h3
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .trim();
        
        if (headingText && !headings.find(h => h.text === headingText)) {
          headings.push({
            id: `heading-${index}`,
            text: headingText,
            index
          });
          index++;
        }
      }
      
      if (headings.length > 0) {
        break; // Stop trying other patterns if we found headings
      }
    }
    
    return headings;
  };
  
  const headings = extractHeadings(htmlContent || '');
  
  // Temporarily show sidebar even if no headings for debugging
  // if (headings.length === 0) {
  //   return null;
  // }
  
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm">
      <h3 className="text-[#3D334A] text-[16px] font-semibold mb-4">
        {t('teacher.contents')}
      </h3>
      {headings.length === 0 ? (
        <p className="text-sm text-gray-500">
          Debug: No headings found. HTML length: {htmlContent?.length || 0}
        </p>
      ) : (
        <ol className="flex flex-col gap-2 text-[14px]">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a 
                href={`#${heading.id}`} 
                className="text-[#846FA0] hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

interface TeacherInfoProps {
  instructorId?: string;
}

const TeacherInfo = ({ instructorId }: TeacherInfoProps) => {
  const { t, locale } = useI18n();
  const { instructor, loading, error } = useInstructor(instructorId || ""); 

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div>{t('common.error')}: {error}</div>;
  
  // Function to get multilingual content (for bio and htmlContent)
  const getMultilingualContent = (content: { ka: string; en: string; ru: string } | undefined): string => {
    if (!content) return '';
    return content[locale as keyof typeof content] || content.en || content.ru || content.ka || '';
  };

  // Function to clean and format HTML content
  const cleanHtmlContent = (htmlContent: string) => {
    let headingIndex = 1;
    
    return htmlContent
      // First, let's handle the outer container div with monospace styling
      .replace(/<div style="color: #7b88a1; font-size: 12px; font-family: Menlo, Monaco, 'Courier New', monospace;">/g, '<div class="text-gray-600">')
      
      // Replace specific colored spans - these seem to be for syntax highlighting
      .replace(/<span style="color: #81a1c1;">/g, '<strong class="text-blue-600">')
      .replace(/<span style="color: #7b88a1;">/g, '<span class="text-gray-700">')
      
      // Clean up any remaining style attributes
      .replace(/style="[^"]*"/g, '')
      
      // Handle HTML tag representations (these appear to be showing HTML code)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      
      // Add proper spacing to elements
      .replace(/<div>/g, '<div class="mb-3">')
      // Add IDs to h3 headings for table of contents navigation
      .replace(/<h3>/g, () => `<h3 id="heading-${headingIndex++}" class="text-xl font-bold text-[#3D334A] mt-6 mb-3">`)
      .replace(/<p>/g, '<p class="mb-4 leading-relaxed">')
      .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-4 space-y-2">')
      .replace(/<li>/g, '<li class="text-gray-700">')
      
      // Handle line breaks
      .replace(/<br>/g, '<br class="mb-2" />')
      
      // Close any unclosed tags properly
      .replace(/<\/span>/g, '</span>')
      .replace(/<\/strong>/g, '</strong>');
  };
  
  return (
    <div className="min-h-screen bg-[#F9F7FE] py-6 px-2 md:px-8">
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} allCourseBg={false} />
      <div className=" mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 w-full md:w-[270px] flex-shrink-0">
          <Image
            src={instructor?.profileImage || "/assets/images/user1.png"}
            width={270}
            height={270}
            alt={instructor?.name || "Instructor"}
            className="rounded-[15px] w-full h-[270px] object-cover mb-4"
          />
          <ContentsSidebar htmlContent={getMultilingualContent(instructor?.htmlContent)} />
        </div>
        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-sm flex flex-col gap-4 mb-6">
            <div className="text-[#3D334A] flex flex-col gap-2.5">
              <h1 className="text-[24px] md:text-[32px] leading-[120%] font-bold">
                {instructor?.name?.toUpperCase() || t('teacher.instructorName')}
              </h1>
              <p className="font-medium leading-[120%] text-[15px] md:text-base">
                {instructor?.profession || t('teacher.professionalTitle')}
                <br />
                {instructor?.email}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 mt-2">
              <div className="rounded-[20px] border border-[#E2CCFF] bg-white text-center w-full md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm">
                <PiStudent color="#D4BAFC" size={28} />
                <h5 className="text-[#D4BAFC] mt-2 text-[15px]">
                  {instructor?.coursesCount || 0} {t('teacher.courses')}
                </h5>
              </div>
              <div className="rounded-[20px] border border-[#E2CCFF] bg-white text-center w-full md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm">
                <FaCertificate color="#D4BAFC" size={28} />
                <h5 className="text-[#D4BAFC] mt-2 text-[15px]">
                  {instructor?.certificates?.length || 0} {t('teacher.certificates')}
                </h5>
              </div>
              <div className="rounded-[20px] border border-[#E2CCFF] bg-white w-full text-center md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm">
                <MdOutlineWeb color="#D4BAFC" size={28} />
                <h5 className="text-[#D4BAFC] mt-2 text-[15px]">
                  {instructor?.studentsCount || 0} {t('teacher.students')}
                </h5>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-6 md:p-10 shadow-sm">
            <h2 className="text-[#3D334A] text-[22px] md:text-[28px] font-bold mb-6">
              {t('teacher.aboutInstructor')}
            </h2>
            
            {/* Bio Section */}
            <div className="text-[#3D334A] text-[15px] md:text-base mb-6">
              <p className="mb-4">
                {getMultilingualContent(instructor?.bio) || t('teacher.bioPlaceholder')}
              </p>
            </div>

            {/* HTML Content Section */}
            {(instructor?.htmlContent?.ru || instructor?.htmlContent?.en) && (
              <div className="text-[#3D334A] text-[15px] md:text-base leading-relaxed">
                <div 
                  className="instructor-content prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: cleanHtmlContent(getMultilingualContent(instructor.htmlContent))
                  }}
                />
              </div>
            )}

            {/* Rating Section */}
            {instructor?.averageRating && instructor.averageRating > 0 && (
              <div className="mt-6 p-4 bg-[#F9F7FE] rounded-[10px]">
                <h3 className="text-[#3D334A] text-[18px] font-semibold mb-2">{t('teacher.rating')}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[#846FA0] text-[20px] font-bold">
                    {instructor.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[#3D334A]">/ 5.0</span>
                </div>
              </div>
            )}

            {/* Certificates Section */}
            {instructor?.certificates && instructor.certificates.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[#3D334A] text-[18px] font-semibold mb-4">{t('teacher.certificatesTitle')}</h3>
                <div className="grid gap-3">
                  {instructor.certificates.map((cert, index) => (
                    <div key={index} className="p-4 bg-[#F9F7FE] rounded-[10px]">
                      <h4 className="text-[#3D334A] font-medium">{cert.name}</h4>
                      <p className="text-[#846FA0] text-sm">{cert.issuer}</p>
                      <p className="text-[#846FA0] text-sm">{cert.date}</p>
                      {cert.url && (
                        <a 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#6D28D9] text-sm hover:underline"
                        >
                          {t('teacher.viewCertificate')}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6 w-[220px] flex-shrink-0">
          <Image
            src="/assets/images/reklamos.png"
            width={180}
            height={220}
            alt="ads"
            className="rounded-[10px] w-full object-cover"
          />
        </div>
      </div>
      <div className="md:mt-10">
      <Professional withBanner={false} title={""} bgColor="white" withProfText={false} />
      </div>
      <Certificate />
     <div className="my-10">
     <Subscribe
          backgroundImage="/assets/images/bluebg.jpg"
          titleKey="subscription.title"
          buttonTextKey="buttons.subscribe"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
          bgCenter={true}
          containerStyles="custom-class"
          titleStyles="text-white"
          buttonStyles="hover:opacity-80"
        />
     </div>
        <Footer />
    </div>
  );
};

export default TeacherInfo;
