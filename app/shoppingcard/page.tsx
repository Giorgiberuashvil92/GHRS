"use client";
import React, { useState, useEffect } from "react";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { defaultMenuItems } from "../components/Header";
import Image from "next/image";
import PayPalButton from '../components/PayPalButton';
import type { PaymentResponse } from '../components/PayPalButton';
import Works from "../components/Works";
import { Footer } from "../components/Footer";
import { useAllSets } from "../hooks/useSets";

const subscriptionOptions = [
  { label: "1 МЕСЯЦ", value: 1 },
  { label: "3 МЕСЯЦА", value: 3 },
  { label: "6 МЕСЯЦЕВ", value: 6 },
  { label: "12 МЕСЯЦЕВ", value: 12 },
];

interface CartItem {
  id: string;
  title: string;
  desc: string;
  img: string;
  price: number;
  subscription: number;
  totalExercises?: number;
  totalDuration?: string;
}

interface ParsedCartItem {
  id: string;
  name: {
    ru: string;
    en: string;
    ka: string;
  };
  description: {
    ru: string;
    en: string;
    ka: string;
  };
  image: string;
  price: number;
  period: string;
  totalExercises: number;
  totalDuration: string;
}

const ShoppingCard = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPayPal, setShowPayPal] = useState(false);

  const { sets } = useAllSets();

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const transformedCart = parsedCart.map((item: ParsedCartItem) => ({
          id: item.id,
          title: item.name.ru,
          desc: item.description.ru,
          img: item.image,
          price: item.price,
          subscription: parseInt(item.period) || 1,
          totalExercises: item.totalExercises,
          totalDuration: item.totalDuration
        }));
        setCart(transformedCart);
      }
    } catch (error) {
      console.error('❌ Error loading cart:', error);
    }
  }, []);

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleSelectSubscription = (id: string, value: number) => {
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.id === id ? { ...item, subscription: value } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
    setDropdownOpen(null);
  };

  const handlePaymentSuccess = (details: PaymentResponse) => {
    console.log('Payment successful:', details);
    setCart([]);
    localStorage.removeItem('cart');
    alert('გადახდა წარმატებით დასრულდა!');
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment failed:', error);
    setPaymentError(error.message);
  };

  const handleRemoveAll = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <div className="bg-[#F9F7FE]">
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} allCourseBg={false} />
      <MobileNavbar />
      <div className="flex flex-col md:flex-row gap-6 w-full px-2 md:px-10 justify-between md:mb-10 md:pb-10">
        <div className="flex-1 flex flex-col gap-4 items-start p-4 md:p-10 bg-white rounded-[20px]">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-[#3D334A] text-[24px] md:text-[40px] leading-[120%] tracking-[-3px]">Корзина</h1>
            <span onClick={handleRemoveAll} className="hidden font-[Pt] md:flex text-[#D5D1DB] text-[24px] leading-[120%] cursor-pointer hover:text-[#846FA0] transition">
              Удалить все
            </span>
          </div>
          <hr className="h-[2px] bg-[#F9F7FE] w-full" />
          {cart.map((item) => (
            <div key={item.id} className="flex items-start h-auto gap-4 p-3 rounded-[16px] w-full justify-between relative group hover:shadow-md transition">
              <div className="w-[136px] h-[131px]">
              <Image src={item.img} width={136} height={131} alt="image" className="rounded-[12px] object-cover bg-center" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#3D334A] font-[Pt] font-bold text-[24px] leading-[100%] max-w-[353px] mb-2.5 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[#846FA0] font-bold leading-[100%] mb-[16px] line-clamp-2 max-w-[353px] font-[Pt]">{item.desc}</p>
                {/* {item.totalExercises && <p className="text-[#846FA0] text-[14px] font-[Pt]">Упражнений: {item.totalExercises}</p>}
                {item.totalDuration && <p className="text-[#846FA0] text-[14px] font-[Pt]">Длительность: {item.totalDuration}</p>} */}
                <div className="flex items-center gap-2 relative">
                  <button
                    className="text-[#846FA0] font-[Pt] font-bold text-[14px] rounded-[8px] py-1 flex items-center gap-1 hover:bg-[#F3EDFF] transition"
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === item.id ? null : item.id)
                    }
                  >
                    Срок подписки:
                    <span className="text-purple-400 ">
                      {subscriptionOptions.find((o) => o.value === item.subscription)?.label}
                    </span>
                    <svg className={`ml-1 w-4 h-4 transition-transform ${dropdownOpen === item.id && "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen === item.id && (
                    <div className="absolute font-[Bowler] z-10 top-10 left-0 bg-white rounded-[16px] shadow-lg py-2 w-[180px] flex flex-col animate-fade-in border border-[#E2D6F9]">
                      {subscriptionOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`text-left font-[Pt] px-4 py-2 hover:bg-[#F3EDFF] transition text-[#3D334A] ${item.subscription === option.value ? "font-bold" : ""}`}
                          onClick={() => handleSelectSubscription(item.id, option.value)}
                        >
                          <span className="font-bold">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between h-full items-end min-h-[100px]">
                <span className="text-[#3D334A] font-[Pt] text-[24px] leading-[100%] font-bold">{item.price} ₽</span>
                <button
                  className="text-[#846FA0] font-bold text-[16px] leading-[100% ] font-[Pt] flex items-center gap-3 mt-2 hover:text-[#D7263D] transition"
                  onClick={() => handleRemove(item.id)}
                >
                  Удалить
                  <Image src={"/assets/icons/trash.svg"} alt="trash" width={15} height={20} />
                </button>
              </div>

            </div>
          ))}
        </div>

        <div className="w-full md:w-[334px] bg-white p-4 rounded-[20px] space-y-5 h-fit">
          <div className="flex items-center justify-between">
            <h5 className="text-[#846FA0] font-[Pt]">Товаров</h5>
            <span className="text-[#3D334A] text-[18px] font-bold font-[Pt]">{cart.length} шт.</span>
          </div>
          <div className="flex items-center justify-between">
            <h5 className="text-[#846FA0] font-[Pt]">Всего на сумму</h5>
            <span className="text-[#3D334A] text-[18px] font-bold font-[Pt]">{cart.reduce((sum, i) => sum + i.price, 0)} ₽</span>
          </div>
          <div className="flex items-center justify-between">
            <h5 className="text-[#846FA0] font-[Pt]">Скидки</h5>
            <span className="text-[#3D334A] text-[18px] font-bold font-[Pt]">1000 ₽</span>
          </div>

          <button onClick={() => setShowPayPal(true)} className="group bg-[url('/assets/images/bluebg.jpg')] rounded-[10px] bg-cover bg-center py-[13px] w-full mt-4 cursor-pointer text-white text-[18px] font-semibold shadow-md hover:opacity-90 transition flex items-center justify-center gap-2">
            <span className="">Оплатить</span>
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {showPayPal && (
            <div className="mt-8">
              {paymentError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {paymentError}
                </div>
              )}
              <PayPalButton
                amount={cart.reduce((sum, i) => sum + i.price, 0)}
                currency="RUB"
                setId={cart.map(item => item.id).join(',')}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          )}
        </div>
      </div>
      <Works title={"Шейный отдел позвоночника"} customMargin={""} customBorderRadius={""} seeAll={false} scrollable={false} sets={sets} />
      <Footer />
    </div>
  );
};

export default ShoppingCard;
