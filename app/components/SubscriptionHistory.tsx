import React from "react";
import Image from "next/image";
import { useI18n } from "../context/I18nContext";

const orders = [
  {
    id: 1,
    date: "22.10.2023",
    status: "completed",
    statusColor: "bg-[#F3D57F] text-white",
    action: "cancel_subscription",
    actionColor: "text-[#F36B6B]",
    product: {
      title: "ПОЯСНИЧНЫЙ ОТДЕЛ ПОЗВОНОЧНИКА",
      description: "Улучшение динамики и подвижности грудного отдела",
      image: "/assets/images/womenWork1.png",
      price: "950 ₽",
      action: "view",
    },
    faded: false,
  },
  {
    id: 2,
    date: "22.10.2023",
    status: "awaiting_payment",
    statusColor: "bg-[#D4BAFC] text-white",
    action: null,
    product: {
      title: "ПОЯСНИЧНЫЙ ОТДЕЛ ПОЗВОНОЧНИКА",
      description: "Улучшение динамики и подвижности грудного отдела",
      image: "/assets/images/womenWork1.png",
      price: "950 ₽",
      action: "pay",
    },
    faded: false,
  },
  {
    id: 3,
    date: "22.10.2023",
    status: "expired",
    statusColor: "bg-[#F9F7FE] text-[#C2B6D9]",
    action: null,
    product: {
      title: "ПОЯСНИЧНЫЙ ОТДЕЛ ПОЗВОНОЧНИКА",
      description: "Улучшение динамики и подвижности грудного отдела",
      image: "/assets/images/womenWork1.png",
      price: "950 ₽",
      action: null,
    },
    faded: true,
  },
  {
    id: 4,
    date: "22.10.2023",
    status: "expired",
    statusColor: "bg-[#F9F7FE] text-[#C2B6D9]",
    action: null,
    product: {
      title: "ПОЯСНИЧНЫЙ ОТДЕЛ ПОЗВОНОЧНИКА",
      description: "Улучшение динамики и подвижности грудного отдела",
      image: "/assets/images/womenWork1.png",
      price: "950 ₽",
      action: null,
    },
    faded: true,
  },
];

const SubscriptionHistory: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="relative px-10 mx-10 py-5 my-5 w-full  bg-[#F9F7FE] rounded-[20px]">
      <h2 className="text-[#3D334A] text-3xl md:text-4xl font-bold mb-8">
        {t("personal_account.subscription_history.title")}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`relative bg-white md:w-full md:h-auto rounded-[20px] p-6 shadow-md ${
              order.faded ? "opacity-30 grayscale" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg md:text-[24px] text-[#3D334A]">
                {t("personal_account.subscription_history.order_from", { date: order.date })}
              </span>
              {order.action && !order.faded && (
                <span className="ml-2 cursor-pointer text-sm md:text-base font-bold text-[#F36B6B]">
                                      {t(`personal_account.subscription_history.${order.action}`)} <span className="text-[#F36B6B]">✖</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mb-16">
              <span
                className={`px-4 py-1 rounded-[8px] font-[Pt] text-xs md:text-sm font-bold ${order.statusColor}`}
              >
                                  {t(`personal_account.subscription_history.statuses.${order.status}`)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Image
                src={order.product.image}
                width={120}
                height={120}
                alt={order.product.title}
                className="rounded-[20px] object-cover"
              />
              <div className="flex-1">
                <div className="text-[#B1A1D9] font-bold text-base md:text-lg uppercase leading-[120%] tracking-[-3%] max-w-[275px]">
                  {order.product.title}
                </div>
                <div className="text-[#846FA0] font-[Pt] text-sm md:text-base mb-2">
                  {order.product.description}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#B1A1D9] font-bold text-xl md:text-2xl">
                  {order.product.price}
                </span>
                {order.product.action && !order.faded && (
                  <span className="text-[#B1A1D9] text-xs md:text-base font-bold mt-2 cursor-pointer">
                                          {t(`personal_account.subscription_history.${order.product.action}`)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionHistory;
