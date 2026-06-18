/**
 * პროფესიული განვითარების სექციის ნავიგაცია (კურსები, ინსტრუქტორები, landing).
 */

export type ProfDevParentLink = {
  href: string;
  labelKey: string;
};

export type ProfDevNavContext = {
  show: boolean;
  profLandingHref: string;
  allCoursesHref: string;
  allInstructorsHref: string;
  /** მაგ. ინსტრუქტორის გვერდიდან → /teachers */
  parent?: ProfDevParentLink;
};

const PROF_LANDING = "/professional";
const ALL_COURSES = "/allCourse";
const ALL_INSTRUCTORS = "/teachers";

function isTeachersPath(pathname: string): boolean {
  return pathname === "/teachers" || pathname.startsWith("/teachers/");
}

function isAllCoursePath(pathname: string): boolean {
  return pathname === "/allCourse" || pathname.startsWith("/allCourse/");
}

function isSingleCoursePath(pathname: string): boolean {
  return pathname.startsWith("/singleCourse/");
}

function isProfessionalPath(pathname: string): boolean {
  return pathname === "/professional" || pathname.startsWith("/professional/");
}

/** prof-dev tabbar-ის ლოგო (GRS + Rehabilitation Center) — მხოლოდ ამ გვერდებზე */
export function shouldUseProfessionalTabLogo(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    isProfessionalPath(pathname) ||
    isAllCoursePath(pathname) ||
    isSingleCoursePath(pathname)
  );
}

/** ამ path-ებზე ვაჩვენებთ გაფართოებულ prof-dev მენიუს ჰედერში */
export function isProfessionalDevSection(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    isProfessionalPath(pathname) ||
    isTeachersPath(pathname) ||
    isAllCoursePath(pathname) ||
    isSingleCoursePath(pathname)
  );
}

export function getProfDevNavContext(pathname: string | null): ProfDevNavContext {
  const empty: ProfDevNavContext = {
    show: false,
    profLandingHref: PROF_LANDING,
    allCoursesHref: ALL_COURSES,
    allInstructorsHref: ALL_INSTRUCTORS,
  };
  if (!pathname || !isProfessionalDevSection(pathname)) return empty;

  let parent: ProfDevParentLink | undefined;

  // Individual course pages need a parent link back to their section
  // because they use different route patterns (/singleCourse/ vs /allCourse/)
  if (isSingleCoursePath(pathname)) {
    parent = { href: ALL_COURSES, labelKey: "navigation.prof_dev_tab_courses" };
  }
  
  // Note: Individual instructor/course detail pages don't need parent links
  // because main tabs (Professional, All Courses, All Instructors) are always visible
  // and serve as navigation back to listing pages

  return {
    show: true,
    profLandingHref: PROF_LANDING,
    allCoursesHref: ALL_COURSES,
    allInstructorsHref: ALL_INSTRUCTORS,
    parent,
  };
}
