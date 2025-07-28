# Exercise API Endpoints

## საავარჯიშოს დამატების ფლოუ

### 1. ახალი საავარჯიშოს შექმნა
```
POST /exercises
```

**Request Body:**
```json
{
  "name": {
    "ka": "საავარჯიშოს სახელი ქართულად",
    "en": "Exercise name in English", 
    "ru": "Название упражнения на русском"
  },
  "description": {
    "ka": "აღწერა ქართულად",
    "en": "Description in English",
    "ru": "Описание на русском"
  },
  "recommendations": {
    "ka": "რეკომენდაციები ქართულად",
    "en": "Recommendations in English",
    "ru": "Рекомендации на русском"
  },
  "videoUrl": "https://example.com/video.mp4",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "videoDuration": "00:05:30",
  "duration": "00:03:00",
  "difficulty": "medium",
  "repetitions": "10",
  "sets": "3",
  "restTime": "00:01:00",
  "isActive": true,
  "isPublished": false,
  "sortOrder": 1,
  "setId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "categoryId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "subCategoryId": "64f1a2b3c4d5e6f7a8b9c0d3"
}
```

**Response:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
  "name": { ... },
  "description": { ... },
  "recommendations": { ... },
  "videoUrl": "https://example.com/video.mp4",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "videoDuration": "00:05:30",
  "duration": "00:03:00",
  "difficulty": "medium",
  "repetitions": "10",
  "sets": "3",
  "restTime": "00:01:00",
  "isActive": true,
  "isPublished": false,
  "sortOrder": 1,
  "setId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "categoryId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "subCategoryId": "64f1a2b3c4d5e6f7a8b9c0d3",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. საავარჯიშოს განახლება
```
PATCH /exercises/:id
```

**Request Body:** (ნებისმიერი ველი შეიძლება განახლდეს)
```json
{
  "name": {
    "ka": "განახლებული სახელი",
    "en": "Updated name",
    "ru": "Обновленное название"
  },
  "isPublished": true
}
```

### 3. საავარჯიშოს წაშლა
```
DELETE /exercises/:id
```

### 4. საავარჯიშოს მიღება ID-ით
```
GET /exercises/:id
```

### 5. ყველა საავარჯიშოს მიღება (ფილტრებით)
```
GET /exercises?setId=64f1a2b3c4d5e6f7a8b9c0d1&categoryId=64f1a2b3c4d5e6f7a8b9c0d2&subCategoryId=64f1a2b3c4d5e6f7a8b9c0d3
```

### 6. საავარჯიშოების მიღება set-ის მიხედვით
```
GET /exercises/set/:setId
```

### 7. საავარჯიშოების მიღება კატეგორიის მიხედვით
```
GET /exercises/category/:categoryId
```

### 8. საავარჯიშოების მიღება სირთულის მიხედვით
```
GET /exercises/difficulty/:difficulty
```
სადაც `:difficulty` შეიძლება იყოს: `easy`, `medium`, `hard`

## ველების აღწერა

- **name**: საავარჯიშოს სახელი სამ ენაზე
- **description**: საავარჯიშოს აღწერა სამ ენაზე
- **recommendations**: რეკომენდაციები სამ ენაზე
- **videoUrl**: ვიდეოს ლინკი
- **thumbnailUrl**: სურათის ლინკი
- **videoDuration**: ვიდეოს ხანგრძლივობა (HH:MM:SS)
- **duration**: საავარჯიშოს ხანგრძლივობა (HH:MM:SS)
- **difficulty**: სირთულე (easy/medium/hard)
- **repetitions**: გამეორებების რაოდენობა
- **sets**: სეტების რაოდენობა
- **restTime**: დასვენების დრო (HH:MM:SS)
- **isActive**: არის თუ არა აქტიური
- **isPublished**: არის თუ არა გამოქვეყნებული
- **sortOrder**: სორტირების რიგი
- **setId**: set-ის ID
- **categoryId**: კატეგორიის ID
- **subCategoryId**: ქვეკატეგორიის ID (ოფციონალური) 