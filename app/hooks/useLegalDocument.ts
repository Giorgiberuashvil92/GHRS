import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

interface LegalDocument {
  _id: string;
  type: string;
  locale: string;
  title: string;
  content: string;
  isActive: boolean;
  version?: string;
  effectiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const useLegalDocument = (type: string, locale: string) => {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDocument(null);
    // New interface languages use their static translations until CMS content exists.
    if (!['ka', 'en', 'ru'].includes(locale)) {
      setLoading(false);
      setError(null);
      return;
    }
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/legal/document?type=${type}&locale=${locale}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch legal document: ${response.statusText}`);
        }

        const data = await response.json();
        if (!cancelled) setDocument(data);
      } catch (err) {
        console.error('Error fetching legal document:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setDocument(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (type && locale) {
      fetchDocument();
    }
    return () => { cancelled = true; };
  }, [type, locale]);

  return { document, loading, error };
};
