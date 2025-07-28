'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PersonInfo from "../../../components/PersonalAccount/PersonInfo";
import DesktopNavbar from "@/app/components/Navbar/DesktopNavbar";
import MobileNavbar from "@/app/components/Navbar/MobileNavbar";
import { defaultMenuItems } from "@/app/components/Header";
import { useAuth } from "@/app/context/AuthContext";

const PersonalAccountPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    gender: '',
    phone: '',
    email: '',
    country: '',
    city: '',
    age: '',
    weight: '',
    diseases: '',
    oldPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    // Pre-fill form with user data
    const [firstName = '', lastName = ''] = (user.name || '').split(' ');
    setFormData(prev => ({
      ...prev,
      firstName,
      lastName,
      displayName: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      city: user.location || '',
    }));
  }, [user, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update logic
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#3D334A] mb-4">
            Пользователь не найден
          </h2>
          <p className="text-[#846FA0]">Необходима авторизация</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} />
      <MobileNavbar />
      <PersonInfo user={user} />
      <div className="md:p-10 p-5 bg-[#F9F7FE] m-10">
        <h1 className="text-[#3D334A] text-[18px] md:text-[40px] leading-[120%] tracking-[-3%] pl-4 mb-10">
          Редактирование профиля
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First pair */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Имя</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Фамилия</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* Second pair */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Отображаемое имя</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Пол</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
          </div>

          {/* Third pair */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Номер телефона</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Электронная почта</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* Fourth pair */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Страна/Регион</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Населенный пункт</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* Fifth pair */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Возраст</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Вес</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* Additional textarea */}
          <div className="flex flex-col">
            <label className="text-[#846FA0] mb-1">Заболевание</label>
            <textarea
              name="diseases"
              value={formData.diseases}
              onChange={handleChange}
              className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              rows={4}
            />
          </div>

          {/* Sixth pair */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Старый пароль</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Новый пароль</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#D4BAFC] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalAccountPage;
