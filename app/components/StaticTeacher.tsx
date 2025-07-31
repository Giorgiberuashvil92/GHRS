import Image from "next/image"

const StaticTeacher = () => {
    return  <div className="flex items-start md:mx-10 bg-[#F9F7FE] ">
        <Image src={"/assets/images/teacher.png"} className="rounded-[15px]" width={511} height={496} alt="teacher" />
        <div className="flex flex-col bg-white pl-[15px]">
            <h1 className="text-[#3D334A] text-[40px] leading-[120%] ">ААРОН ЯКОБИ</h1>
            <p className="font-[Pt] text-[24px] leading-[120%] text-[#3D334A] mt-5 mb-[30px] max-w-[700px] ">Основатель и руководитель «Колледжа медицинского массажа» Dr.Аарон Якоби, Ph.D, C.A., P.T.</p>
            <p className="text-[#846FA0] text-[18px] leading-[140%] tracking-[-1%] font-[Pt]">Аарон Якови - выпускник Института Уингейта, Национального института передового опыта в спорте Государства Израиль, выпускник 
            курса национальных тренеров по спорту. <br className="md:mb-5" />
            В 1982 году окончил курс Мануальной-терапии в Парамедицинском институте в Карлсруэ, Германия. <br className="md:mb-5" />
            В 1996 году он окончил факультет китайской медицины Колледжа комплиментарной медицины в Тель-Авиве, филиал Тихоокеанского колледжа в Калифорнии.
            </p>
            <button className="text-[#D4BAFC] text-end items-end justify-end flex mr-4 pr-4 text-[24px] leading-[90%] uppercase mt-[35px]">Подробнее</button>
        </div>
    </div>
}

export default StaticTeacher;