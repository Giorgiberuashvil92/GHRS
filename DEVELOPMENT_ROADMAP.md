# GHRS Platform - Development Roadmap & Bug Analysis
## Comprehensive Review Analysis from Anry's Feedback (June 15, 2026)

---

## Executive Summary

This document provides a structured analysis of the website review feedback and outlines a comprehensive development roadmap for immediate fixes, UX improvements, and mobile application requirements for the GHRS (Georgian Health Rehabilitation System) platform.

**Project Stack:**
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** NestJS, MongoDB
- **Payment:** PayPal (@paypal/react-paypal-js v8.8.3)
- **Internationalization:** next-i18next (EN, RU, KA)

---

## PART 1: IMMEDIATE WEBSITE FIXES & UX UPDATES

### 🔴 CRITICAL PRIORITY (P0) - Must Fix Immediately

#### 1.1 Broken Logo Link (CRITICAL BUG)
**Status:** ❌ BROKEN  
**Current Behavior:** Logo click does not navigate to homepage  
**Expected Behavior:** Logo should act as universal "Home" button from all pages  

**Technical Details:**
- **File:** `app/components/Navbar/DesktopNavbar.tsx` (Line 120)
- **Current Implementation:**
```tsx
<Link href="/" className="hover:brightness-0 duration-700 shrink-0">
  <SimpleLogo />
</Link>
```
- **Issue:** The Link component appears correct but may have z-index or event handling conflicts
- **Action Required:**
  1. Check for overlaying elements blocking click events
  2. Verify SimpleLogo component doesn't prevent click propagation
  3. Add data-testid for testing
  4. Test across all page variants (blog, professional, allCourse, teachers, etc.)

**Estimated Fix Time:** 1-2 hours  
**Testing Required:** Cross-browser testing on all major pages

---

#### 1.2 Navigation Menu Restructuring
**Status:** ⚠️ REQUIRES REDESIGN  
**Current Issues:**
1. "Home" button is at far right of second row (counterintuitive)
2. Missing "All Instructors" as third button
3. Menu order is not logical

**Current Implementation:**
- **File:** `app/components/Header/Header.tsx` (Lines 45-50)
```tsx
export const getDefaultMenuItems = (t: (key: string) => string): MenuItem[] => [
  { id: 1, name: t("navigation.all_complexes"), route: "/allComplex" },
  { id: 2, name: t("navigation.about"), route: "/about" },
  { id: 3, name: t("navigation.blog"), route: "/blog" },
  { id: 4, name: t("navigation.contacts"), route: "/contact" },
];
```

**Proposed Changes:**
```tsx
export const getDefaultMenuItems = (t: (key: string) => string): MenuItem[] => [
  { id: 1, name: t("navigation.all_complexes"), route: "/allComplex" },
  { id: 2, name: t("navigation.courses"), route: "/allCourse" },
  { id: 3, name: t("navigation.all_instructors"), route: "/teachers" },
  { id: 4, name: t("navigation.blog"), route: "/blog" },
  { id: 5, name: t("navigation.about"), route: "/about" },
  { id: 6, name: t("navigation.contacts"), route: "/contact" },
];
```

**Required Actions:**
1. Remove standalone "Home" button (logo serves this purpose)
2. Add "All Instructors" menu item
3. Reorder menu items logically
4. Update translations in all locales (EN, RU, KA)
5. Adjust desktop navbar width if needed

**Localization Files to Update:**
- `public/locales/en/common.json`
- `public/locales/ru/common.json`
- `public/locales/ka/common.json`

**Estimated Time:** 2-3 hours

---

#### 1.3 Sticky Header Implementation
**Status:** ❌ NOT IMPLEMENTED  
**Current Behavior:** Header is fixed but doesn't maintain visibility during scroll  
**Required Behavior:** Header must remain fixed at top when scrolling

**Current Implementation:**
- **File:** `app/components/Navbar/DesktopNavbar.tsx` (Line 114)
```tsx
<header className="fixed font-bowler top-0 left-0 right-0 z-50 my-4 w-full md:flex hidden justify-between px-10 py-5">
```

**Issues:**
- Header has `my-4` margin which creates gap at top
- No scroll behavior optimization
- May have performance issues on long pages

**Proposed Solution:**
```tsx
<header className="sticky top-0 left-0 right-0 z-50 w-full md:flex hidden justify-between px-10 py-3 bg-transparent backdrop-blur-md transition-all duration-300">
```

**Additional Enhancements:**
- Add scroll-based opacity/background changes
- Reduce header height on scroll for more screen real estate
- Add smooth transitions
- Ensure mobile navbar also has sticky behavior

**Estimated Time:** 3-4 hours (including responsive testing)

---

### 🟡 HIGH PRIORITY (P1) - Fix Within 48 Hours

