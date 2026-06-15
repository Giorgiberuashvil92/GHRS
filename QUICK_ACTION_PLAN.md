# GHRS - Quick Action Plan
## რაუნდა დაიწყოთ მუშაობა (Let's Get Started)

---

## 🔴 დაუყოვნებლივი მოქმედებები (Immediate Actions) - Week 1

### Day 1-2: Critical Bug Fixes

#### 1. Logo-ს ბმულის გასწორება (Fix Logo Link)
**File:** `app/components/Navbar/DesktopNavbar.tsx` (line 120)
**Problem:** Logo არ მუშაობს როგორც Home ღილაკი
**Solution:**
```tsx
<Link 
  href="/" 
  className="hover:brightness-0 duration-700 shrink-0 z-50"
  aria-label="Navigate to homepage"
>
  <SimpleLogo />
</Link>
```

#### 2. ნავიგაციის რესტრუქტურიზაცია (Navigation Restructure)
**File:** `app/components/Header/Header.tsx` (lines 45-50)
**Changes:**
- ✓ Remove "Home" button from far right
- ✓ Add "All Instructors" as 3rd menu item
- ✓ Reorder logically

**New Menu Structure:**
1. All Complexes → `/allComplex`
2. Courses → `/allCourse`
3. **All Instructors** → `/teachers` (NEW)
4. Blog → `/blog`
5. About → `/about`
6. Contacts → `/contact`

#### 3. Sticky Header
**File:** `app/components/Navbar/DesktopNavbar.tsx` (line 114)
**Change:**
```tsx
// OLD:
<header className="fixed font-bowler top-0 left-0 right-0 z-50 my-4 ...">

// NEW:
<header className="sticky font-bowler top-0 left-0 right-0 z-50 ...">
```

---

### Day 3-4: Teachers Page Bug

#### 4. "0 Courses" Counter Bug Fix
**Files:**
- `backend/src/instructor/instructor.service.ts`
- `app/teachers/page.tsx`

**Backend Fix:**
```typescript
async findAll() {
  return this.instructorModel.aggregate([
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: 'instructorId',
        as: 'courses'
      }
    },
    {
      $addFields: {
        coursesCount: { $size: '$courses' }
      }
    },
    {
      $project: { courses: 0 }
    }
  ]);
}
```

---

### Day 5-7: Teacher Filtering System

#### 5. Implement Filter System on Teachers Page
**Create New File:** `app/components/InstructorFilter.tsx`
**Reference:** `app/components/CategoryFilter.tsx` (use as template)

**Features Needed:**
- ✓ Filter by category
- ✓ Sort by: Most Popular, Most Courses, Alphabetical, Highest Rated
- ✓ Display count per category
- ✓ Same UI/UX as course filters

**Backend Endpoint:**
```typescript
// backend/src/instructor/instructor.controller.ts
@Get('by-category/:categoryId')
async getInstructorsByCategory(
  @Param('categoryId') categoryId: string,
  @Query('sort') sort?: string,
) {
  // Implementation
}
```

---

## 🟡 მაღალი პრიორიტეტი (High Priority) - Week 2

### 6. "FEATURED" → "Featured Courses"
**Simple text change across all locales:**
```json
// public/locales/en/common.json
"sections": {
  "featured_courses": "Featured Courses"
}

// public/locales/ru/common.json
"sections": {
  "featured_courses": "Избранные курсы"
}

// public/locales/ka/common.json
"sections": {
  "featured_courses": "რჩეული კურსები"
}
```

### 7. Course Card Hover Effects
**Add to course card components:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  whileHover={{ 
    scale: 1.02, 
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)" 
  }}
  transition={{ duration: 0.3 }}
>
  {/* Course card content */}
</motion.div>
```

### 8. Social Authentication
**Install packages:**
```bash
npm install @react-oauth/google react-apple-signin-auth
```

**Create:** `app/components/SocialAuth.tsx`
**Backend:** Add Google & Apple OAuth strategies

---

## 🟢 საშუალო პრიორიტეტი (Medium Priority) - Week 3

### 9. PayPal Optimization
**Tasks:**
- [ ] Contact PayPal representative
- [ ] Run end-to-end tests
- [ ] Optimize mobile payment flow
- [ ] Add better error messages
- [ ] Test all currencies (USD, EUR, GEL)

**File to optimize:** `app/components/PayPalButton.tsx`

---

## 📱 Mobile App Development - Weeks 4-12

### Technology Choice: React Native (Expo)

**Setup:**
```bash
npx create-expo-app@latest ghrs-mobile
cd ghrs-mobile
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-video
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### Core Features Timeline:

**Weeks 4-5: Foundation**
- ✓ Navigation structure
- ✓ Authentication (including biometrics)
- ✓ API integration

**Weeks 6-7: Course Features**
- ✓ Course listing & details
- ✓ Video player with speed control
- ✓ Offline download capability

