"use client";
import { FC, useState } from "react";
import Image from "next/image";
import { useI18n } from "../context/I18nContext";
import { API_CONFIG } from "../config/api";
import { LinkedinIcon } from "./socialIcons/LinkedinIcon";
import { InstagramIcon } from "./socialIcons/InstagramIcon";
import { YoutubeIcon } from "./socialIcons/YoutubeIcon";
import { VkIcon } from "./socialIcons/VkIcon";
import { FacebookIcon } from "./socialIcons/FacebookIcon";
import { Xicon } from "./socialIcons/X";

export const Footer: FC = () => {
  const { t, locale } = useI18n();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Category and Subcategory IDs mapping - exact IDs from database
  const categoryLinks = {
    cervicalSpine: "6888aa178e3196ddea6b78eb",
    thoracicSpine: "6888aaca8e3196ddea6b78f4",
    lumbarSpine: "6896080a84545316330a34b7",
    upperLimbs: "689608af84545316330a34c0",
    lowerLimbs: "6896091384545316330a34c9",
    posture: "689609a884545316330a34d2",
    neurology: "689602c984545316330a346d",
    aphasia: "689a0bc09c575c1535e893bb",
    obesity: "6888ab6e8e3196ddea6b78ff",
    gaitRehab: "689a05f99c575c1535e8936b",
    covidRehab: "689a0e1f9c575c1535e893f0",
  };

  // Complex/Set IDs for specific conditions
  const complexLinks = {
    parkinsons: "68b0438313d16a75ad996170",
    stroke: "68b58de24e1584dece73f309",
    facialNerve: "68b20b0f3c10e18faa9d2d3f",
    multipleSclerosis: "68b35835b024f89e8a0615af",
  };

  const orthopedicsId = "6888a9028e3196ddea6b78d8";

  // Social media links based on language
  const socialLinks = {
    // Russian social networks
    vk: "https://vk.com/ghrsgroup",
    ok: "https://ok.ru/group/70000002767733",
    dzen: "https://dzen.ru/ghrsgroup",
    telegram: "https://t.me/ghrsgroup",
    rutube: "https://rutube.ru/channel/45999134/",
    // International
    youtube: "https://www.youtube.com/@ghrsgroup",
    // English social networks
    instagram: "https://instagram.com/ghrs_group",
    facebook: "https://www.facebook.com/ghrs.gr/",
    twitter: "https://twitter.com/ghrs_group",
    linkedin: "https://www.linkedin.com/in/ghrs-group",
  };

  // Footer links - now pointing to internal pages
  const footerLinks = {
    en: {
      userAgreement: "/user-agreement",
      consent: "/consent",
      privacyPolicy: "/privacy-policy",
    },
    ru: {
      userAgreement: "/user-agreement",
      dataProcessing: "/consent",
      privacyPolicy: "/privacy-policy",
    },
    ka: {
      userAgreement: "/user-agreement",
      consent: "/consent",
      privacyPolicy: "/privacy-policy",
    },
  };

  const currentLinks = footerLinks[locale as keyof typeof footerLinks] || footerLinks.en;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const phoneRegex = /^[0-9+\-()\s]*$/;
      if (!phoneRegex.test(value)) {
        return; 
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const requestUrl = `${API_CONFIG.BASE_URL}/api/consultation`;
    console.log('🔍 Consultation Request Details:', {
      url: requestUrl,
      baseUrl: API_CONFIG.BASE_URL,
      endpoint: '/api/consultation',
      formData,
      locale
    });

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      console.log('📡 Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      setSubmitStatus('success');
      setFormData({ name: '', phone: '', email: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Consultation request error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F9F7FE] rounded-[20px] px-8 pt-8 pb-4 font-pt">
      {/* კონსულტაციის ფორმა */}
      <div className="mb-8 px-16">
        <h2 className="text-4xl font-bold text-[#3D334A] mb-8 font-bowler">
          {t("consultation.title")}{" "}
          <span className="text-[#B6A3D9]">{t("consultation.titleHighlight")}</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("form.name")}
              className="flex-1 rounded-lg px-4 py-3 bg-white text-[#3D334A] text-lg placeholder:text-[#846FA0] placeholder:font-medium outline-none focus:ring-2 focus:ring-[#B6A3D9] transition font-pt"
              required
              disabled={isSubmitting}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t("form.phone")}
              className="flex-1 rounded-lg px-4 py-3 bg-white text-[#3D334A] text-lg placeholder:text-[#846FA0] placeholder:font-medium outline-none focus:ring-2 focus:ring-[#B6A3D9] transition font-pt"
              required
              disabled={isSubmitting}
              pattern="[0-9+\-()\s]+"
              title="Please enter a valid phone number (numbers, +, -, (), spaces only)"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("form.email")}
              className="flex-1 rounded-lg px-4 py-3 bg-white text-[#3D334A] text-lg placeholder:text-[#846FA0] placeholder:font-medium outline-none focus:ring-2 focus:ring-[#B6A3D9] transition font-pt"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#B6A3D9] text-white px-10 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[#846FA0] transition-all text-lg shadow-md w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed font-bowler"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {locale === 'en' ? 'Sending...' : locale === 'ru' ? 'Отправка...' : 'იგზავნება...'}
                </>
              ) : (
                <>
                  {t("consultation.button")} <span className="text-2xl">→</span>
                </>
              )}
            </button>
            <span className="text-[#846FA0] font-medium mt-2 md:mt-0 max-w-[450px] text-lg font-pt">
              {t("consultation.consent")}
            </span>
          </div>
        </form>
        
        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-pt">
            {locale === 'en' ? '✅ Thank you! We will contact you soon.' : 
             locale === 'ru' ? '✅ Спасибо! Мы свяжемся с вами в ближайшее время.' : 
             '✅ მადლობა! ჩვენ მალე დაგიკავშირდებით.'}
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-pt">
            {errorMessage || (locale === 'en' ? '❌ Something went wrong. Please try again.' : 
             locale === 'ru' ? '❌ Что-то пошло не так. Пожалуйста, попробуйте еще раз.' : 
             '❌ რაღაც არასწორად მოხდა. გთხოვთ სცადოთ ხელახლა.')}
          </div>
        )}
      </div>

      <hr className="my-6 border-[#E0D6F9]" />

      {/* მთავარი ბლოკი */}
      <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-8 items-center md:items-start px-16">
        {/* მარცხენა */}
        <div className="flex flex-col md:flex-row gap-2 min-w-[220px] items-center">
          <Image
            src="/assets/images/footerLogo.svg"
            alt="GRS Logo"
            width={180}
            height={40}
            className="mb-2"
          />
          <div className="flex flex-col ml-6 gap-5">
            <span className="text-lg text-[#846FA0] font-medium font-pt">{t("workHours")}</span>
            {locale === "ru" ? (
              <a
                href="tel:+79168561145"
                className="text-2xl font-bold text-[#846FA0] hover:text-[#D4BAFC] transition-colors font-pt"
              >
                +7 (916) 856—11—45
              </a>
            ) : (
              <a
                href="tel:+972539617579"
                className="text-2xl font-bold text-[#846FA0] hover:text-[#D4BAFC] transition-colors font-pt"
              >
                +972 53-9617579
              </a>
            )}
            <a
              href="mailto:office@ghrs-group.com"
              className="text-[#846FA0] text-lg font-medium hover:text-[#D4BAFC] hover:underline font-pt"
            >
              office@ghrs-group.com
            </a>
            {locale !== "ru" && (
              <a
                href="https://wa.me/+972539617579?text=Hello!%20I'd%20like%20to%20get%20some%20info."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] text-sm hover:underline flex items-center gap-2 font-pt"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* სოციალური ღილაკები */}
        <div className="flex gap-3 items-center justify-center mt-4 flex-wrap">
          {/* YouTube - ყველა ენაზე */}
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
          >
            <YoutubeIcon className="w-12 h-12" />
          </a>

          {/* რუსული სოციალური ქსელები */}
          {locale === "ru" && (
            <>
              <a
                href={socialLinks.vk}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
                title="VK"
              >
                <VkIcon className="w-12 h-12" />
              </a>
              <a
                href={socialLinks.ok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
                title="Odnoklassniki"
              >
                <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#EE8208"/>
                  <path d="M24 8C19.6 8 16 11.6 16 16C16 20.4 19.6 24 24 24C28.4 24 32 20.4 32 16C32 11.6 28.4 8 24 8ZM24 20C21.8 20 20 18.2 20 16C20 13.8 21.8 12 24 12C26.2 12 28 13.8 28 16C28 18.2 26.2 20 24 20ZM30 26C28.8 25.4 27.4 25 26 25C25.4 25 24.7 25.1 24 25.2C23.3 25.1 22.6 25 22 25C20.6 25 19.2 25.4 18 26C17.4 26.3 17 26.9 17 27.5C17 28.3 17.7 29 18.5 29H29.5C30.3 29 31 28.3 31 27.5C31 26.9 30.6 26.3 30 26ZM26.5 32L24 34.5L21.5 32C20.7 31.2 19.3 31.2 18.5 32C17.7 32.8 17.7 34.2 18.5 35L21 37.5L18.5 40C17.7 40.8 17.7 42.2 18.5 43C19.3 43.8 20.7 43.8 21.5 43L24 40.5L26.5 43C27.3 43.8 28.7 43.8 29.5 43C30.3 42.2 30.3 40.8 29.5 40L27 37.5L29.5 35C30.3 34.2 30.3 32.8 29.5 32C28.7 31.2 27.3 31.2 26.5 32Z" fill="white"/>
                </svg>
              </a>
              <a
                href={socialLinks.dzen}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
                title="Dzen"
              >
                <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#000000"/>
                  <path d="M24 12C17.4 12 12 17.4 12 24C12 30.6 17.4 36 24 36C30.6 36 36 30.6 36 24C36 17.4 30.6 12 24 12ZM24 32C19.6 32 16 28.4 16 24C16 19.6 19.6 16 24 16C28.4 16 32 19.6 32 24C32 28.4 28.4 32 24 32Z" fill="white"/>
                  <circle cx="24" cy="24" r="4" fill="white"/>
                </svg>
              </a>
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
                title="Telegram"
              >
                <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#29B6F6"/>
                  <path d="M10.5 23.5L35.5 13.5L28.5 35.5L23.5 25.5L10.5 23.5Z" fill="white"/>
                </svg>
              </a>
              <a
                href={socialLinks.rutube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
                title="Rutube"
              >
                <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#00D8FF"/>
                  <path d="M18 16L32 24L18 32V16Z" fill="white"/>
                </svg>
              </a>
            </>
          )}

          {/* ინგლისური სოციალური ქსელები */}
          {locale === "en" && (
            <>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
              >
                <InstagramIcon className="w-12 h-12" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
              >
                <FacebookIcon className="w-12 h-12" />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
              >
                <Xicon className="w-12 h-12" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
              >
                <LinkedinIcon className="w-12 h-12" />
              </a>
            </>
          )}

          {/* ქართული - ყველა ლინკი */}
          {locale === "ka" && (
            <>
              <a
                href={socialLinks.vk}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
              >
                <VkIcon className="w-12 h-12" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
              >
                <InstagramIcon className="w-12 h-12" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
              >
                <FacebookIcon className="w-12 h-12" />
              </a>
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#B6A3D9]/30 rounded-full p-2 transition flex items-center justify-center"
              >
                <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#29B6F6"/>
                  <path d="M10.5 23.5L35.5 13.5L28.5 35.5L23.5 25.5L10.5 23.5Z" fill="white"/>
                </svg>
              </a>
            </>
          )}
        </div>
      </div>

      <hr className="my-6 border-[#E0D6F9]" />

      {/* ლინკები */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 px-16 text-[#846FA0] font-medium font-pt text-lg">
        <div className="flex flex-col gap-3">
          <a href="/" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.home")}</a>
          <a href="/rehabilitation" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.rehabilitation")}</a>
          <a href="/professional" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.development")}</a>
          <a href="/blog" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.blog")}</a>
        </div>
        <div className="flex flex-col gap-3">
          <a href="/about" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.about")}</a>
          <a href="/faq" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.faq")}</a>
          <a href="/user-guide" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.userGuide")}</a>
        </div>
        <div className="flex flex-col gap-3">
          <a href="/allComplex" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.allSets")}</a>
          <a href={`/categories/${orthopedicsId}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.orthopedics")}</a>
          <ul className="flex flex-col gap-2 pl-4">
            <li><a href={`/categories/${categoryLinks.cervicalSpine}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.cervical")}</a></li>
            <li><a href={`/categories/${categoryLinks.thoracicSpine}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.thoracic")}</a></li>
            <li><a href={`/categories/${categoryLinks.lumbarSpine}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.lumbar")}</a></li>
            <li><a href={`/categories/${categoryLinks.upperLimbs}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.upperLimbs")}</a></li>
            <li><a href={`/categories/${categoryLinks.lowerLimbs}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.lowerLimbs")}</a></li>
            <li><a href={`/categories/${categoryLinks.posture}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.posture")}</a></li>
          </ul>
          <a href={`/categories/${categoryLinks.neurology}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.neurology")}</a>
          <ul className="flex flex-col gap-2 pl-4">
            <li><a href={`/complex/${complexLinks.parkinsons}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.parkinsons")}</a></li>
            <li><a href={`/complex/${complexLinks.stroke}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.stroke")}</a></li>
            <li><a href={`/complex/${complexLinks.facialNerve}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.facialNerve")}</a></li>
            <li><a href={`/complex/${complexLinks.multipleSclerosis}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.multipleSclerosis")}</a></li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <a href={`/categories/${categoryLinks.aphasia}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.aphasia")}</a>
          <a href={`/categories/${categoryLinks.obesity}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.obesity")}</a>
          <a href={`/categories/${categoryLinks.gaitRehab}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.gaitRehab")}</a>
          <a href="/allComplex" className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.elderlyRehab")}</a>
          <a href={`/categories/${categoryLinks.covidRehab}`} className="hover:text-[#D4BAFC] transition-colors font-medium font-pt">{t("links.covidRehab")}</a>
        </div>
      </div>

      {/* ქვედა ლოგოები */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 px-16 gap-5">
        <Image
          src="/assets/images/services/asuta.png"
          alt="Assuta"
          width={400}
          height={48}
        />
        <Image
          src="/assets/images/ichilov.png"
          alt="Ichilov Medical Center"
          width={400}
          height={48}
          className="opacity-80 mix-blend-multiply"
        />
        <Image
          src="/assets/images/sheba.png"
          alt="Sheba Medical Center"
          width={400}
          height={48}
          className="opacity-80 mix-blend-multiply"
        />
      </div>

      {/* ქვედა ტექსტი */}
      <div className="flex flex-col md:flex-row justify-between items-center text-lg text-[#846FA0] font-medium border-t border-[#E0D6F9] pt-2 text-center md:text-left px-16 gap-2 font-pt">
        <span>{t("copyright")}</span>
        <a 
          href={currentLinks.userAgreement} 
          className="hover:underline transition-colors"
        >
          {t("footerUserAgreement")}
        </a>
        {locale === "ru" ? (
          <a 
            href={(currentLinks as typeof footerLinks.ru).dataProcessing} 
            className="hover:underline transition-colors"
          >
            {t("footerDataProcessing")}
          </a>
        ) : (
          <a 
            href={(currentLinks as typeof footerLinks.en).consent} 
            className="hover:underline transition-colors"
          >
            {t("footerConsent")}
          </a>
        )}
        <a 
          href={currentLinks.privacyPolicy} 
          className="hover:underline transition-colors"
        >
          {t("footerPrivacyPolicy")}
        </a>
      </div>
    </div>
  );
};