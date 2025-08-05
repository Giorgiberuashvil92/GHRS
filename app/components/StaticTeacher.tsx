import Image from "next/image";

const StaticTeacher = () => {
    return (
        <div className="flex flex-col md:flex-row items-start md:mx-10 bg-[#F9F7FE] p-4 md:p-8">
            <div className="flex-shrink-0">
                <Image
                    src="/assets/images/teacher.png"
                    width={511}
                    height={496}
                    alt="teacher"
                    className="rounded-[15px] object-cover"
                />
            </div>

            <div className="flex flex-col bg-white p-4 md:p-6 rounded-[15px] h-[516px] max-w-4xl">
                <h1 className="text-[#3D334A] text-[32px] md:text-[40px] leading-[120%] font-bold">
                    ААРОН ЯКОБИ
                </h1>

                <p className="text-[#3D334A] text-[20px] md:text-[24px] leading-[120%] mb-6 max-w-[700px] mt-4">
                    Основатель и руководитель «Колледжа медицинского массажа» Dr.Аарон Якоби, Ph.D, C.A., P.T.
                </p>

                <p className="text-[#846FA0] text-[16px] md:text-[18px] leading-[140%] tracking-[-0.01em] mt-6">
                    <span className="my-6 py-6">Аарон Якови - выпускник Института Уингейта, Национального института передового опыта в спорте Государства Израиль, выпускник 
                    курса национальных тренеров по спорту. </span><br className="hidden md:block mb-4 mt-6" /> <br />
                    <span className="my-6">В 1982 году окончил курс Мануальной-терапии в Парамедицинском институте в Карлсруэ, Германия. </span> <br /><br className="hidden md:block mt-6 pt-6 mb-12" />
                    <span className="my-6">В 1996 году он окончил факультет китайской медицины Колледжа комплиментарной медицины в Тель-Авиве, филиал Тихоокеанского колледжа в Калифорнии.</span>
                </p>

                <button className="self-end text-[#D4BAFC] text-[20px] md:text-[24px] leading-[90%] uppercase mt-16">
                    Подробнее
                </button>
            </div>
        </div>
    );
};

export default StaticTeacher;
