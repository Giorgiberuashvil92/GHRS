# 🚀 Vercel Deployment ინსტრუქციები

## ✅ გამოსწორებული პრობლემები

### 1. Root Layout გადაკეთდა Server Component-ად
- ✅ დაემატა SEO Metadata
- ✅ Client-side providers გადატანილია `providers.tsx`-ში
- ✅ გამოსწორდა hydration warnings

### 2. API Configuration
- ✅ გამოსწორდა `next.config.ts` rewrites სინტაქსი
- ✅ TypeScript build errors აღარ არის იგნორირებული

### 3. Environment Variables
- ✅ PayPal Client ID აღარ არის ჰარდკოდირებული
- ✅ შექმნილია `.env.production` template

---

## 📋 Vercel-ზე დასადეპლოიებელი ნაბიჯები

### 1️⃣ **Environment Variables კონფიგურაცია**

Vercel Dashboard-ში (`Settings > Environment Variables`) დაამატეთ:

```bash
# Required
NEXT_PUBLIC_API_URL=https://ghrs-backend.onrender.com

# Required - PayPal Production Client ID
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-production-paypal-client-id

# Optional - Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

⚠️ **მნიშვნელოვანი:** 
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - გამოიყენეთ **production** PayPal Client ID
- არასოდეს დაამატოთ საიდუმლო keys კოდში!

---

### 2️⃣ **Build Settings**

Vercel-ის Build & Development Settings:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

---

### 3️⃣ **Root Directory**

თუ პროექტი არის monorepo-ში:
- Root Directory: `./` (ან სადაც არის `package.json`)

---

### 4️⃣ **Node.js Version**

`package.json`-ში დაამატეთ:

```json
{
  "engines": {
    "node": ">=18.17.0"
  }
}
```

---

## 🔍 **რა შეიცვალა კოდში**

### `app/layout.tsx`
```typescript
// Before: "use client" - Client Component
// After: Server Component with Metadata

export const metadata: Metadata = {
  title: "GHRS - Georgian Health & Rehabilitation System",
  description: "...",
  // ... SEO configuration
};
```

### `app/providers.tsx` (ახალი ფაილი)
```typescript
"use client";
// ყველა client-side provider აქ არის
```

### `next.config.ts`
```typescript
// Before: ignoreBuildErrors: true
// After: ignoreBuildErrors: false ✅

// Before: destination: "http://localhost:4000/api/:path*"
// After: destination: `${apiUrl}/api/:path*` ✅
```

---

## 🐛 **საერთო პრობლემები და გადაწყვეტილებები**

### ❌ "Cannot find module" შეცდომა
**მიზეზი:** TypeScript არ ხედავს ახალ ფაილებს  
**გადაწყვეტა:** 
```bash
npm run build
```

### ❌ API Calls ვერ მუშაობს
**მიზეზი:** `NEXT_PUBLIC_API_URL` არ არის დაყენებული  
**გადაწყვეტა:** Vercel Dashboard > Environment Variables > დაამატეთ ცვლადი

### ❌ PayPal არ იტვირთება
**მიზეზი:** `NEXT_PUBLIC_PAYPAL_CLIENT_ID` ცარიელია  
**გადაწყვეტა:** დააყენეთ production PayPal Client ID Vercel-ში

### ❌ Translations არ იტვირთება
**მიზეზი:** `/public/locales/` ფოლდერი არ არის სწორად დეპლოიებული  
**გადაწყვეტა:** დარწმუნდით რომ `public` ფოლდერი არის git-ში

---

## ✅ **Deployment Checklist**

- [ ] Environment Variables დაყენებულია Vercel-ში
- [ ] PayPal Production Client ID კონფიგურირებულია
- [ ] Backend API მუშაობს და ხელმისაწვდომია
- [ ] `npm run build` ლოკალურად წარმატებით მუშაობს
- [ ] TypeScript შეცდომები გამოსწორებულია
- [ ] `/public/locales/` ფოლდერი არსებობს

---

## 🔗 **სასარგებლო ბმულები**

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PayPal Integration](https://developer.paypal.com/docs/checkout/)

---

## 📞 **დახმარება**

თუ პრობლემა გაქვთ:
1. შეამოწმეთ Vercel Build Logs
2. გადაამოწმეთ Environment Variables
3. დარწმუნდით რომ Backend API მუშაობს
4. შეამოწმეთ Browser Console errors

---

**ბოლო განახლება:** 2024-12-24
