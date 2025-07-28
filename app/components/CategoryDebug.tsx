"use client";

import { useCategories } from "../context/CategoryContext";

export default function CategoryDebug() {
  const { categories, loading, error, refetch } = useCategories();

  // მხოლოდ development-ში ჩანდეს
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const API_URL = process.env.NODE_ENV === 'development'
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
    : (process.env.NEXT_PUBLIC_API_URL || "https://ghrs-backend.onrender.com");
  const fullEndpoint = `${API_URL}/api/categories/complete-hierarchy`;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50 border border-gray-600">
      <h3 className="font-bold mb-2">🐛 Category Debug</h3>

      <div className="mb-2">
        <strong>Status:</strong>{" "}
        {loading ? "⏳ Loading..." : error ? "❌ Error" : "✅ Loaded"}
      </div>

      <div className="mb-2">
        <strong>Endpoint:</strong>
        <div className="text-blue-300 break-all">{fullEndpoint}</div>
      </div>

      {error && (
        <div className="mb-2 text-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-2">
        <strong>Count:</strong> {categories.length} categories
      </div>

      <div className="mb-2">
        <button
          onClick={() => refetch()}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          disabled={loading}
        >
          🔄 Refetch
        </button>
      </div>

      <div className="max-h-32 overflow-y-auto">
        <strong>Data:</strong>
        <pre className="text-xs mt-1 bg-gray-800 p-2 rounded">
          {JSON.stringify(categories.slice(0, 2), null, 2)}
          {categories.length > 2 && "\n...(showing first 2)"}
        </pre>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        ENV: {process.env.NODE_ENV}
      </div>
    </div>
  );
}