#### 2.1 Section Title: "FEATURED" → "Featured Courses"
**Status:** ⚠️ INCOMPLETE LABEL  
**Location:** Homepage featured section

**Required Changes:**
1. Locate the "FEATURED" heading component
2. Update to "Featured Courses"
3. Ensure proper localization across all languages

**Translation Keys Required:**
```json
{
  "sections": {
    "featured_courses": {
      "en": "Featured Courses",
      "ru": "Избранные курсы",
      "ka": "რჩეული კურსები"
    }
  }
}
```

**Estimated Time:** 1 hour

---

#### 2.2 Course Card Hover Effects
**Status:** ⚠️ NEEDS ENHANCEMENT  
**Current State:** Basic hover transitions exist but no preview functionality

**Required Features:**
1. Smooth scale/shadow transitions on hover
2. Quick preview overlay with key course info:
   - Instructor name
   - Duration
   - Difficulty level
   - First lesson title
   - Rating (if available)

**Technical Implementation:**
- Use Framer Motion for smooth animations (already in dependencies)
- Create `CourseCardPreview` component
- Add hover state management
- Implement lazy loading for preview content

**Example Implementation:**
```tsx
<motion.div
  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}
  transition={{ duration: 0.3 }}
  className="course-card"
>
  {/* Card content */}
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileHover={{ opacity: 1, y: 0 }}
    className="preview-overlay"
  >
    {/* Preview content */}
  </motion.div>
</motion.div>
```

**Estimated Time:** 6-8 hours

---

### 🔴 CRITICAL BUG (P0) - Teachers Directory Issues

#### 3.1 Missing Filter System on Teachers Page
**Status:** ❌ NOT IMPLEMENTED  
**Current State:** Teachers page has no filtering functionality  
**Required State:** Implement the same filter system as courses page

**Current Teachers Page:**
- **File:** `app/teachers/page.tsx`
- **Lines 145-195:** Simple grid layout with no filters

**Reference Implementation:**
- **File:** `app/components/CategoryFilter.tsx` (Complete filter system)

**Required Implementation:**

1. **Create InstructorFilter Component** (similar to CategoryFilter):
```tsx
interface InstructorFilterProps {
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange?: (sortBy: string) => void;
  instructorCountByCategory?: Record<string, number>;
}
```

2. **Backend Support Required:**
   - Create endpoint: `GET /api/instructors/categories`
   - Create endpoint: `GET /api/instructors?category=X&sort=Y`
   - Update instructor schema to include category references

3. **Filter Categories for Instructors:**
   - Medical Specializations
   - Years of Experience
   - Language
   - Course Count
   - Rating

4. **Sort Options:**
   - Most Popular (by course enrollment)
   - Most Courses
   - Alphabetical (A-Z, Z-A)
   - Highest Rated
   - Newest First

**File Structure:**
```
app/
  components/
    InstructorFilter.tsx (NEW)
  teachers/
    page.tsx (UPDATE)
backend/
  src/
    instructor/
      instructor.controller.ts (UPDATE)
      instructor.service.ts (UPDATE)
      dto/
        filter-instructor.dto.ts (NEW)
```

**Estimated Time:** 12-16 hours

---

#### 3.2 Data Counter Bug: "0 Courses" Display
**Status:** 🐛 CRITICAL DATA MAPPING BUG  
**Symptom:** Individual instructor profile shows "3 courses" but directory card shows "0 courses"

**Current Implementation:**
- **File:** `app/teachers/page.tsx` (Lines 62-66)
```tsx
const metaParts: string[] = [];
if (instructor.coursesCount !== undefined) {
  metaParts.push(`${instructor.coursesCount} ${t("teachers.courses")}`);
}
const metaLine = metaParts.join(" · ");
```

**Root Cause Analysis:**

1. **Potential Issue #1:** `coursesCount` not populated from backend
   - Check `backend/src/instructor/instructor.service.ts`
   - Verify MongoDB aggregation pipeline

2. **Potential Issue #2:** Missing data in API response
   - Verify `GET /api/instructors` includes `coursesCount`
   - Check if individual endpoint has different data structure

3. **Potential Issue #3:** Frontend data transformation error
   - Check `app/hooks/useInstructor.ts` 
   - Verify type definitions in `types/instructor.ts`

**Required Backend Fix:**
```typescript
// backend/src/instructor/instructor.service.ts
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
      $project: {
        courses: 0  // Remove full course array, keep only count
      }
    }
  ]);
}
```

**Frontend Verification:**
```typescript
// Ensure proper type definition
interface Instructor {
  id: string;
  name: string;
  coursesCount: number;  // Must be required, not optional
  // ... other fields
}
```

**Testing Required:**
1. Verify data consistency across all instructors
2. Check performance with large datasets
3. Ensure real-time updates when courses are added/removed