**Weeks 8-9: Advanced Features**
- ✓ Push notifications
- ✓ PayPal integration
- ✓ Gesture controls

**Weeks 10-11: Testing**
- ✓ Bug fixes
- ✓ Performance optimization
- ✓ User testing

**Week 12: Launch**
- ✓ App Store submission
- ✓ Play Store submission

---

## 📋 Checklist for Week 1 (Start NOW)

### დღე 1 (Day 1)
- [ ] Fix logo link in DesktopNavbar.tsx
- [ ] Test logo click from all pages
- [ ] Commit: "fix: logo now navigates to homepage from all pages"

### დღე 2 (Day 2)
- [ ] Restructure navigation menu
- [ ] Add translations for new menu items
- [ ] Update mobile navbar too
- [ ] Test navigation on desktop & mobile
- [ ] Commit: "feat: restructure navigation menu with All Instructors"

### დღე 3 (Day 3)
- [ ] Implement sticky header
- [ ] Test scroll behavior on all pages
- [ ] Adjust z-index if needed
- [ ] Commit: "feat: implement sticky header"

### დღე 4 (Day 4)
- [ ] Debug coursesCount backend aggregation
- [ ] Add console logs to track data flow
- [ ] Test with multiple instructors
- [ ] Verify data appears correctly
- [ ] Commit: "fix: instructor course counter now shows correct values"

### დღე 5 (Day 5)
- [ ] Create InstructorFilter.tsx component
- [ ] Copy structure from CategoryFilter.tsx
- [ ] Adapt for instructors

### დღე 6 (Day 6)
- [ ] Create backend endpoint for instructor filtering
- [ ] Test endpoint in Postman/Insomnia
- [ ] Integrate frontend with backend

### დღე 7 (Day 7)
- [ ] Complete integration testing
- [ ] Test all filter combinations
- [ ] Test all sort options
- [ ] Deploy to staging
- [ ] Request Anry's review

---

## 🎯 Success Criteria

### Week 1 Goals:
- ✅ Logo works as Home button
- ✅ Navigation menu restructured
- ✅ Sticky header implemented
- ✅ Course counter shows correct numbers
- ✅ Instructor filtering fully functional

### Week 2 Goals:
- ✅ Section titles updated
- ✅ Hover effects on course cards
- ✅ Social login (Google & Apple) working

### Week 3 Goals:
- ✅ PayPal representative contacted
- ✅ Payment flow fully tested and optimized
- ✅ All payments processing smoothly

---

## 🔧 Commands to Get Started

```bash
# 1. Pull latest code
git pull origin main

# 2. Create new branch for fixes
git checkout -b fix/website-critical-issues

# 3. Start development servers
# Terminal 1 - Frontend:
npm run dev

# Terminal 2 - Backend:
cd backend
npm run start:dev

# 4. Make changes and test

# 5. Commit changes
git add .
git commit -m "fix: implement critical website fixes"

# 6. Push and create PR
git push origin fix/website-critical-issues
```

---

## 📞 Need Help?

### Technical Questions:
- Check `DEVELOPMENT_ROADMAP.md` for detailed implementation guides
- Review reference implementations in existing code
- Use console logs to debug data flow

### Business Questions:
- Escalate to project manager
- Contact Anry for clarification

### PayPal Issues:
- Developer Portal: https://developer.paypal.com
- Current implementation: `app/components/PayPalButton.tsx`

---

## 📊 Progress Tracking

Create these GitHub issues immediately:

1. **[P0] Fix broken logo link** (#001)
2. **[P0] Restructure navigation menu** (#002)
3. **[P0] Implement sticky header** (#003)
4. **[P0] Fix instructor course counter bug** (#004)
5. **[P0] Implement instructor filtering system** (#005)
6. **[P1] Update section title to "Featured Courses"** (#006)
7. **[P1] Add course card hover effects** (#007)
8. **[P1] Implement social authentication** (#008)
9. **[P2] Optimize PayPal integration** (#009)
10. **[P2] Mobile app development** (#010)

---

## ✅ Definition of Done

For each task to be considered "done":
- [ ] Code implemented and tested locally
- [ ] No console errors or warnings
- [ ] Works on Chrome, Safari, Firefox
- [ ] Responsive on mobile, tablet, desktop
- [ ] Translations added for all 3 languages (EN, RU, KA)
- [ ] Code reviewed by at least one team member
- [ ] Merged to main branch
- [ ] Deployed to staging environment
- [ ] Tested on staging by QA or stakeholder
- [ ] Approved for production

---

## 🚀 Let's Go!

**Priority Order:**
1. Fix logo (2 hours)
2. Fix navigation (2 hours)
3. Fix sticky header (3 hours)
4. Fix course counter (4 hours)
5. Build instructor filter (16 hours)

**Total Week 1 Effort: ~27 hours**

Start with **logo fix** - it's the quickest win and most visible issue!

---

**გაიხარე და დაიწყე მუშაობა! 💪**  
**Good luck and start working! 💪**

