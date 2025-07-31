import { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '../config/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/statistics/global`);
    
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