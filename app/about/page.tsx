"use client";
import React from "react";
import Header from "../components/Header";
import Category from "../components/Category";
import Rehabilitation from "../components/Rehabilitation";
import Works from "../components/Works";
import TeacherInfo from "../components/TeacherInfo";
import StaticTeacher from "../components/StaticTeacher";
import { Footer } from "../components/Footer";

const About = () => {
  return (
    <div>
      <Header variant="about" />
      <div className="mt-40">
        <Rehabilitation />
        <Category />
        <Works title={"test"} items={[]} />
        <div className="py-10">
          <h1 className="text-[#3D334A] text-[32px] md:text-[64px] leading-[100%] tracking-[-3%]  text-center">
            Наша цель
          </h1>
          <div className="md:m-10 m-5">
            <div className="bg-[#F9F7FE]  md:py-[34px] md:pl-10 mb-5 p-4 rounded-[15px]">
              <p className="text-[#3D334A] font-[Pt] leading-[120%] md:text-[24px] text-[14px] font-medium">
                Мы нацелены на постоянное расширение списка направлений
                реабилитации и персонализацию программ реабилитации, и будем
                рады обратной связи с нашими пользователями, чтобы определиться
                какие разделы реабилитации нам нужно добавить и какие
                дополнительные возможности следует развить.
              </p>
            </div>
            <div className="flex md:flex-row flex-col items-center gap-5">
              <div className="bg-[#F9F7FE] md:p-10 p-4 rounded-[15px]">
                <p className="text-[#3D334A] font-[Pt] leading-[120%] md:text-[24px] text-[14px] font-medium">
                  Мы обеспечим вам возможность бесплатных консультаций с
                  квалифицированными кураторами нашей платформы, а также
                  возможность консультаций с ведущими специалистами в клиниках
                  Израиля.
                </p>
              </div>
              <div className="bg-[#F9F7FE] md:p-10 p-4 rounded-[15px]">
                <p className="text-[#3D334A] font-[Pt] leading-[120%] md:text-[24px] text-[14px] font-medium">
                  Мы обеспечим вам возможность бесплатных консультаций с
                  квалифицированными кураторами нашей платформы, а также
                  возможность консультаций с ведущими специалистами в клиниках
                  Израиля.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <TeacherInfo /> */}
        <StaticTeacher />
      </div>
      <div className="mt-20">
      <Footer />
      </div>
    </div>
  );
};

export default About;
