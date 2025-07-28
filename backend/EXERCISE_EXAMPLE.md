# Exercise API გამოყენების მაგალითი

## 1. API-ის შემოწმება
```bash
curl http://localhost:3000/exercises/test
```

## 2. ახალი საავარჯიშოს დამატება

```bash
curl -X POST http://localhost:3000/exercises \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "ka": "პუშ-აპები",
      "en": "Push-ups",
      "ru": "Отжимания"
    },
    "description": {
      "ka": "პუშ-აპები არის ეფექტური საავარჯიშო ზედა სხეულისთვის",
      "en": "Push-ups are an effective exercise for upper body",
      "ru": "Отжимания - эффективное упражнение для верхней части тела"
    },
    "recommendations": {
      "ka": "გააკეთეთ 3 სეტი 10-15 გამეორებით",
      "en": "Do 3 sets of 10-15 repetitions",
      "ru": "Выполните 3 подхода по 10-15 повторений"
    },
    "videoUrl": "https://example.com/videos/pushups.mp4",
    "thumbnailUrl": "https://example.com/images/pushups.jpg",
    "videoDuration": "00:02:30",
    "duration": "00:01:30",
    "difficulty": "medium",
    "repetitions": "12",
    "sets": "3",
    "restTime": "00:01:00",
    "isActive": true,
    "isPublished": false,
    "sortOrder": 1,
    "setId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "categoryId": "64f1a2b3c4d5e6f7a8b9c0d2"
  }'
```

## 3. საავარჯიშოს განახლება

```bash
curl -X PATCH http://localhost:3000/exercises/EXERCISE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "isPublished": true,
    "sortOrder": 2
  }'
```

## 4. საავარჯიშოების მიღება set-ის მიხედვით

```bash
curl http://localhost:3000/exercises/set/64f1a2b3c4d5e6f7a8b9c0d1
```

## 5. საავარჯიშოების მიღება სირთულის მიხედვით

```bash
curl http://localhost:3000/exercises/difficulty/easy
```

## 6. საავარჯიშოს წაშლა

```bash
curl -X DELETE http://localhost:3000/exercises/EXERCISE_ID
```

## JavaScript/TypeScript მაგალითი

```javascript
// ახალი საავარჯიშოს დამატება
const createExercise = async (exerciseData) => {
  const response = await fetch('http://localhost:3000/exercises', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exerciseData)
  });
  
  return response.json();
};

// მაგალითი მონაცემები
const exerciseData = {
  name: {
    ka: "პუშ-აპები",
    en: "Push-ups", 
    ru: "Отжимания"
  },
  description: {
    ka: "პუშ-აპები არის ეფექტური საავარჯიშო",
    en: "Push-ups are an effective exercise",
    ru: "Отжимания - эффективное упражнение"
  },
  recommendations: {
    ka: "გააკეთეთ 3 სეტი 10-15 გამეორებით",
    en: "Do 3 sets of 10-15 repetitions",
    ru: "Выполните 3 подхода по 10-15 повторений"
  },
  videoUrl: "https://example.com/videos/pushups.mp4",
  thumbnailUrl: "https://example.com/images/pushups.jpg",
  videoDuration: "00:02:30",
  duration: "00:01:30",
  difficulty: "medium",
  repetitions: "12",
  sets: "3",
  restTime: "00:01:00",
  isActive: true,
  isPublished: false,
  sortOrder: 1,
  setId: "64f1a2b3c4d5e6f7a8b9c0d1",
  categoryId: "64f1a2b3c4d5e6f7a8b9c0d2"
};

// API-ის გამოყენება
createExercise(exerciseData)
  .then(result => console.log('Exercise created:', result))
  .catch(error => console.error('Error:', error));
```

## მნიშვნელოვანი შენიშვნები

1. **setId** და **categoryId** უნდა იყოს ვალიდური MongoDB ObjectId-ები
2. **difficulty** შეიძლება იყოს მხოლოდ: `easy`, `medium`, `hard`
3. **videoUrl** და **thumbnailUrl** უნდა იყოს ვალიდური URL-ები
4. **videoDuration**, **duration**, **restTime** უნდა იყოს HH:MM:SS ფორმატში
5. **repetitions**, **sets** და **sortOrder** შეიძლება იყოს string ან number 