**Estimated Time:** 4-6 hours

---

### 🟢 MEDIUM PRIORITY (P2) - Complete Within 1 Week

#### 4.1 Seamless Registration & Social Authentication
**Status:** ⚠️ ENHANCEMENT REQUIRED  
**Current State:** Traditional email/password registration  
**Required State:** One-click social authentication

**Current Registration:**
- **File:** `app/auth/register/`
- Standard email/password flow with verification steps

**Required Features:**

1. **Google Sign-In Integration**
   - Install: `npm install @react-oauth/google`
   - Setup OAuth 2.0 credentials in Google Cloud Console
   - Implement button component
   - Backend JWT token generation

2. **Apple Sign-In Integration**
   - Install: `npm install react-apple-signin-auth`
   - Setup Apple Developer Account
   - Configure Sign in with Apple service
   - Handle Apple's unique identifier format

**Implementation Steps:**

**Frontend:**
```tsx
// app/components/SocialAuth.tsx
import { GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

export const SocialAuth = () => {
  return (
    <div className="social-auth-container">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="filled_blue"
        text="signin_with"
      />
      
      <AppleSignin
        authOptions={{
          clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
          scope: 'email name',
          redirectURI: `${process.env.NEXT_PUBLIC_URL}/auth/apple/callback`,
          usePopup: true,
        }}
        onSuccess={handleAppleSuccess}
        onError={handleAppleError}
      />
    </div>
  );
};
```

**Backend Endpoints Required:**
```typescript
// backend/src/auth/auth.controller.ts
@Post('google')
async googleAuth(@Body() googleToken: string) {
  // Verify Google token
  // Create or find user
  // Generate JWT
  // Return user + token
}

@Post('apple')
async appleAuth(@Body() appleData: AppleAuthDto) {
  // Verify Apple token
  // Create or find user
  // Generate JWT
  // Return user + token
}
```

**Security Considerations:**
- Validate OAuth tokens server-side
- Implement rate limiting
- Store minimal user data from social providers
- GDPR compliance for data handling

**Estimated Time:** 16-20 hours

---

#### 4.2 PayPal Integration Optimization
**Status:** ⚠️ NEEDS VERIFICATION & OPTIMIZATION  
**Current State:** PayPal integration exists but needs end-to-end testing

**Current Implementation:**
- **File:** `app/components/PayPalButton.tsx` (Complete implementation exists)
- **Payment Flow:** Create Order → User Approves → Capture Payment

**Required Actions:**

1. **Direct PayPal Representative Contact**
   - Schedule call with PayPal technical support
   - Verify Sandbox vs Production configuration
   - Review webhook setup for payment confirmations
   - Discuss rate limits and best practices

2. **End-to-End Testing Checklist:**
   ```
   ✓ Test Payment Flow:
     - Single course purchase
     - Multiple courses in cart
     - Subscription payment
     - Different currencies (USD, EUR, GEL)
   
   ✓ Error Scenarios:
     - Payment declined
     - Insufficient funds
     - Token expiration
     - Network failures
   
   ✓ Edge Cases:
     - User cancels mid-payment
     - Browser refresh during payment
     - Multiple simultaneous payments
     - Currency conversion accuracy
   ```

3. **Optimization Improvements:**

**A. Loading States:**
```tsx
const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

{paymentStatus === 'processing' && (
  <LoadingSpinner message="Processing your payment..." />
)}
```

**B. Error Handling Enhancement:**
```typescript
const handlePaymentError = (error: PayPalError) => {
  // Log to error monitoring service (e.g., Sentry)
  console.error('PayPal Error:', error);
  
  // User-friendly error messages
  const errorMessages = {
    'INSUFFICIENT_FUNDS': t('payment.error.insufficient_funds'),
    'CARD_DECLINED': t('payment.error.card_declined'),
    'TIMEOUT': t('payment.error.timeout'),
    'DEFAULT': t('payment.error.generic')
  };
  
  showToast(errorMessages[error.code] || errorMessages.DEFAULT);
};
```

**C. Mobile Optimization:**
```tsx
<PayPalButtons
  style={{
    layout: "vertical",
    color: "gold",
    shape: "rect",
    label: "paypal",
    height: 55,  // Larger touch target for mobile
    tagline: false  // Remove tagline on mobile
  }}
  // ... other props
/>
```

4. **Configuration Verification:**

Check `.env` files:
```env
# .env.production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_client_id
PAYPAL_CLIENT_SECRET=your_production_secret
PAYPAL_MODE=live

# .env.development
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_secret
PAYPAL_MODE=sandbox
```

5. **Backend Payment Verification:**
```typescript
// backend/src/payment/payment.service.ts
async verifyPayPalPayment(orderId: string) {
  // Call PayPal API to verify order status
  // Prevent duplicate charges
  // Confirm amount matches expected
  // Update database with transaction record
  // Send confirmation email to user
}
```

