export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  goals: {
    currentStreak: number;
    recordStreak: number;
    calendarIntegration: string;
  };
  statistics: {
    label: string;
    text: string;
    icon?: React.ComponentType<{ className?: string }>;
    id?: string;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    image?: string;
    imageBg?: string;
    current?: number;
    total?: number;
  }[];
};

import { FaRegCheckCircle, FaStar } from "react-icons/fa";

export const users: User[] = [
  {
    id: "1",
    name: "Алексей Анатольев",
    email: "anatoliev@gmail.com",
    phone: "+7 (932) 584–20–82",
    location: "Москва, Московская область, Россия",
    image: "/assets/images/personImage.png",
    goals: {
      currentStreak: 4,
      recordStreak: 18,
      calendarIntegration: "google",
    },
    statistics: [
      {
        id: "aa1",
        label: "6 комплексов",
        text: "Просмотрено",
        icon: FaRegCheckCircle,
      },
      { id: "aa2", label: "12 уроков", text: "Пройдено", icon: FaStar },
      {
        id: "aa3",
        label: "5 часов",
        text: "Время занятий",
        icon: FaRegCheckCircle,
      },
      { id: "aa4", label: "3 дня", text: "Подряд тренировался", icon: FaStar },
      {
        id: "aa5",
        label: "2  упражнения",
        text: "Добавлено",
        icon: FaRegCheckCircle,
      },
      { id: "aa6", label: "1 марафон", text: "Участвовал", icon: FaStar },
      {
        id: "aa7",
        label: "4 комментария",
        text: "Оставлено",
        icon: FaRegCheckCircle,
      },
      { id: "aa8", label: "7 лайков", text: "Поставлено", icon: FaStar },
      {
        id: "aa9",
        label: "10 видео",
        text: "Просмотрено",
        icon: FaRegCheckCircle,
      },
      { id: "aa10", label: "2 достижения", text: "Получено", icon: FaStar },
      {
        id: "aa11",
        label: "1 отзыв",
        text: "Оставлен",
        icon: FaRegCheckCircle,
      },
      { id: "aa12", label: "8 дней", text: "В streak", icon: FaStar },
    ],
    achievements: [
      {
        id: "a1",
        title: "Первый шаг",
        description: "Завершить первый курс",
        image: "/assets/images/rocket.png",
        imageBg: "#F3D57F",
        current: 1,
        total: 10,
      },
      {
        id: "a2",
        title: "Настойчивость",
        description: "Заниматься 7 дней подряд",
        image: "/assets/images/trophy.png",
        imageBg: "#B1E5FC",
        current: 6,
        total: 7,
      },
      {
        id: "a3",
        title: "Первые 5 комплексов",
        description: "Пройти 5 комплексов упражнений",
        image: "/assets/images/medal.png",
        imageBg: "#FFD700",
        current: 5,
        total: 5,
      },
      {
        id: "a4",
        title: "10 дней подряд",
        description: "Тренироваться 10 дней без перерыва",
        image: "/assets/images/fire.png",
        imageBg: "#FFB74D",
        current: 8,
        total: 10,
      },
      {
        id: "a5",
        title: "Первые 20 упражнений",
        description: "Выполнить 20 упражнений",
        image: "/assets/images/course.png",
        imageBg: "#B1E5FC",
        current: 20,
        total: 20,
      },
      {
        id: "a6",
        title: "Первые 3 марафона",
        description: "Принять участие в 3 марафонах",
        image: "/assets/images/marketPlace.png",
        imageBg: "#F3D57F",
        current: 2,
        total: 3,
      },
      {
        id: "a7",
        title: "Первые 10 комментариев",
        description: "Оставить 10 комментариев",
        image: "/assets/images/bookmark.png",
        imageBg: "#B1E5FC",
        current: 7,
        total: 10,
      },
      {
        id: "a8",
        title: "Первые 15 лайков",
        description: "Поставить 15 лайков",
        image: "/assets/images/like.png",
        imageBg: "#FFD700",
        current: 15,
        total: 15,
      },
      {
        id: "a9",
        title: "Первые 5 видео",
        description: "Посмотреть 5 видео",
        image: "/assets/images/video.png",
        imageBg: "#FFB74D",
        current: 5,
        total: 5,
      },
      {
        id: "a10",
        title: "Первые 2 достижения",
        description: "Получить 2 достижения",
        image: "/assets/images/trophy.png",
        imageBg: "#B1E5FC",
        current: 2,
        total: 2,
      },
      {
        id: "a11",
        title: "Первые 3 отзыва",
        description: "Оставить 3 отзыва",
        image: "/assets/images/reviewSliderImages/image1.png",
        imageBg: "#F3D57F",
        current: 1,
        total: 3,
      },
      {
        id: "a12",
        title: "15 дней в streak",
        description: "Быть в streak 15 дней",
        image: "/assets/images/fire.png",
        imageBg: "#FFB74D",
        current: 12,
        total: 15,
      },
      {
        id: "a13",
        title: "Первые 2 курса",
        description: "Завершить 2 курса",
        image: "/assets/images/course.png",
        imageBg: "#B1E5FC",
        current: 2,
        total: 2,
      },
      {
        id: "a14",
        title: "Первые 5 дней streak",
        description: "Быть в streak 5 дней",
        image: "/assets/images/fire.png",
        imageBg: "#FFB74D",
        current: 5,
        total: 5,
      },
      {
        id: "a15",
        title: "Первые 10 курсов",
        description: "Завершить 10 курсов",
        image: "/assets/images/rocket.png",
        imageBg: "#F3D57F",
        current: 7,
        total: 10,
      },
      {
        id: "a16",
        title: "Первые 50 упражнений",
        description: "Выполнить 50 упражнений",
        image: "/assets/images/course.png",
        imageBg: "#B1E5FC",
        current: 25,
        total: 50,
      },
      {
        id: "a17",
        title: "Первые 100 упражнений",
        description: "Выполнить 100 упражнений",
        image: "/assets/images/course.png",
        imageBg: "#FFD700",
        current: 50,
        total: 100,
      },
      {
        id: "a18",
        title: "Первые 30 дней streak",
        description: "Быть в streak 30 дней",
        image: "/assets/images/fire.png",
        imageBg: "#FFB74D",
        current: 18,
        total: 30,
      },
    ],
  },
  {
    id: "2",
    name: "Марина Иванова",
    email: "marina.ivanova@example.com",
    phone: "+7 (999) 123–45–67",
    location: "Санкт-Петербург, Россия",
    image: "/assets/images/personImage2.png",
    goals: {
      currentStreak: 7,
      recordStreak: 20,
      calendarIntegration: "apple",
    },
    statistics: [
      {
        id: "bb1",
        label: "8 комплексов",
        text: "Просмотрено",
        icon: FaRegCheckCircle,
      },
      { id: "bb2", label: "15 уроков", text: "Пройдено", icon: FaStar },
      {
        id: "bb3",
        label: "6 часов",
        text: "Время занятий",
        icon: FaRegCheckCircle,
      },
      {
        id: "bb4",
        label: "5 дней",
        text: "Подряд тренировалась",
        icon: FaStar,
      },
      {
        id: "bb5",
        label: "3 новых упражнения",
        text: "Добавлено",
        icon: FaRegCheckCircle,
      },
      { id: "bb6", label: "2 марафона", text: "Участвовала", icon: FaStar },
      {
        id: "bb7",
        label: "5 комментариев",
        text: "Оставлено",
        icon: FaRegCheckCircle,
      },
      { id: "bb8", label: "10 лайков", text: "Поставлено", icon: FaStar },
      {
        id: "bb9",
        label: "12 видео",
        text: "Просмотрено",
        icon: FaRegCheckCircle,
      },
      { id: "bb10", label: "3 достижения", text: "Получено", icon: FaStar },
      {
        id: "bb11",
        label: "2 отзыва",
        text: "Оставлено",
        icon: FaRegCheckCircle,
      },
      { id: "bb12", label: "9 дней", text: "В streak", icon: FaStar },
    ],
    achievements: [
      {
        id: "a1",
        title: "Первый шаг",
        description: "Завершить первый курс",
        image: "/assets/images/rocket.png",
        imageBg: "#F3D57F",
        current: 3,
        total: 10,
      },
      {
        id: "a2",
        title: "Настойчивость",
        description: "Заниматься 7 дней подряд",
        image: "/assets/images/trophy.png",
        imageBg: "#B1E5FC",
        current: 7,
        total: 7,
      },
    ],
  },
];
