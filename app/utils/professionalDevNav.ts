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
  /** მაგ. ინსტრუქტორის გვერდიდან → /teachers */
  parent?: ProfDevParentLink;
};

const PROF_LANDING = "/professional";
const ALL_COURSES = "/allCourse";

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
  };
  if (!pathname || !isProfessionalDevSection(pathname)) return empty;

  let parent: ProfDevParentLink | undefined;

  if (isTeachersPath(pathname) && pathname !== "/teachers") {
    parent = { href: "/teachers", labelKey: "navigation.prof_dev_tab_instructors" };
  } else if (isAllCoursePath(pathname) && pathname !== "/allCourse") {
    parent = { href: "/allCourse", labelKey: "navigation.prof_dev_tab_courses" };
  } else if (isSingleCoursePath(pathname)) {
    parent = { href: ALL_COURSES, labelKey: "navigation.prof_dev_tab_courses" };
  } else if (
    pathname === "/teachers" ||
    pathname === "/allCourse" ||
    isProfessionalPath(pathname)
  ) {
    parent = { href: "/", labelKey: "navigation.home" };
  }

  return {
    show: true,
    profLandingHref: PROF_LANDING,
    allCoursesHref: ALL_COURSES,
    parent,
  };
}