**Estimated Time:** 20-24 hours (including PayPal coordination)

---

## PART 2: MOBILE APPLICATION REQUIREMENTS

### 📱 Mobile Development Roadmap

#### 5.1 Technology Stack Recommendations

**Option A: React Native (Recommended)**
- Pros: Code sharing with web, single team, faster development
- Cons: Some platform-specific code needed

**Option B: Native Development (iOS Swift + Android Kotlin)**
- Pros: Best performance, full platform features
- Cons: Separate codebases, longer development time

**Recommendation:** Start with React Native for MVP, evaluate native later

**Initial Setup:**
```bash
npx create-expo-app@latest ghrs-mobile
cd ghrs-mobile
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-gesture-handler react-native-reanimated
npm install @react-native-async-storage/async-storage
npm install react-native-video
npm install @react-native-community/netinfo
```

---

#### 5.2 Core Mobile Features

**A. Full Ecosystem Consistency**
- Shared design system with web (colors, typography, spacing)
- Identical branding and visual identity
- Synchronized user data across platforms
- Same course content and structure

**Implementation:**
```typescript
// mobile/src/theme/index.ts
export const theme = {
  colors: {
    primary: '#3D334A',
    secondary: '#D4BAFC',
    background: '#F9F7FE',
    // ... match web theme exactly
  },
  fonts: {
    bowler: 'Bowler',  // Same as web
    pt: 'PT Sans',     // Same as web
  }
};
```

---

**B. Thumb-Friendly Navigation**

**Bottom Navigation Bar (Primary):**
```tsx
<Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      height: 70,
      paddingBottom: 10,
    },
    tabBarActiveTintColor: '#3D334A',
    tabBarInactiveTintColor: '#846FA0',
  }}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Courses" component={CoursesScreen} />
  <Tab.Screen name="Teachers" component={TeachersScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

**Hamburger Menu (Secondary):**
- Account Settings
- Notifications
- Help & Support
- Legal Documents
- Logout

---

**C. Biometric Authentication**

**iOS Face ID Implementation:**
```typescript
import * as LocalAuthentication from 'expo-local-authentication';

const authenticateWithBiometrics = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login to GHRS',
      fallbackLabel: 'Use Passcode',
    });
    
    if (result.success) {
      // Retrieve stored credentials and auto-login
      await autoLogin();
    }
  }
};
```

**Android Touch ID Implementation:**
Similar using `react-native-fingerprint-scanner` or `expo-local-authentication`

---

**D. Fluid Gesture Support**

**Swipe Gestures:**
```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const CourseNavigator = () => {
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Handle swipe between courses/lessons
    })
    .onEnd((e) => {
      if (e.translationX > 100) {
        // Navigate to previous lesson
      } else if (e.translationX < -100) {
        // Navigate to next lesson
      }
    });
  
  return (
    <GestureDetector gesture={panGesture}>
      <CourseContent />
    </GestureDetector>
  );
};
```

**Pull-to-Refresh:**
```tsx
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#3D334A"
    />
  }
>
  {content}
</ScrollView>
```

---

**E. Advanced Mobile Video Player**

**Features Required:**
1. Playback Speed Control (0.5x - 2x)
2. Background Audio Playback
3. Offline Caching
4. Picture-in-Picture (PiP)
5. Subtitle Support
6. Quality Selection (Auto, 720p, 1080p)

**Implementation:**
```tsx
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

const VideoPlayer = ({ lesson }) => {
  const [speed, setSpeed] = useState(1.0);
  const [offlineAvailable, setOfflineAvailable] = useState(false);
  
  const downloadForOffline = async () => {
    const downloadDest = `${RNFS.DocumentDirectoryPath}/lesson_${lesson.id}.mp4`;
    
    const download = RNFS.downloadFile({
      fromUrl: lesson.videoUrl,
      toFile: downloadDest,
      background: true,
      progressDivider: 10,
      begin: (res) => {
        console.log('Download started:', res);
      },
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        updateDownloadProgress(progress);
      }
    });
    
    await download.promise;
    setOfflineAvailable(true);
  };
  
  return (
    <View>
      <Video
        source={{ uri: offlineAvailable ? localUri : lesson.videoUrl }}
        rate={speed}
        playInBackground={true}
        playWhenInactive={true}
        pictureInPicture={true}
        // ... other props
      />
      
      <SpeedControl 
        value={speed} 
        onChange={setSpeed}
        options={[0.5, 0.75, 1.0, 1.25, 1.5, 2.0]}
      />
      
      <OfflineDownloadButton 
        onPress={downloadForOffline}
        available={offlineAvailable}
      />
    </View>
  );
};
```

**Offline Storage Management:**
```typescript
// mobile/src/services/offline.service.ts
export class OfflineService {
  async cacheLesson(lessonId: string, videoUrl: string) {
    // Download video
    // Store metadata
    // Update local database
  }
  
