"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "../../context/I18nContext";
import { Set } from "../../types/category";
import { apiRequest } from "../../config/api";
import VideoPlayer from "../../components/VideoPlayer";
import VideoList from "../../components/VideoList";

const SetDetails = () => {
  const { t } = useI18n();
  const params = useParams();
  const [set, setSet] = useState<Set | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  useEffect(() => {
    const fetchSet = async () => {
      try {
        setLoading(true);
        const endpoint = `/api/sets/${params.id}`;
        const data = await apiRequest<Set>(endpoint);
        setSet(data);
        
        // თუ სეტს აქვს ვიდეოები, პირველი ვიდეო ავირჩიოთ
        if (data.videos.length > 0) {
          setSelectedVideo(0);
        }
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

  if (loading) return <div>{t('loading')}...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!set) return <div>{t('errors.set_not_found')}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{set.name.ka}</h1>
          <p className="text-gray-600 mb-6">{set.description.ka}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ვიდეო ფლეიერი */}
            <div className="lg:col-span-2">
              {selectedVideo !== null && set.videos[selectedVideo] && (
                <VideoPlayer video={set.videos[selectedVideo]} />
              )}
            </div>

            {/* სეტის ინფორმაცია და ვიდეოების სია */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">{t('common.subscription_plans')}</h3>
                <div className="space-y-3">
                  {set.subscriptionPlans.map((plan: any, index: any) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                    >
                      <span className="text-gray-700">{plan.period} {t('months')}</span>
                      <span className="font-semibold text-purple-600">
                        {plan.price} ₾
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <VideoList
                videos={set.videos}
                selectedVideo={selectedVideo}
                onVideoSelect={setSelectedVideo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetDetails; 