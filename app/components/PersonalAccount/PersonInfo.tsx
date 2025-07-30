import Image from "next/image";
import React from "react";
import { CgMail } from "react-icons/cg";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import Link from "next/link";
import { useI18n } from "../../context/I18nContext";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  image?: string;
};

type Props = {
  user: User;
};

const PersonInfo: React.FC<Props> = ({ user }) => {
  const { t } = useI18n();

  const personalLinks = [
    {
      icon: <CgMail size={20} color="#846FA0" />,
      text: user.email,
      label: t("personal_account.person_info.email"),
    },
    {
      icon: <MdOutlineLocationOn size={20} color="#846FA0" />,
      text: user.location,
      label: t("personal_account.person_info.location"),
    },
    {
      icon: <FaPhone size={15} color="#846FA0" />,
      text: user.phone,
      label: t("personal_account.person_info.phone"),
    },
  ];

  return (
    <div className="mx-2 mt-3 md:mt-5 mb-2 md:mb-5 bg-[#F9F7FE] p-4 md:p-[30px] md:mx-10 rounded-[10px]">
      <div className="md:flex md:flex-row md:gap-5 md:w-full">
        <Image
          src={user.image || "/assets/images/personImage.png"}
          width={359}
          height={216}
          alt={user.name || t("personal_account.person_info.profile_photo")}
          className="md:w-[190px] md:h-[190px] md:object-cover md:rounded-[10px]"
        />
        <div className="md:w-full">
          <h1 className="text-[#3D334A] mt-6 text-[24px] md:text-[32px] tracking-[-3%]">
            {user.name}
          </h1>
          <div className="flex flex-col gap-[10px] mt-[19px]">
            {personalLinks.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {item.icon}
                <span className="text-[#846FA0] font-[Pt] text-[14px] md:text-[18px] leading-[120%]">
                  {item.label}: {item.text}
                </span>
              </div>
            ))}
          </div>
          <Link href={`/personalAccount/${user.id}/edit`}>
            <h3 className="text-[#D4BAFC] md:text-[24px] md:font-medium cursor-pointer text-end text-[14px] uppercase leading-[90%] mt-8">
              {t("personal_account.person_info.edit")}
            </h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonInfo;