  async getCachedLessons() {
    // Retrieve list of downloaded lessons
  }
  
  async clearCache(lessonId?: string) {
    // Remove specific lesson or all cache
  }
  
  async getStorageUsage() {
    // Calculate total storage used
    // Show to user in settings
  }
}
```

---

**F. One-Click Mobile Payments**

**PayPal Mobile SDK:**
```bash
npm install react-native-paypal
```

**Implementation:**
```tsx
import PayPal from 'react-native-paypal';

const MobileCheckout = ({ course }) => {
  const handlePayment = async () => {
    try {
      const result = await PayPal.paymentRequest({
        clientId: PAYPAL_CLIENT_ID,
        environment: __DEV__ ? 'sandbox' : 'production',
        intent: 'sale',
        price: course.price,
        currency: 'USD',
        description: course.title,
      });
      
      if (result.status === 'COMPLETED') {
        await processPurchase(result.id);
        navigation.navigate('Course', { id: course.id });
      }
    } catch (error) {
      showErrorToast('Payment failed');
    }
  };
  
  return (
    <TouchableOpacity onPress={handlePayment}>
      <Text>Pay with PayPal</Text>
    </TouchableOpacity>
  );
};
```

**Apple Pay Integration (iOS):**
```typescript
import { PaymentRequest } from 'react-native-payments';

const applePay = new PaymentRequest(methodData, details);
const paymentResponse = await applePay.show();
```

**Google Pay Integration (Android):**
```typescript
import { GooglePay } from '@google-pay/button-react';
// Similar implementation
```

---

**G. Smart Push Notifications**

**Setup Firebase Cloud Messaging:**
```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

**Implementation:**
```typescript
import messaging from '@react-native-firebase/messaging';

// Request permission (iOS)
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  if (enabled) {
    getFCMToken();
  }
};

// Get FCM token
const getFCMToken = async () => {
  const token = await messaging().getToken();
  // Send token to backend
  await api.updateDeviceToken(token);
};

// Handle foreground notifications
messaging().onMessage(async remoteMessage => {
  showLocalNotification(remoteMessage);
});

// Handle background notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
});
```

**Notification Types:**
```typescript
enum NotificationType {
  NEW_COURSE = 'new_course',
  COURSE_REMINDER = 'course_reminder',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  INSTRUCTOR_MESSAGE = 'instructor_message',
  PROMOTION = 'promotion',
  COMMUNITY_UPDATE = 'community_update',
}

interface NotificationConfig {
  title: string;
  body: string;
  data?: any;
  priority: 'high' | 'normal';
  sound?: string;
  badge?: number;
}
```

**Backend Notification Service:**
```typescript
// backend/src/notifications/notifications.service.ts
export class NotificationsService {
  async sendCourseReminder(userId: string, courseId: string) {
    const user = await this.userModel.findById(userId);
    const course = await this.courseModel.findById(courseId);
    
    await this.fcm.send({
      token: user.fcmToken,
      notification: {
        title: 'Continue Learning!',
        body: `Resume "${course.title}"`,
      },
      data: {
        type: 'course_reminder',
        courseId,
      },
    });
  }
  
  // Similar methods for other notification types
}
```

---

### 5.3 Mobile-Specific Features

**A. Orientation Lock for Video Player:**
```typescript
import Orientation from 'react-native-orientation-locker';

const VideoScreen = () => {
  useEffect(() => {
    Orientation.lockToLandscape();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);
};
```

**B. Adaptive Streaming Based on Network:**
```typescript
import NetInfo from '@react-native-community/netinfo';

const VideoQualityManager = () => {
  const [quality, setQuality] = useState('auto');
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.type === 'wifi') {
        setQuality('1080p');
      } else if (state.type === 'cellular' && state.details?.cellularGeneration === '4g') {
        setQuality('720p');
      } else {
        setQuality('480p');
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  return quality;
};
```

**C. Data Saver Mode:**
```typescript
const DataSaverMode = () => {
  const [dataSaverEnabled, setDataSaverEnabled] = useState(false);
  
  // When enabled:
  // - Reduce video quality
  // - Disable auto-play
  // - Compress images
  // - Limit background sync
};
```

---

### 5.4 Mobile App Architecture

```
mobile/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── course/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CoursePlayer.tsx
│   │   │   └── CourseLessonList.tsx
│   │   ├── navigation/
│   │   │   ├── BottomTabNavigator.tsx
│   │   │   └── DrawerNavigator.tsx
│   │   └── ...
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CourseScreen.tsx
│   │   ├── TeachersScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ...
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   ├── offline.service.ts
│   │   ├── payment.service.ts
│   │   └── notification.service.ts
│   ├── store/  (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── courses.slice.ts
│   │   │   └── ...
│   │   └── store.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── utils/
│       ├── validation.ts
│       ├── formatting.ts
│       └── ...
├── ios/
├── android/
├── app.json
└── package.json
```

