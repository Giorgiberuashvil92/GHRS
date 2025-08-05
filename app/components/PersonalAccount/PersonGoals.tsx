"use client";

import { useState } from "react";
import Image from "next/image";
import DayBoxes from "../DayBoxes";
import Select from "react-select";
import { IoMdClose } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState(
    calendarOptions.filter(
      (option) => option.value === goals.calendarIntegration
    )
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeFrom, setTimeFrom] = useState("09:00");
  const [timeTo, setTimeTo] = useState("17:00");
  const [isBooking, setIsBooking] = useState(false);
  const { t } = useI18n();

  const handleDaySelection = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleBooking = () => {
    setIsOpen(false);
    setIsConfirmOpen(true);
  };

  const generateGoogleCalendarUrl = () => {
    const selectedDayNames = selectedDays.map(day => 
      weekDays.find(d => d.key === day)?.label
    ).join(", ");
    
    const title = encodeURIComponent(`Бронирование календаря - ${selectedDayNames}`);
    const details = encodeURIComponent(
      `Забронированные дни: ${selectedDayNames}\n` +
      `Время: ${timeFrom} - ${timeTo}\n` +
      `Календарь: ${selectedCalendars[0]?.label || "Не выбран"}`
    );
    
    // Создаем дату на завтра как пример
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0].replace(/-/g, '');
    const timeFromFormatted = timeFrom.replace(':', '');
    const timeToFormatted = timeTo.replace(':', '');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T${timeFromFormatted}00/${dateStr}T${timeToFormatted}00&details=${details}`;
  };

  const sendEmailAndCalendar = async () => {
    const selectedDayNames = selectedDays.map(day => 
      weekDays.find(d => d.key === day)?.label
    ).join(", ");
    
    const emailBody = encodeURIComponent(
      `Здравствуйте!\n\n` +
      `Ваше бронирование календаря подтверждено:\n\n` +
      `Дни: ${selectedDayNames}\n` +
      `Время: ${timeFrom} - ${timeTo}\n` +
      `Календарь: ${selectedCalendars[0]?.label || "Не выбран"}\n\n` +
      `Для добавления в Google Calendar перейдите по ссылке:\n` +
      `${generateGoogleCalendarUrl()}\n\n` +
      `С уважением,\nВаша команда`
    );
    
    const emailSubject = encodeURIComponent("Подтверждение бронирования календаря");
    
    // Открываем почтовый клиент
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
    
    // Также открываем Google Calendar
    window.open(generateGoogleCalendarUrl(), '_blank');
  };

  const confirmBooking = async () => {
    setIsBooking(true);
    
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsBooking(false);
    setIsConfirmOpen(false);
    
    // Отправляем email и открываем Google Calendar
    await sendEmailAndCalendar();
    
    // Сообщение об успехе
    alert("Календарь успешно забронирован! Проверьте почту и Google Calendar.");
    
    // Сброс данных
    setSelectedDays([]);
    setTimeFrom("09:00");
    setTimeTo("17:00");
  };

  const weekDays = [
    { key: "monday", label: "Пн" },
    { key: "tuesday", label: "Вт" },
    { key: "wednesday", label: "Ср" },
    { key: "thursday", label: "Чт" },
    { key: "friday", label: "Пт" },
    { key: "saturday", label: "Сб" },
    { key: "sunday", label: "Вс" },
  ];

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
              <DayBoxes onDaySelect={handleDaySelection} selectedDays={selectedDays} />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-4">
              <div className="flex items-center gap-[15px]">
                <label className="text-[#3D334A] mb-1 text-sm">
                  {t("personal_account.person_goals.from")}
                </label>
                <input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  className="border border-[#D4BAFC] w-[100px] md:w-auto rounded-[6px] px-3 py-2 text-[#3D334A]"
                />
              </div>
              <div className="flex items-center gap-[15px]">
                <label className="text-[#3D334A] mb-1 text-sm">
                  {t("personal_account.person_goals.to")}
                </label>
                <input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
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
              onClick={handleBooking}
              className="mt-2 bg-[#D4BAFC] text-white py-2 px-4 rounded-[8px] w-full"
            >
              {t("personal_account.person_goals.save")}
            </button>
          </div>
        </div>
      )}

      {/* Модал подтверждения */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#00000033]">
          <div className="bg-white p-6 mx-auto flex flex-col rounded-[10px] w-[90%] max-w-[400px] shadow-lg relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#F3D57F] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-white text-2xl" />
              </div>
              <h2 className="text-[#3D334A] text-[20px] font-semibold mb-2">
                Подтверждение
              </h2>
              <p className="text-[#846FA0] text-[14px]">
                Вы уверены, что хотите забронировать календарь?
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-[8px] mb-6">
              <h3 className="text-[#3D334A] font-medium mb-2">Детали бронирования:</h3>
              <p className="text-sm text-[#846FA0] mb-1">
                <strong>Дни:</strong> {selectedDays.length > 0 ? selectedDays.map(day => 
                  weekDays.find(d => d.key === day)?.label
                ).join(", ") : "Не выбраны"}
              </p>
              <p className="text-sm text-[#846FA0] mb-1">
                <strong>Время:</strong> {timeFrom} - {timeTo}
              </p>
              <p className="text-sm text-[#846FA0]">
                <strong>Календарь:</strong> {selectedCalendars[0]?.label || "Не выбран"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 bg-gray-200 text-[#3D334A] py-2 px-4 rounded-[8px]"
                disabled={isBooking}
              >
                Отмена
              </button>
              <button
                onClick={confirmBooking}
                disabled={isBooking}
                className="flex-1 bg-[#D4BAFC] text-white py-2 px-4 rounded-[8px] flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Отправляется...
                  </>
                ) : (
                  <>
                    <FiCheck />
                    Подтвердить
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonGoals;
