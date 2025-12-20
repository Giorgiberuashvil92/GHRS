import { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '../config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // TEMPORARY FIX: Remove /api prefix for production Render backend
    const isProduction = typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' &&
      API_CONFIG.BASE_URL.includes('render.com');
    
    const endpoint = isProduction ? '/statistics/global' : '/api/statistics/global';
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Statistics fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
} 