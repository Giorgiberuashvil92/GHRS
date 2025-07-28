"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaYandex } from "react-icons/fa";
import { FaVk } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { TbBrandOkRu } from "react-icons/tb";
import { sendVerificationCode } from "../../config/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith("@gmail.com");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Пожалуйста, введите правильный Gmail адрес");
      valid = false;
    }
    if (password.length < 4) {
      setPasswordError("Пароль должен содержать минимум 4 символа");
      valid = false;
    }
    if (!valid) return;

    try {
      setIsLoading(true);
      // Отправляем код верификации
      await sendVerificationCode(email);

      // Сохраняем данные в localStorage
      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          email,
          password,
          step: 0,
        })
      );

      router.push("/auth/register/steps");
    } catch (error) {
      if (error instanceof Error) {
        setEmailError(error.message);
      } else {
        setEmailError("Произошла ошибка, попробуйте снова");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:relative flex flex-col md:bg-[url('/assets/images/categorySliderBgs/bg1.jpg')] md:bg-cover md:bg-center text-[#3D334A] mt-10 md:p-5 md:items-end md:mt-0">
      <div className="md:w-[808px] md:bg-white md:auto md:py-[200px] md:px-[118px] rounded-[40px]">
        <Image
          src={"/assets/icons/Union.png"}
          width={158}
          height={61}
          alt="logo"
          className="absolute bottom-20 left-20 hidden md:flex"
        />
        <div>
          <h1 className="text-center mb-10 text-[24px] md:text-[32px] tracking-[-3%] leading-[100%]">
            Регистрация
          </h1>
          {/* Socials */}
          <div className="flex gap-10 items-center justify-center mb-[58px]">
            <FaGoogle
              color="#D4BAFC"
              size={50}
              className="bg-[#F9F7FE] rounded-full p-2.5 w-[50px] h-[50px] md:h-[68px] md:w-[68px]"
            />
            <FaYandex
              color="#D4BAFC"
              size={50}
              className="bg-[#F9F7FE] rounded-full p-2.5 w-[50px] h-[50px] md:h-[68px] md:w-[68px]"
            />
            <FaVk
              color="#D4BAFC"
              size={50}
              className="bg-[#F9F7FE] rounded-full p-2.5 w-[50px] h-[50px] md:h-[68px] md:w-[68px]"
            />
            <TbBrandOkRu
              color="#D4BAFC"
              size={50}
              className="bg-[#F9F7FE] rounded-full p-2.5 w-[50px] h-[50px] md:h-[68px] md:w-[68px]"
            />
          </div>
        </div>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="font-[Pt] flex flex-col gap-5 text-[#3D334A] text-[18px] leading-[120%] font-medium"
        >
          <input
            type="email"
            title="Email"
            placeholder="Email"
            className="p-5 border border-[#E9DFF6] rounded-lg mx-2 placeholder:text-[#3D334A] placeholder:text-[18px] placeholder:leading-[120%] placeholder:font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          {emailError && (
            <span className="text-red-500 text-sm mx-2">{emailError}</span>
          )}
          <input
            type="password"
            title="Password"
            placeholder="Пароль"
            className="p-5 border border-[#E9DFF6] rounded-lg mx-2 placeholder:text-[#3D334A] placeholder:text-[18px] placeholder:leading-[120%] placeholder:font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          {passwordError && (
            <span className="text-red-500 text-sm mx-2">{passwordError}</span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 mx-2 justify-between px-5 mt-10 bg-[#D4BAFC] text-white text-[18px] leading-[120%] font-medium py-[17px] rounded-lg disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Отправляется..." : "Продолжить"}{" "}
            <FaArrowRightLong size={20} />
          </button>
        </form>
        <div className="mt-5 text-center w-full">
          <Link
            href={"/auth/login"}
            className="text-[#D4BAFC] tracking-[-1%] font-medium leading-[100%] font-[Pt]"
          >
            <p className="text-[#3D334A] text-[18px] leading-[120%] font-medium font-[Pt]">
              Уже есть аккаунт?{" "}
              <span className="text-[#D4BAFC] tracking-[-1%] font-medium leading-[100%] font-[Pt]">
                Войти
              </span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
