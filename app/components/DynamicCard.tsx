import Image from "next/image";
import { FaRegClock, FaArrowRight } from "react-icons/fa";
import { MdOutlinePlayLesson } from "react-icons/md";

type DynamicCardProps = {
  imageSrc: string;
  imageAlt?: string;
  tag: string;
  title: string;
  description: string;
  duration: string;
  progress: string;
  buttonText: string;
  onButtonClick?: () => void;
};

const DynamicCard = ({
  imageSrc,
  imageAlt = "Image",
  tag,
  title,
  description,
  duration,
  progress,
  buttonText,
  onButtonClick,
}: DynamicCardProps) => {
  return (
    <div className="md:p-10 py-6 px-4 mt-5 md:mx-10 ">
      <div className="bg-white p-2 md:p-5 flex flex-col md:rounded-[20px] md:gap-10 items-start">
        <div className="w-full flex flex-col md:flex-row-reverse gap-6 md:gap-10 items-start md:justify-between">
          <Image
            src={imageSrc}
            width={343}
            height={243}
            alt={imageAlt}
            className="md:w-[441px] md:h-[423px] object-fill md:rounded-[20px]"
          />
          <div className="mt-6 md:mt-0">
            <span className="text-[#3D334A] p-[4.5px] md:p-2 text-[10px] md:text-[18px] leading-[90%] uppercase bg-[#E9DFF6] rounded-[3px] md:rounded-[6px]">
              {tag}
            </span>
            <h1 className="mt-2 md:mt-6 md:max-w-[783px] text-[#3D334A] mb-4 md:mb-5 font-bold text-[24px] md:text-[48px] leading-[100%]">
              {title}
            </h1>
            <p className="text-[#846FA0] font-bold text-[18px] md:text-[32px] leading-[100%] mb-6">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center md:-mt-24 flex-col md:flex-row w-full md:w-[60%] gap-8">
          <div className="flex items-center justify-between md:justify-start md:gap-8 w-full">
            <div className="flex items-center gap-2">
              <FaRegClock className="w-6 h-6 md:w-10 md:h-10 md:p-2 bg-[#D4BAFC] rounded-[3px] p-1" />
              <span className="text-[#3D334A] text-[12px] md:text-[20px] font-medium leading-[100%]">
                {duration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlinePlayLesson className="w-6 h-6 md:w-10 md:h-10 bg-[#D4BAFC] rounded-[3px] p-1 md:p-2" />
              <span className="text-[#3D334A] text-[12px] md:text-[20px] font-medium leading-[100%]">
                {progress}
              </span>
            </div>
          </div>

          <button
            onClick={onButtonClick}
            className="md:text-[#3D334A] flex text-[18px] tracking-[-1%] leading-[100%] 
              items-center gap-5 md:bg-transparent justify-center cursor-pointer bg-[#D4BAFC]
              py-[17px] w-full rounded-[8px]"
          >
            {buttonText} <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicCard;