---

## IMPLEMENTATION TIMELINE

### Phase 1: Critical Fixes (Week 1)
```
Day 1-2:
  ✓ Fix broken logo link
  ✓ Restructure navigation menu
  ✓ Implement sticky header

Day 3-4:
  ✓ Fix "0 courses" counter bug
  ✓ Implement instructor filtering system (backend)

Day 5-7:
  ✓ Complete instructor filtering (frontend)
  ✓ Testing and bug fixes
```

### Phase 2: UX Enhancements (Week 2)
```
Day 1-3:
  ✓ Update section titles
  ✓ Implement course card hover effects
  ✓ Add course preview functionality

Day 4-7:
  ✓ Social authentication integration (Google)
  ✓ Social authentication integration (Apple)
  ✓ Enhanced registration flow
```

### Phase 3: Payment Optimization (Week 3)
```
Day 1-2:
  ✓ PayPal representative consultation
  ✓ Review and optimize payment flow

Day 3-5:
  ✓ End-to-end payment testing
  ✓ Mobile payment optimization
  ✓ Error handling improvements

Day 6-7:
  ✓ Production deployment
  ✓ Monitoring setup
```

### Phase 4: Mobile App Development (Weeks 4-12)
```
Weeks 4-5: Setup & Core Features
  ✓ Project setup (React Native)
  ✓ Navigation implementation
  ✓ Authentication (including biometrics)
  ✓ API integration

Weeks 6-7: Course Functionality
  ✓ Course listing
  ✓ Course details
  ✓ Video player implementation
  ✓ Offline download capability

Weeks 8-9: Advanced Features
  ✓ Push notifications
  ✓ Payment integration
  ✓ User profile & settings
  ✓ Gesture controls

Weeks 10-11: Testing & Optimization
  ✓ Performance optimization
  ✓ Bug fixes
  ✓ User testing
  ✓ UI/UX refinements

Week 12: Launch Preparation
  ✓ App Store submission (iOS)
  ✓ Play Store submission (Android)
  ✓ Marketing materials
  ✓ Launch strategy
```

---

## TESTING CHECKLIST

### Web Application Testing

#### Critical Path Testing
- [ ] Logo click from all pages → Homepage
- [ ] Navigation menu items → Correct pages
- [ ] Sticky header → Stays visible on scroll
- [ ] Instructor filter → Correct results
- [ ] Instructor course count → Matches actual count
- [ ] PayPal payment flow → Success
- [ ] PayPal payment flow → Error handling
- [ ] Social login (Google) → Success
- [ ] Social login (Apple) → Success

#### Cross-Browser Testing
- [ ] Chrome (Desktop & Mobile)
- [ ] Safari (Desktop & Mobile)
- [ ] Firefox
- [ ] Edge
- [ ] Samsung Internet (Android)

#### Responsive Testing
- [ ] Desktop (1920x1080, 1440x900, 1366x768)
- [ ] Tablet (iPad Pro, iPad, Surface)
- [ ] Mobile (iPhone 14, Pixel 7, Galaxy S23)

#### Performance Testing
- [ ] Page load time < 3s (4G connection)
- [ ] Time to Interactive < 5s
- [ ] Lighthouse score > 90 (Performance, Accessibility)
- [ ] No console errors
- [ ] No memory leaks

### Mobile Application Testing

#### Functionality Testing
- [ ] Biometric authentication (Face ID, Touch ID)
- [ ] Video playback (all speeds)
- [ ] Offline video playback
- [ ] Background audio playback
- [ ] Push notifications
- [ ] PayPal payment
- [ ] Apple Pay payment (iOS)
- [ ] Google Pay payment (Android)

#### Device Testing
- [ ] iPhone 14 Pro (iOS 17)
- [ ] iPhone 12 (iOS 16)
- [ ] Pixel 7 (Android 13)
- [ ] Galaxy S23 (Android 13)
- [ ] Various older devices (2-3 years old)

#### Network Testing
- [ ] WiFi
- [ ] 5G
- [ ] 4G
- [ ] 3G
- [ ] Offline mode
- [ ] Network switching

---

## LOCALIZATION UPDATES REQUIRED

All new features must support 3 languages:

### New Translation Keys Needed

