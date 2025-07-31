'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '../context/I18nContext';

interface PurchasePromptProps {
  setId: string;
  setName?: string;
  className?: string;
}

export default function PurchasePrompt({ setId, setName, className = '' }: PurchasePromptProps) {
  const { t } = useI18n();

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 text-center border border-purple-200 ${className}`}>
      <div className="mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {t('purchase.premium_content')}
        </h3>
        <p className="text-gray-600 mb-6">
          {setName ? 
            t('purchase.set_requires_purchase', { setName }) : 
            t('purchase.content_requires_purchase')
          }
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">
            {t('purchase.what_you_get')}
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('purchase.unlimited_access')}
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('purchase.all_exercises')}
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t('purchase.progress_tracking')}
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/shoppingcard?addSet=${setId}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            {t('purchase.buy_now')}
          </Link>
          <Link
            href="/chapter"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            {t('purchase.browse_courses')}
          </Link>
        </div>
      </div>
    </div>
  );
}
