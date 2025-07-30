"use client";

import { useState } from "react";
import Image from "next/image";
import DayBoxes from "../DayBoxes";
import Select from "react-select";
import { IoMdClose } from "react-icons/io";
import { useI18n } from "../../context/I18nContext";

type Goals = {
  currentStreak: number;
  recordStreak: number;
  calendarIntegration: string;
};

type Props = {
  goals: Goals;
};

const calendarOptions = [
  { value: "google", label: "Google Calendar" },
  { value: "apple", label: "Apple Calendar" },
  { value: "outlook", label: "Outlook" },
  { value: "yandex", label: "Yandex Календарь" },
];

const PersonGoals: React.FC<Props> = ({ goals }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState(
    calendarOptions.filter(
      (option) => option.value === goals.calendarIntegration
    )
  );
  const { t } = useI18n();

  return (
    <>
      <div className="p-2.5 md:p-5 bg-[#F3D57F] rounded-[10px] md:w-full">
        <div className="flex items-center gap-3">
          <Image
            src={"/assets/images/fire.png"}
            alt="fire"
            width={42}
            height={59}
          />
          <h2 className="text-white text-[26px] md:text-[32px] tracking-[-3%]">
            {t("personal_account.person_goals.title")}
          </h2>
        </div>
        <p className="mt-2.5 md:mb-[19px] px-5 py-3.5 font-[Pt] md:text-[18px] bg-[#3D334A33] rounded-[10px] text-[14px] font-medium backdrop-blur-[20px] text-center mb-2">
          {t("personal_account.person_goals.description")}
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-[#3D334A] py-[17px] pr-[43px] rounded-[10px] text-[18px] leading-[100%] tracking-[-1%] w-full"
        >
          {t("personal_account.person_goals.set_goal")}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#00000033]">
          <div className="bg-white md:p-[30px] p-4 pt-[27px] mx-auto flex flex-col rounded-[10px] w-[90%] max-w-[500px] shadow-lg relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-xl font-bold"
            >
              <IoMdClose
                color="black"
                className="absolute top-6 right-3 text-xl font-bold"
              />
            </button>
            <h2 className="text-[#3D334A] text-[20px] font-semibold mb-6">
              {t("personal_account.person_goals.reminder_settings")}
            </h2>
            <p className="text-[#846FA0] text-[16px] mb-4">
                              {t("personal_account.person_goals.reminder_description")}
            </p>
            <p className="mb-[30px] text-[#846FA0]">
                              {t("personal_account.person_goals.which_days")}
            </p>

            <div className="w-full flex justify-center mb-[27px]">
              <DayBoxes />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-4">
              <div className="flex items-center gap-[15px]">
                <label className="text-[#3D334A] mb-1 text-sm">
                                      {t("personal_account.person_goals.from")}
                </label>
                <input
                  type="time"
                  className="border border-[#D4BAFC] w-[100px] md:w-auto rounded-[6px] px-3 py-2 text-[#3D334A]"
                />
              </div>
              <div className="flex items-center gap-[15px]">
                <label className="text-[#3D334A] mb-1 text-sm">
                                      {t("personal_account.person_goals.to")}
                </label>
                <input
                  type="time"
                  className="border border-[#D4BAFC] rounded-[6px] w-[100px] md:w-auto px-3 py-2 text-[#3D334A]"
                />
              </div>
            </div>

            <div className="mb-4 w-full">
              <label className="text-[#3D334A] block mb-2">
                {t("personal_account.person_goals.calendar_select")}
              </label>
              <Select
                options={calendarOptions}
                value={selectedCalendars[0]}
                onChange={(selected) =>
                  setSelectedCalendars(selected ? [selected] : [])
                }
                className="text-[#3D334A]"
                menuPlacement="top"
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#D4BAFC",
                    borderRadius: "6px",
                    padding: "2px",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 bg-[#D4BAFC] text-white py-2 px-4 rounded-[8px] w-full"
            >
                              {t("personal_account.person_goals.save")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonGoals;
