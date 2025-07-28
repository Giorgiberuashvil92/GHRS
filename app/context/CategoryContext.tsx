"use client";

import React, { createContext, useContext } from "react";
import { Set } from "../types/category";

export interface SubcategoryItem {
  id: number;
  _id: string;
  name: string;
  nameGe: string;
  nameRu: string;
  image: string;
  categoryId: string;
  sets: Set[];
}

export interface CategoryItem {
  id: number;
  _id: string;
  title: string;
  backgroundImage: string;
  categoryImage: string;
  items: string[];
  subcategories: SubcategoryItem[];
  sets: Set[];
}

interface CategoryContextType {
  categories: CategoryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: false,
  error: null,
  refetch: async () => {},
});

export const useCategory = () => useContext(CategoryContext);

export default CategoryContext;