```json
// public/locales/en/common.json
{
  "navigation": {
    "all_instructors": "All Instructors",
    "courses": "Courses"
  },
  "sections": {
    "featured_courses": "Featured Courses"
  },
  "teachers": {
    "filter_by_category": "Filter by Category",
    "sort_by": "Sort by",
    "most_popular": "Most Popular",
    "most_courses": "Most Courses",
    "highest_rated": "Highest Rated",
    "courses": "courses"
  },
  "auth": {
    "sign_in_with_google": "Sign in with Google",
    "sign_in_with_apple": "Sign in with Apple",
    "continue_with_social": "Or continue with"
  },
  "payment": {
    "processing": "Processing payment...",
    "success": "Payment successful!",
    "error": {
      "insufficient_funds": "Insufficient funds",
      "card_declined": "Card declined",
      "timeout": "Payment timeout",
      "generic": "Payment failed. Please try again."
    }
  },
  "mobile": {
    "download_for_offline": "Download for Offline",
    "downloaded": "Downloaded",
    "playback_speed": "Playback Speed",
    "quality": "Quality",
    "auto": "Auto",
    "data_saver": "Data Saver Mode",
    "storage_used": "Storage Used",
    "clear_cache": "Clear Downloaded Lessons"
  }
}
```

Russian and Georgian translations required for all keys.

---

## MONITORING & ANALYTICS

### Web Application Monitoring

**Recommended Tools:**
1. **Sentry** - Error tracking
2. **Google Analytics 4** - User behavior
3. **Hotjar** - Heatmaps & session recording
4. **PageSpeed Insights** - Performance monitoring

**Key Metrics to Track:**
- Page load times
- Payment conversion rate
- User registration completion rate
- Social login adoption rate
- Error rates by page
- User retention (7-day, 30-day)

### Mobile Application Monitoring

**Recommended Tools:**
1. **Firebase Analytics** - User behavior
2. **Firebase Crashlytics** - Crash reporting
3. **Firebase Performance** - App performance

**Key Metrics to Track:**
- App launch time
- Video playback success rate
- Offline lesson completion rate
- Payment completion rate (mobile)
- Push notification open rate
- Daily/Monthly Active Users (DAU/MAU)

---

## SECURITY CONSIDERATIONS

### Authentication
- [ ] Implement rate limiting on login endpoints
- [ ] Use secure token storage (HTTPOnly cookies for web, Keychain/Keystore for mobile)
- [ ] Implement refresh token rotation
- [ ] Add CAPTCHA on registration after failed attempts
- [ ] Enable 2FA option

### Payment Security
- [ ] PCI DSS compliance review
- [ ] Implement payment fraud detection
- [ ] Log all payment attempts
- [ ] Encrypt sensitive payment data
- [ ] Regular security audits

### Data Protection
- [ ] GDPR compliance for EU users
- [ ] Implement data export functionality
- [ ] Implement account deletion
- [ ] Encrypt user data at rest
- [ ] Regular security patches

### Mobile App Security
- [ ] Certificate pinning
- [ ] Root/Jailbreak detection
- [ ] Secure storage for offline content (encrypted)
- [ ] Code obfuscation
- [ ] Regular security updates

---

## SUCCESS CRITERIA

### Website Success Metrics
- ✓ All critical bugs fixed (logo link, course counter)
- ✓ Navigation restructured and user-tested
- ✓ Sticky header implemented
- ✓ Instructor filtering working perfectly
- ✓ Social login conversion rate > 40%
- ✓ PayPal payment success rate > 95%
- ✓ Page load time < 3s on 4G
- ✓ Mobile responsiveness score > 95%

### Mobile App Success Metrics
- ✓ App Store rating > 4.5 stars (after 100+ reviews)
- ✓ Crash-free rate > 99.5%
- ✓ Average session length > 15 minutes
- ✓ Offline lesson completion rate > 30%
- ✓ Push notification opt-in rate > 60%
- ✓ Payment completion rate > 90%
- ✓ DAU/MAU ratio > 0.25

---

## RISK MITIGATION

### Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| PayPal API changes | High | Low | Regular API version updates, webhooks for changes |
| Mobile platform updates breaking features | High | Medium | Test on beta versions, maintain compatibility layers |
| Offline video storage filling device | Medium | High | Implement storage limits, auto-cleanup |
| Biometric auth compatibility issues | Medium | Medium | Fallback to password auth always available |

### Business Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low mobile app adoption | High | Medium | Incentivize with mobile-only features/discounts |
| Payment gateway downtime | High | Low | Implement multiple payment methods |
| Competition with similar apps | Medium | High | Focus on unique value proposition, community |

---

## FUTURE ENHANCEMENTS (Post-Launch)

### Web Platform
1. Live streaming capability for instructor webinars
2. Community forum/discussion boards
3. Gamification (points, badges, leaderboards)
4. AI-powered course recommendations
5. Multi-language subtitle generation

### Mobile App
1. Apple Watch companion app
2. Chromecast/AirPlay support
3. Offline-first architecture improvements
4. AR/VR exercise demonstrations
5. Health app integration (track exercise completion)

