"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "../../context/I18nContext";
import { Set } from "../../types/category";
import { apiRequest } from "../../config/api";
import { useUserAccess } from "../../hooks/useUserAccess";
import PurchasePrompt from "../../components/PurchasePrompt";
import { useAuth } from "../../context/AuthContext";

const SetDetails = () => {
  const { t } = useI18n();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [set, setSet] = useState<Set | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const setId = params.id as string;
  const { hasAccess, loading: accessLoading } = useUserAccess(setId);

  useEffect(() => {
    const fetchSet = async () => {
      try {
        setLoading(true);
        // Use API_CONFIG endpoint builder for consistency
        const endpoint = `/api/sets/${params.id}`;
        console.log('🔍 Fetching set from:', endpoint);
        const data = await apiRequest<Set>(endpoint);
        console.log('✅ Set data received:', data);
        setSet(data);
      } catch (err) {
        console.error("❌ Error fetching set:", err);
        setError(t('errors.failed_to_load'));
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSet();
    }
  }, [params.id, t]);

  if (loading || accessLoading) return <div>{t('loading')}...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!set) return <div>{t('errors.set_not_found')}</div>;

  // თუ იუზერი არ არის ავტორიზებული ან არ აქვს access
  if (!isAuthenticated || !hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{set.name.ka}</h1>
            <p className="text-gray-600 mb-6">{set.description.ka}</p>
            
            <PurchasePrompt 
              setId={setId} 
              setName={set.name.ka}
              className="mt-8"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{set.name.ka}</h1>
          <p className="text-gray-600 mb-6">{set.description.ka}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ვიდეო კონტენტი - მხოლოდ purchased users-ისთვის */}
            <div className="lg:col-span-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800 font-semibold">თქვენ გაქვთ წვდომა ამ კომპლექსზე</span>
                </div>
              </div>
              
              {/* აქ იქნება ვარჯიშების კონტენტი */}
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600">ვარჯიშების კონტენტი იტვირთება...</p>
              </div>
            </div>

            {/* სეტის ინფორმაცია */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">კომპლექსის ინფორმაცია</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">სირთულის დონეები:</span>
                    <span className="font-semibold">{set.difficultyLevels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">სტატუსი:</span>
                    <span className="text-green-600 font-semibold">შეძენილი</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetDetails; 