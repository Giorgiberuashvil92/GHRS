import { useState, useEffect } from 'react';
import { getArticles, Article } from '@/app/api/articles';

interface UseArticlesOptions {
  page?: number;
  limit?: number;
  blogId?: string;
  categoryId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export const useArticles = (options: UseArticlesOptions = {}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getArticles(options);
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [options.page, options.limit, options.blogId, options.categoryId, options.isPublished, options.isFeatured]);

  return { articles, loading, error };
}; 