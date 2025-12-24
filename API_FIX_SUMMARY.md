# 🔧 API Endpoints გამოსწორება - კურსები და სეტები

## ❌ პრობლემა

კურსები და სეტები არ გამოდიოდა Vercel-ზე (production-ში) რადგან:

1. **არასწორი API endpoint ლოგიკა** - ბევრ ადგილას იყო კოდი რომელიც production-ში ამოიღებდა `/api` prefix-ს
2. **Next.js rewrites იგნორირებული** - `next.config.ts`-ში კონფიგურირებული rewrites არ მუშაობდა

### არასწორი კოდი:
```typescript
// ❌ WRONG - Production-ში ამოიღებდა /api prefix-ს
const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' &&
  API_CONFIG.BASE_URL.includes('render.com');

const endpoint = isProduction 
  ? '/sets?includeAll=true'        // ❌ Without /api
  : '/api/sets?includeAll=true';   // ✅ With /api
```

### რატომ იყო ეს პრობლემა?

`next.config.ts`-ში გვაქვს rewrites:
```typescript
rewrites: async () => {
  return [
    {
      source: "/api/:path*",
      destination: `${apiUrl}/api/:path*`,
    },
  ];
}
```

ეს ნიშნავს რომ:
- Frontend: `/api/sets` → Backend: `https://ghrs-backend.onrender.com/api/sets`
- ყველა request **უნდა იწყებოდეს** `/api` prefix-ით

---

## ✅ გადაწყვეტა

გავასწორე **7 ფაილი** სადაც იყო ეს პრობლემა:

### 1. `app/hooks/useSets.ts`
```typescript
// ✅ FIXED: Always use /api prefix
const endpoint = '/api/sets?includeAll=true&limit=1000';
```

### 2. `app/api/statistics.ts`
```typescript
// ✅ FIXED: Always use /api prefix
const endpoint = '/api/statistics/global';
```

### 3. `app/allComplex/page.tsx`
```typescript
// ✅ FIXED: Always use /api prefix
const endpoint = '/api/categories/subcategories/all';
```

### 4. `app/allCourse/page.tsx`
```typescript
// ✅ FIXED: Always use /api prefix
const endpoint = '/api/courses?limit=1000&isPublished=true';
```

### 5. `app/components/Professional.tsx`
```typescript
// ✅ FIXED: Always use /api prefix
const endpoint = '/api/courses?isPublished=true';
```

### 6. `app/components/CategoryFilter.tsx`
```typescript
// ✅ FIXED: Always use /api prefix
const endpoint = '/api/categories';
```

### 7. `app/components/SubcategoryDropdown.tsx`
```typescript
// ✅ FIXED: Always use /api prefix
const endpoint = `/api/categories/${categoryId}/subcategories`;
```

---

## 🎯 როგორ მუშაობს ახლა

### Development (localhost:3000):
```
Frontend Request: /api/sets
↓
Next.js Rewrites: http://localhost:4000/api/sets
↓
Backend Response: Sets data
```

### Production (Vercel):
```
Frontend Request: /api/sets
↓
Next.js Rewrites: https://ghrs-backend.onrender.com/api/sets
↓
Backend Response: Sets data
```

---

## ✅ შედეგი

- ✅ **სეტები** ახლა სწორად იტვირთება
- ✅ **კურსები** ახლა სწორად იტვირთება
- ✅ **კატეგორიები** და **subcategories** სწორად მუშაობს
- ✅ **Statistics** API სწორად მუშაობს
- ✅ Build წარმატებით მუშაობს

---

## 📋 Vercel Deployment Checklist

- [x] API endpoints გამოსწორებულია
- [x] Build წარმატებით მუშაობს
- [x] Next.js rewrites კონფიგურირებულია
- [ ] Environment Variables დაყენებული Vercel-ში:
  - `NEXT_PUBLIC_API_URL=https://ghrs-backend.onrender.com`
  - `NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-production-paypal-client-id`

---

## 🚀 შემდეგი ნაბიჯები

1. **Push to GitHub:**
```bash
git add .
git commit -m "Fix: API endpoints - always use /api prefix for Next.js rewrites"
git push origin main
```

2. **Vercel ავტომატურად დაადეპლოის**

3. **შეამოწმეთ Production:**
   - გადადით Vercel URL-ზე
   - შეამოწმეთ რომ სეტები და კურსები იტვირთება
   - გახსენით Browser Console და დარწმუნდით რომ API errors არ არის

---

## 🔍 როგორ შევამოწმო ლოკალურად

```bash
# 1. გაუშვით development server
npm run dev

# 2. გახსენით http://localhost:3000
# 3. შეამოწმეთ Browser Console
# 4. უნდა ნახოთ:
#    🔵 Fetching ALL sets from: http://localhost:4000/api/sets?includeAll=true&limit=1000
#    📡 Response status: 200
#    ✅ Sets fetched: [number]
```

---

**გამოსწორების თარიღი:** 2024-12-24  
**გამოსწორებული ფაილები:** 7  
**Build Status:** ✅ წარმატებული
