# API Configuration Setup

## Environment Variables

პროექტში გამოიყენება environment variables API URL-ის კონფიგურაციისთვის.

### Production (Render)

```bash
NEXT_PUBLIC_API_URL=https://grs-bkbc.onrender.com
```

### Development (Local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Setup Instructions

### 1. Environment File Creation

შექმენი `.env.local` ფაილი პროექტის root დირექტორიაში:

```bash
# Production API URL
NEXT_PUBLIC_API_URL=https://grs-bkbc.onrender.com

# Development API URL (uncomment for local development)
# NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 2. Backend URLs

**Production Backend:**

- Base URL: `https://grs-bkbc.onrender.com`
- API Base: `https://grs-bkbc.onrender.com/api`

**Local Backend:**

- Base URL: `http://localhost:4000`
- API Base: `http://localhost:4000/api`

### 3. Available Endpoints

#### Categories

- `GET /api/categories` - ყველა კატეგორია
- `GET /api/categories/main-only` - მხოლოდ მთავარი კატეგორიები
- `GET /api/categories/with-subcategories` - კატეგორიები სუბკატეგორიებით
- `GET /api/categories/hierarchy` - სრული იერარქია
- `GET /api/categories/:id` - კონკრეტული კატეგორია
- `GET /api/categories/:id/subcategories` - კატეგორიის სუბკატეგორიები

#### Courses

- `GET /api/courses` - ყველა კურსი
- `GET /api/courses?categoryId=:id` - კატეგორიის კურსები

#### Exercises & Complexes

- `GET /api/exercises` - ყველა სავარჯიშო
- `GET /api/exercise-complexes` - ყველა კომპლექსი
- `GET /api/categories/:id/exercises-and-complexes` - კატეგორიის სავარჯიშოები და კომპლექსები

#### Other

- `GET /api/articles` - სტატიები
- `GET /api/videos` - ვიდეოები
- `GET /api/users` - მომხმარებლები
- `GET /api/sets` - ნაკრები

### 4. Testing API

შეგიძლიათ შეამოწმოთ API მუშაობა:

```bash
# Test endpoint
curl https://grs-bkbc.onrender.com/api/test

# Categories
curl https://grs-bkbc.onrender.com/api/categories

# Courses
curl https://grs-bkbc.onrender.com/api/courses
```

### 5. Frontend Integration

ყველა API გამოძახება ხდება `app/config/api.ts` ფაილის მეშვეობით, რომელიც ავტომატურად იყენებს environment variable-ს.

```typescript
import { apiRequest, API_CONFIG } from "../config/api";

// მაგალითი გამოყენების
const categories = await apiRequest("/api/categories");
```

### 6. Switching Between Environments

**Development-ზე გადასასვლელად:**

1. შეცვალე `.env.local` ფაილში `NEXT_PUBLIC_API_URL`
2. გაუშვი `npm run dev`

**Production-ზე გადასასვლელად:**

1. შეცვალე `.env.local` ფაილში `NEXT_PUBLIC_API_URL`
2. გაუშვი `npm run build && npm start`
