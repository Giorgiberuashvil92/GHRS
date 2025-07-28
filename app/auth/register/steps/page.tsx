"use client";
import React, { useState } from "react";
import VerificationStep from "./VerificationStep";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "../../../config/api";

interface RegistrationData {
  email: string;
  password: string;
  name: string;
  phone: string;
  location: string;
  diseases?: string[];
  additionalInfo?: string;
  verificationCode?: string;
  otherContact?: string;
}

// interface VerificationStepProps {
//   onNext: () => void;
//   onBack: () => void;
//   onVerificationComplete: (code: string) => void;
//   email: string;
// }

const steps = [
  { label: "Верификация" },
  { label: "Шаг 2" },
  { label: "Шаг 3" },
  { label: "Шаг 4" },
  { label: "Шаг 5" },
  { label: "Шаг 6" },
];

const countryOptions = [
  { label: "Россия", code: "+7" },
  { label: "Грузия", code: "+995" },
  { label: "Украина", code: "+380" },
];

const diseaseOptions = [
  { label: "Остеохондроз", value: "Остеохондроз" },
  { label: "Артрит", value: "Артрит" },
  { label: "Сколиоз", value: "Сколиоз" },
  { label: "Другое", value: "Другое" },
];

const Step2 = ({
  onNext,
  onBack,
  onDataUpdate,
}: {
  onNext: () => void;
  onBack: () => void;
  onDataUpdate: (data: { firstName: string; lastName: string }) => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const allFilled = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (allFilled) {
      onDataUpdate({ firstName, lastName });
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto">
      <h2 className="text-[32px] leading-[100%] tracking-[-3%] font-bold mb-2 text-start w-full pl-10 text-[#3D334A] ">
        Как вас зовут?
      </h2>
      <p className="mb-10 mt-2 text-[#846FA0] text-start pl- text-[18px] font-medium leading-[100%] font-[Pt]">
        Имя и фамилия будут отображаться в вашем личном кабинете
      </p>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 w-full justify-center"
      >
        <div className="flex flex-row font-[Pt] gap-6 items-center justify-center mb-2 w-full">
          <input
            type="text"
            placeholder="Имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-[276px] h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl focus:outline-none focus:border-[#846FA0] bg-white text-[#3D334A]"
          />
          <input
            type="text"
            placeholder="Фамилия"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-[276px] h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl focus:outline-none focus:border-[#846FA0] bg-white text-[#3D334A]"
          />
        </div>
        <div className="flex justify-between mt-8 gap-4 px-10 font-[Pt]">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#E9DFF6] text-[#3D334A] py-2 px-8 rounded-lg font-medium text-[18px] w-full"
          >
            Назад
          </button>
          <button
            type="submit"
            className="bg-[#D4BAFC] text-white py-2 px-8 rounded-lg font-medium text-[18px] disabled:opacity-50 w-full"
            disabled={!allFilled}
          >
            Далее
          </button>
        </div>
      </form>
    </div>
  );
};

const Step3 = ({
  onNext,
  onBack,
  onDataUpdate,
}: {
  onNext: () => void;
  onBack: () => void;
  onDataUpdate: (data: { country: string; city: string }) => void;
}) => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const allFilled = country.trim().length > 0 && city.trim().length > 0;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (allFilled) {
      onDataUpdate({ country, city });
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto">
      <h2 className="text-[32px] leading-[100%] tracking-[-3%] font-bold mb-2 text-start w-full pl-10 text-[#3D334A] ">
        Откуда вы?
      </h2>
      <p className="mb-10 mt-2 text-[#846FA0] text-start items-start w-full pl-10 text-[18px] font-medium leading-[100%] font-[Pt]">
        Укажите название страны и населенного пункта
      </p>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 w-full justify-center"
      >
        <div className="flex flex-row font-[Pt] gap-6 items-center justify-center mb-2 w-full px-10">
          <input
            type="text"
            placeholder="Страна/Регион"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-[276px] h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl focus:outline-none focus:border-[#846FA0] bg-white text-[#3D334A]"
          />
          <input
            type="text"
            placeholder="Населенный пункт"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-[276px] h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl focus:outline-none focus:border-[#846FA0] bg-white text-[#3D334A]"
          />
        </div>
        <div className="flex justify-between mt-8 gap-4 px-10 font-[Pt]">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#E9DFF6] text-[#3D334A] py-2 px-8 rounded-lg font-medium text-[18px] w-full"
          >
            Назад
          </button>
          <button
            type="submit"
            className="bg-[#D4BAFC] text-white py-2 px-8 rounded-lg font-medium text-[18px] disabled:opacity-50 w-full"
            disabled={!allFilled}
          >
            Далее
          </button>
        </div>
      </form>
    </div>
  );
};

const Step4 = ({
  onNext,
  onBack,
  onDataUpdate,
}: {
  onNext: () => void;
  onBack: () => void;
  onDataUpdate: (data: { phone: string; otherContact: string }) => void;
}) => {
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [phone, setPhone] = useState("");
  const [other, setOther] = useState("");
  const allFilled = phone.trim().length > 0 && other.trim().length > 0;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (allFilled) {
      onDataUpdate({
        phone: selectedCountry.code + phone,
        otherContact: other,
      });
      onNext();
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countryOptions.find((c) => c.code === e.target.value);
    if (country) {
      setSelectedCountry(country);
      setPhone("");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto">
      <h2 className="text-[32px] leading-[100%] tracking-[-3%] font-bold mb-2 text-start w-full pl-10 text-[#3D334A] ">
        Как с вами связаться?
      </h2>
      <p className="mb-10 mt-2 text-[#846FA0] text-start items-start w-full pl-10 text-[18px] font-medium leading-[100%] font-[Pt]">
        Укажите номер телефона или другой удобный вам способ связи.
      </p>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 w-full justify-center"
      >
        <div className="flex flex-col font-[Pt] gap-6 items-center justify-center mb-2 w-full px-10">
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
            className="w-full h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl bg-white text-[#3D334A] mb-2"
          >
            {countryOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#3D334A] select-none">
              {selectedCountry.code}
            </span>
            <input
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full h-[60px] border border-[#E9DFF6] rounded-lg pl-16 pr-4 text-xl focus:outline-none focus:border-[#846FA0] bg-white text-[#3D334A] mb-2"
              placeholder={selectedCountry.code + " ..."}
              maxLength={15}
            />
          </div>
          <input
            type="text"
            placeholder="Другой способ связи"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            className="w-full h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl focus:outline-none focus:border-[#846FA0] bg-white text-[#3D334A]"
          />
        </div>
        <div className="flex justify-between mt-8 gap-4 px-10 font-[Pt]">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#E9DFF6] text-[#3D334A] py-2 px-8 rounded-lg font-medium text-[18px] w-full"
          >
            Назад
          </button>
          <button
            type="submit"
            className="bg-[#D4BAFC] text-white py-2 px-8 rounded-lg font-medium text-[18px] disabled:opacity-50 w-full"
            disabled={!allFilled}
          >
            Далее
          </button>
        </div>
      </form>
    </div>
  );
};

const Step5 = ({
  onNext,
  onBack,
  onDataUpdate,
}: {
  onNext: () => void;
  onBack: () => void;
  onDataUpdate: (data: { selectedDiseases: string[] }) => void;
}) => {
  const [selectedDisease, setSelectedDisease] = useState("");
  const [other, setOther] = useState("");
  const allFilled =
    selectedDisease.trim().length > 0 || other.trim().length > 0;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (allFilled) {
      const diseases = [];
      if (selectedDisease) diseases.push(selectedDisease);
      if (other) diseases.push(other);
      onDataUpdate({ selectedDiseases: diseases });
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto">
      <h2 className="text-[32px] leading-[100%] tracking-[-3%] font-bold mb-2 text-start w-full pl-10 text-[#3D334A] ">
        Расскажите о себе
      </h2>
      <p className="mb-10 mt-2 text-[#846FA0] text-start items-start w-full pl-10 text-[18px] font-medium leading-[100%] font-[Pt]">
        Укажите ваш пол, примерный вес и рост. Это поможет нашим специалистам в
        дальнейшем.
      </p>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 w-full justify-center"
      >
        <div className="flex flex-col font-[Pt] gap-6 items-center justify-center mb-2 w-full px-10">
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            className="w-full h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl bg-white text-[#3D334A] mb-2"
          >
            <option value="" disabled>
              Заболевание
            </option>
            {diseaseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Другое"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            className="w-full h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl focus:outline-none focus:border-[#846FA0] bg-white text-[#3D334A]"
          />
        </div>
        <div className="flex justify-between mt-8 gap-4 px-10 font-[Pt]">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#E9DFF6] text-[#3D334A] py-2 px-8 rounded-lg font-medium text-[18px] w-full"
          >
            Назад
          </button>
          <button
            type="submit"
            className="bg-[#D4BAFC] text-white py-2 px-8 rounded-lg font-medium text-[18px] disabled:opacity-50 w-full"
            disabled={!allFilled}
          >
            Далее
          </button>
        </div>
      </form>
    </div>
  );
};

const Step6 = ({
  onNext,
  onBack,
  onDataUpdate,
}: {
  onNext: () => void;
  onBack: () => void;
  onDataUpdate: (data: { additionalInfo: string }) => void;
}) => {
  const [additionalInfo, setAdditionalInfo] = useState("");
  const allFilled = additionalInfo.trim().length > 0;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (allFilled) {
      onDataUpdate({ additionalInfo });
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-[600px] mx-auto">
      <h2 className="text-[32px] leading-[100%] tracking-[-3%] font-bold mb-2 text-start w-full pl-10 text-[#3D334A] ">
        Ваше заболевание
      </h2>
      <p className="mb-10 mt-2 text-[#846FA0] text-start items-start w-full pl-10 text-[18px] font-medium leading-[100%] font-[Pt]">
        Выберите подходящее заболевание из предложенного списка или укажите его
        самостоятельно.
      </p>
      <form
        onSubmit={handleNext}
        className="flex flex-col gap-4 w-full justify-center"
      >
        <div className="flex flex-col font-[Pt] gap-6 items-center justify-center mb-2 w-full px-10">
          <select
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl bg-white text-[#3D334A] mb-2"
          >
            <option value="" disabled>
              Заболевание
            </option>
            {diseaseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Другое"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full h-[60px] border border-[#E9DFF6] rounded-lg px-4 text-xl focus:outline-none focus:border-[#846FA0] bg-white text-[#3D334A]"
          />
        </div>
        <div className="flex justify-between mt-8 gap-4 px-10 font-[Pt]">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#E9DFF6] text-[#3D334A] py-2 px-8 rounded-lg font-medium text-[18px] w-full"
          >
            Назад
          </button>
          <button
            type="submit"
            className="bg-[#D4BAFC] text-white py-2 px-8 rounded-lg font-medium text-[18px] disabled:opacity-50 w-full"
            disabled={!allFilled}
          >
            Завершить
          </button>
        </div>
      </form>
    </div>
  );
};

const CongratsStep = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Image
      src={"/assets/images/congrats.png"}
      quality={10}
      width={446}
      height={446}
      alt="ballons"
    />
    <h2 className="text-[32px] leading-[100%] tracking-[-3%] font-bold mb-6 text-[#3D334A]">
      Регистрация завершена!
    </h2>
    <p className="text-[#846FA0] text-center text-[20px] font-medium leading-[120%] font-[Pt] max-w-xl">
      Теперь вы можете пользоваться всем спектром функций, предложенных нашей
      платформой.
    </p>
    <div className="flex items-center gap-4 mt-10">
      <button className="bg-[url('/assets/images/categorySliderBgs/bg1.jpg')] rounded-[8px] bg-cover bg-center w-[335px] h-[48px] bg-no-repeat">
        <Link href={"/personalAccount/1/edit"}>в личный кабинет</Link>
      </button>
      <button className="bg-[#F9F7FE] w-[335px] h-[48px] bg-no-repeat text-[#D4BAFC] rounded-[8px]">
        <Link href={"/"}>На главную</Link>
      </button>
    </div>
  </div>
);

const RegisterSteps = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [registrationData, setRegistrationData] = useState<RegistrationData>(
    () => {
      // Если в localStorage есть временные данные
      const savedData =
        typeof window !== "undefined"
          ? localStorage.getItem("registrationData")
          : null;
      return savedData
        ? JSON.parse(savedData)
        : {
            email: "",
            password: "",
            name: "",
            phone: "",
            location: "",
            diseases: [],
            additionalInfo: "",
          };
    }
  );

  const handleNext = () => {
    const nextStep = activeStep + 1;

    // На последнем этапе отправка
    if (nextStep === steps.length) {
      handleSubmitRegistration();
      return;
    }

    setActiveStep(nextStep);
    // Сохраним прогресс
    localStorage.setItem("registrationData", JSON.stringify(registrationData));
  };

  const handleBack = () => {
    setActiveStep((s) => (s > 0 ? s - 1 : 0));
  };

  const handleSubmitRegistration = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { otherContact, ...registrationDataToSend } = registrationData;
      await register(registrationDataToSend);
      // В случае успеха
      localStorage.removeItem("registrationData"); // Удалим временные данные
      router.push("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error);
      // Здесь можно добавить error handling
    }
  };

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <VerificationStep
            onNext={handleNext}
            onBack={handleBack}
            onVerificationComplete={(code) =>
              updateRegistrationData({ verificationCode: code })
            }
            email={registrationData.email}
          />
        );
      case 1:
        return (
          <Step2
            onNext={handleNext}
            onBack={handleBack}
            onDataUpdate={(data) =>
              updateRegistrationData({
                name: `${data.firstName} ${data.lastName}`,
              })
            }
          />
        );
      case 2:
        return (
          <Step3
            onNext={handleNext}
            onBack={handleBack}
            onDataUpdate={(data) =>
              updateRegistrationData({
                location: `${data.country}, ${data.city}`,
              })
            }
          />
        );
      case 3:
        return (
          <Step4
            onNext={handleNext}
            onBack={handleBack}
            onDataUpdate={(data) =>
              updateRegistrationData({
                phone: data.phone,
                otherContact: data.otherContact,
              })
            }
          />
        );
      case 4:
        return (
          <Step5
            onNext={handleNext}
            onBack={handleBack}
            onDataUpdate={(data) =>
              updateRegistrationData({ diseases: data.selectedDiseases })
            }
          />
        );
      case 5:
        return (
          <Step6
            onNext={handleNext}
            onBack={handleBack}
            onDataUpdate={(data) =>
              updateRegistrationData({ additionalInfo: data.additionalInfo })
            }
          />
        );
      default:
        return <CongratsStep />;
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div>
        {/* Только progress bar, на странице поздравления больше не показывается */}
        {activeStep < steps.length && (
          <div className="w-[500px] mx-auto">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-10">
              <div
                className="h-full bg-[#D4BAFC] rounded-[20px] w-[600px] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default RegisterSteps;