---

## DOCUMENTATION REQUIREMENTS

### For Development Team
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Component library documentation (Storybook)
- [ ] Database schema documentation
- [ ] Deployment procedures
- [ ] Environment setup guide

### For Users
- [ ] User guide (web platform)
- [ ] Mobile app onboarding tutorial
- [ ] FAQ section
- [ ] Video tutorials for key features
- [ ] Help center articles

---

## CONTACT & ESCALATION

### Technical Escalation
- **Level 1:** Development team lead
- **Level 2:** CTO / Technical architect
- **Level 3:** External consultants (if needed)

### Business Escalation
- **Level 1:** Project manager
- **Level 2:** Product owner
- **Level 3:** Anry (Stakeholder)

### PayPal Support
- **Direct Line:** [To be added after representative assignment]
- **Developer Portal:** https://developer.paypal.com/support
- **Technical Documentation:** https://developer.paypal.com/docs

---

## APPROVAL & SIGN-OFF

### Website Fixes - Phase 1
- [ ] Development completed
- [ ] QA testing passed
- [ ] Staging environment deployed
- [ ] Stakeholder review (Anry)
- [ ] Production deployment approved

### Mobile App - MVP
- [ ] Feature complete
- [ ] Beta testing completed (10+ users)
- [ ] App Store guidelines compliance
- [ ] Play Store guidelines compliance
- [ ] Marketing materials ready
- [ ] Launch approved

---

## CONCLUSION

This roadmap addresses all immediate website issues, payment optimization requirements, and comprehensive mobile application development needs. The phased approach ensures:

1. **Critical bugs** are fixed immediately (Week 1)
2. **UX improvements** enhance user experience (Weeks 2-3)
3. **Mobile application** delivers modern, feature-rich experience (Weeks 4-12)

**Next Steps:**
1. Review and approve this roadmap
2. Confirm development resources availability
3. Schedule PayPal representative call
4. Begin Phase 1 implementation immediately

**Estimated Total Timeline:** 12 weeks for complete implementation  
**Estimated Budget:** [To be determined based on team size and resources]

---

**Document Version:** 1.0  
**Last Updated:** June 15, 2026  
**Prepared By:** Development Team  
**Approved By:** [Pending]

---

## APPENDIX A: File Inventory

### Files Requiring Immediate Changes

| File | Priority | Changes Required |
|------|----------|------------------|
| `app/components/Navbar/DesktopNavbar.tsx` | P0 | Fix logo link, restructure menu |
| `app/components/Header/Header.tsx` | P0 | Update menu items |
| `app/teachers/page.tsx` | P0 | Add filter component |
| `backend/src/instructor/instructor.service.ts` | P0 | Fix coursesCount aggregation |
| `app/components/CategoryFilter.tsx` | P1 | Reference for instructor filter |
| `app/components/PayPalButton.tsx` | P1 | Optimization enhancements |
| `public/locales/en/common.json` | P1 | Add new translation keys |
| `public/locales/ru/common.json` | P1 | Add new translation keys |
| `public/locales/ka/common.json` | P1 | Add new translation keys |

### Files to Create

| File | Priority | Purpose |
|------|----------|---------|
| `app/components/InstructorFilter.tsx` | P0 | Instructor filtering UI |
| `backend/src/instructor/dto/filter-instructor.dto.ts` | P0 | Instructor filter DTO |
| `app/components/SocialAuth.tsx` | P1 | Social authentication UI |
| `backend/src/auth/strategies/google.strategy.ts` | P1 | Google OAuth strategy |
| `backend/src/auth/strategies/apple.strategy.ts` | P1 | Apple OAuth strategy |

---

## APPENDIX B: Environment Variables

### Required Environment Variables

```bash
# .env.local (Web Frontend)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_APPLE_CLIENT_ID=your_apple_client_id

# .env (Backend)
DATABASE_URL=mongodb://localhost:27017/ghrs
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_MODE=sandbox
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_secret

# Mobile App (.env)
API_URL=https://api.ghrs.com
PAYPAL_CLIENT_ID=your_paypal_client_id
GOOGLE_CLIENT_ID=your_google_client_id
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
```

---

## APPENDIX C: Useful Commands

```bash
# Web Development
npm run dev              # Start development server
npm run build           # Build for production
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Backend Development
npm run start:dev       # Start NestJS dev server
npm run build          # Build backend
npm run test           # Run tests
npm run migration:run  # Run database migrations

# Mobile Development
npm start              # Start Expo dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run build:ios      # Build iOS app
npm run build:android  # Build Android app

# Testing
npm run test:e2e       # End-to-end tests
npm run test:unit      # Unit tests
npm run test:coverage  # Coverage report
```

---

**END OF DOCUMENT**
