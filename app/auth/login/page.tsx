"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaYandex } from "react-icons/fa";
import { FaVk } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { TbBrandOkRu } from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../config/api";
import { User } from "@/app/components/PersonalAccount/PersonInfo";

interface LoginResponse {
  token: string;
  user: User;
}

const Login = () => {
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = (await login(
        formData.email,
        formData.password
      )) as LoginResponse;
      authLogin(response.token, response.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Неверный email или пароль");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:relative flex flex-col md:bg-[url('/assets/images/categorySliderBgs/bg1.jpg')] md:bg-cover md:bg-center text-[#3D334A] mt-10 md:p-5 md:items-end md:mt-0">
      <div className="md:w-[808px] md:bg-white md:h-auto md:py-[200px] md:px-[118px] rounded-[40px]">
        <Image
          src={"/assets/icons/Union.png"}
          width={158}
          height={61}
          alt="logo"
          className="absolute bottom-20 left-20 hidden md:flex"
        />
        <div>
          <h1 className="text-center mb-10 text-[24px] md:text-[32px] tracking-[-3%] leading-[100%]">
            Авторизация
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
          {error && <div className="text-red-500 text-center">{error}</div>}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            title="Email"
            placeholder="Email"
            className="p-5 border border-[#E9DFF6] rounded-lg mx-2 placeholder:text-[#3D334A] placeholder:text-[18px] placeholder:leading-[120%] placeholder:font-medium"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            title="Пароль"
            placeholder="Пароль"
            className="p-5 border border-[#E9DFF6] rounded-lg mx-2 placeholder:text-[#3D334A] placeholder:text-[18px] placeholder:leading-[120%] placeholder:font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 mx-2 justify-between px-5 mt-10 bg-[#D4BAFC] text-white text-[18px] leading-[120%] font-medium py-[17px] rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Пожалуйста, подождите..." : "Войти"}{" "}
            <FaArrowRightLong size={20} />
          </button>
        </form>
        <div className="mt-5 text-center w-full">
          <span className="text-[#D4BAFC] tracking-[-1%] font-medium leading-[100%] font-[Pt] cursor-pointer">
            Восстановить пароль
          </span>
          <p className="text-[#3D334A] text-[18px] leading-[120%] font-medium font-[Pt]">
            Нет аккаунта?{" "}
            <Link
              href={"/auth/register"}
              className="text-[#D4BAFC] tracking-[-1%] font-medium leading-[100%] font-[Pt]"
            >
              Регистрация
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
