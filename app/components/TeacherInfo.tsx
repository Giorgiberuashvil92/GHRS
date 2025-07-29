import Image from "next/image";
import { PiStudent } from "react-icons/pi";
import { FaCertificate } from "react-icons/fa6";
import { MdOutlineWeb } from "react-icons/md";
import DesktopNavbar from "./Navbar/DesktopNavbar";
import { defaultMenuItems } from "./Header";
import CourseSlider from "./CourseSlider";
import CourseContents from "./CourseContents";
import Professional from "./Professional";
import Certificate from "./Certificate";
import Subscribe from "./Subscribe";
import { Footer } from "./Footer";

const ContentsSidebar = () => (
  <div className="bg-white rounded-[20px] p-5 shadow-sm">
    <h3 className="text-[#3D334A] text-[16px] font-semibold mb-4">
      Содержание
    </h3>
    <ol className="flex flex-col gap-2 text-[14px]">
      {Array.from({ length: 10 }).map((_, i) => (
        <li key={i}>
          <a href={`#q${i + 1}`} className="text-[#846FA0] hover:underline">
            Что считается сидячим образом жизни?
          </a>
        </li>
      ))}
    </ol>
  </div>
);

interface TeacherInfoProps {
  instructorId?: string;
}

const TeacherInfo = ({ instructorId }: TeacherInfoProps) => {
  // TODO: Use instructorId to fetch instructor data from API
  console.log('Loading instructor with ID:', instructorId);
  
  return (
    <div className="min-h-screen bg-[#F9F7FE] py-6 px-2 md:px-8">
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} allCourseBg={false} />
      <div className=" mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 w-full md:w-[270px] flex-shrink-0">
          <Image
            src={"/assets/images/user1.png"}
            width={270}
            height={270}
            alt="user1"
            className="rounded-[15px] w-full h-[270px] object-cover mb-4"
          />
          <ContentsSidebar />
        </div>
        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-sm flex flex-col gap-4 mb-6">
            <div className="text-[#3D334A] flex flex-col gap-2.5">
              <h1 className="text-[24px] md:text-[32px] leading-[120%] font-bold">
                ААРОН ЯКОБИ
              </h1>
              <p className="font-medium leading-[120%] text-[15px] md:text-base">
                Основатель и руководитель «Колледжа медицинского массажа»
                <br />
                Dr.Аарон Якоби, Ph.D, C.A., P.T.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 mt-2">
              <div className="rounded-[20px] border border-[#E2CCFF] bg-white text-center w-full md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm">
                <PiStudent color="#D4BAFC" size={28} />
                <h5 className="text-[#D4BAFC] mt-2 text-[15px]">
                  Курсы преподавателя
                </h5>
              </div>
              <div className="rounded-[20px] border border-[#E2CCFF] bg-white text-center w-full md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm">
                <FaCertificate color="#D4BAFC" size={28} />
                <h5 className="text-[#D4BAFC] mt-2 text-[15px]">
                  Сертификаты преподавателя
                </h5>
              </div>
              <div className="rounded-[20px] border border-[#E2CCFF] bg-white w-full text-center md:w-[220px] py-6 md:py-8 h-[110px] md:h-[120px] flex items-center justify-center flex-col shadow-sm">
                <MdOutlineWeb color="#D4BAFC" size={28} />
                <h5 className="text-[#D4BAFC] mt-2 text-[15px]">Вебинары</h5>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-6 md:p-10 shadow-sm">
            <h2 className="text-[#3D334A] text-[22px] md:text-[28px] font-bold mb-6">
              О ПРЕПОДАВАТЕЛЕ
            </h2>
            <p className="text-[#3D334A] text-[15px] md:text-base mb-4">
              Аарон Якоби — выпускник Института Уингейта, Национального
              института первого опыта в спорте Государства Израиль, выпускник
              курса национальных тренеров по спорту.
              <br />
              <br />
              <p className="font-[Pt]">
                Аарон Якови - выпускник Института Уингейта, Национального
                института передового опыта в спорте Государства Израиль,
                выпускник курса национальных тренеров по спорту. В 1982 году
                окончил курс Мануальной-терапии в Парамедицинском институте в
                Карлсруэ, Германия. В 1996 году он окончил факультет китайской
                медицины Колледжа комплиментарной медицины в Тель-Авиве, филиал
                Тихоокеанского колледжа в Калифорнии. В 2004 году он получил
                докторскую степень в Ньюпортском университете в Калифорнии.
                Аарон Якови прошел множество профессиональных тренингов и
                специализаций по проблемам спортивных травм, реабилитации
                пострадавших от инсульта и ортопедических проблем, таких как:
                спина, шея, плечи, колени и лодыжки и другое. В период с 1983 по
                1997 год он обладал титулом чемпиона Израиля по боксу
                практически 15 лет подряд. Как спортсмен он десять лет был одним
                из лучших боксеров мира. Он участвовал в Олимпийских играх 1988
                года в Сеуле и в том же году выиграл Кубок европейских
                чемпионов. Аарон Якови проработал 15 лет в отделе достижений в
                спорте Института Уингейта в качестве фитнес-тренера и терапевта
                израильских команд по олимпийским дисциплинам на Олимпийских
                играх 92, Барселона 96 и Сидней 2000. Вершина его достижений -
                выигрыш Кубка европейских чемпионов «European City Cup» с
                баскетбольной командой «Урал-Грейт» из России в сезоне 2005/6.
                Среди его пациентов - олимпийские медалисты Израиля: Яэль Арад,
                Орен Самаджа и Арик Зееви, многие знаменитости в области
                телевидения и кино, старшие актеры из театров Cameri и Habima,
                ведущие бизнесмены страны, баскетболисты Maccabi Tel Aviv,
                футболисты и ЦАХАЛ. Dr. Аарон Якови рассказывает: «В течение 15
                лет я обладал титулом чемпиона Израиля по боксу. Я представлял
                страну по всему миру и одновременно работал с ведущими
                спортсменами государства. Решимость и настойчивость, а также
                способность справляться с трудностями, давлением, препятствиями
                и бесчисленными кризисами на пути к вершине - это залог успеха».
                Давайте узнаем, как соединить все кусочки пазла на пути к
                профессиональному успеху: Комбинация тела и разума, физического
                и духовного, и победная троица физического, умственного и
                интеллектуального. Хороший терапевт должен обратиться к этой
                важной троице для максимального и оптимального успеха!
                Уникальные методы Аарона Якови сочетают в себе укрепление и
                поддержание здоровья тела, в том числе с помощью физических
                упражнений для укрепления мышц и суставов, адаптированных для
                его пациентов. Уникальные методы лечения, разработанные за годы
                его богатого профессионального и клинического опыта, его
                мастерство и профессионализм, дают большие знания его ученикам,
                а также инструменты и средства для обучения на самом высоком
                уровне. Терапевту в искусстве сенсорной терапии не обязательно
                испытывать боль во плоти, чтобы правильно лечить своих
                пациентов, но терапевты, которые сами испытали различные типы
                боли и инвалидности, обладают особым пониманием и
                чувствительностью к эмоциональным и физическим переживаниям,
                которые испытывают приходящие к ним пациенты. Естественно, мы
                по-разному относимся к людям с похожим опытом. Сочувствие
                заставляет нас относиться к ним лучше и чувствовать с ними
                партнерство. По этой причине спортсменам легче обратиться к
                терапевту, который также имеет спортивное прошлое. Тот факт, что
                Аарон Якови занимается спортом, помогает ему лучше понять
                потребности спортсменов из-за травм, которые он сам перенес в
                прошлом. Годы обучения и углубленного изучения этой области
                помогли в приобретении обширного клинического опыта, что
                позволило предоставить уникальные методы лечения, сочетающие
                передовые методы лечения. Эти методы представляют собой
                идеальное решение для широкого круга лиц с ограниченными
                возможностями, и являются адекватной физической и
                психологической поддержкой.
              </p>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6 w-[220px] flex-shrink-0">
          <Image
            src="/assets/images/reklamos.png"
            width={180}
            height={220}
            alt="ads"
            className="rounded-[10px] w-full object-cover"
          />
        </div>
      </div>
      <div className="md:mt-10">
      <Professional withBanner={false} title={""} bgColor="white" withProfText={false} />
      </div>
      <Certificate />
     <div className="my-10">
     <Subscribe
          backgroundImage="/assets/images/bluebg.jpg"
          titleKey="subscription.title"
          buttonTextKey="buttons.subscribe"
          buttonTextColor="#3D334A"
          buttonBgColor="#FFFFFF"
          bgCenter={true}
          containerStyles="custom-class"
          titleStyles="text-white"
          buttonStyles="hover:opacity-80"
        />
     </div>
        <Footer />
    </div>
  );
};

export default TeacherInfo;
