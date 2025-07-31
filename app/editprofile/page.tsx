"use client";

import React from "react";
import { defaultMenuItems } from "../components/Header";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import PersonInfo from "../components/PersonalAccount/PersonInfo";

const EditProfile = () => {
  return (
    <div>
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} allCourseBg={false} />
      <MobileNavbar />
      <PersonInfo
        user={{
          id: "",
          name: "",
          email: "",
          phone: "",
          location: "",
          image: undefined,
        }}
      />
      <div className="md:p-10 p-5 bg-[#F9F7FE] m-10">
        <h1
          className="text-[#3D334A] text-[18px] md:text-[40px] leading-[120%] tracking-[-3%] pl-4 mb-10
        "
        >
          редактирование профиля
        </h1>
        <form className="space-y-6">
          {/* პირველი წყვილი */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Имя</label>
              <input
                type="text"
                placeholder="enter name"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Фамилия</label>
              <input
                type="text"
                placeholder="enter lastname"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* მეორე წყვილი */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Отображаемое имя</label>
              <input
                type="email"
                placeholder="enter email"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Пол</label>
              <input
                type="tel"
                placeholder="enter phone"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* მესამე წყვილი */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Номер телефона</label>
              <input
                type="email"
                placeholder="enter email"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Электронная почта</label>
              <input
                type="tel"
                placeholder="enter phone"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* მეოთხე წყვილი */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Страна/Регион</label>
              <input
                type="email"
                placeholder="enter email"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Населенный пункт</label>
              <input
                type="tel"
                placeholder="enter phone"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* მეხუთე წყვილი */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Возраст</label>
              <input
                type="email"
                placeholder="enter email"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Вес</label>
              <input
                type="tel"
                placeholder="enter phone"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>

          {/* დამატებითი ინფუთი სრულ სიგრძეზე */}
          <div className="flex flex-col">
            <label className="text-[#846FA0] mb-1">Заболевание</label>
            <textarea
              placeholder="Your message"
              className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              rows={4}
            />
          </div>

          {/* მეექვსე წყვილი */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Старый пароль</label>
              <input
                type="email"
                placeholder="enter email"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[250px]">
              <label className="text-[#846FA0] mb-1">Новый пароль</label>
              <input
                type="tel"
                placeholder="enter phone"
                className="text-[#3D334A] bg-white py-3 px-4 rounded-lg"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
