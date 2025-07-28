import Image from "next/image";
import ProgressBar from "./ProgressBar";

interface ChallengeCardTypes {
  title: string;
  description: string;
  image?: string;
  imageBg?: string;
  current?: number;
  total?: number;
}

const ChallengeCard = ({
  title,
  description,
  image,
  imageBg,
  current,
  total,
}: ChallengeCardTypes) => (
  <div className="p-2.5 md:p-5 bg-white flex items-start gap-3 md:gap-5 rounded-[15px]">
    {image && (
      <Image
        src={image}
        width={47}
        height={47}
        alt={title}
        className="p-2.5 w-[66px] h-[66px] md:w-[90px] md:h-[90px] md:object-contain rounded-[10px]"
        style={{ backgroundColor: imageBg || "transparent" }}
      />
    )}
    <div className="flex flex-col justify-between h-[65px] md:h-auto">
      <h2 className="text-[#3D334A] text-[14px] md:text-[24px] leading-[90%] tracking-[-1%] uppercase">
        {title}
      </h2>
      <p className="text-[#846FA0] md:mt-2 text-[12px] md:text-[18px] leading-[120%]">
        {description}
      </p>
      {current !== undefined && total !== undefined && (
        <ProgressBar current={current} total={total} />
      )}
    </div>
  </div>
);

export default ChallengeCard;
