const EXERCISE_LINE =
  /(?:consists\s+of|состоит\s+из|შედგება|includes)\s*(\d+)\s*(?:exercises?|упражнений?|ვარჯიში)/i;

const EXERCISE_ALT = /(\d+)\s*(?:exercises?|упражнений?|ვარჯიში)/i;

export type SetDescriptionMeta = {
  exerciseCount: number;
  durationMinutes: number;
  durationDisplayValue: number;
  useHoursForDuration: boolean;
};

/** Set API `duration` — MM:SS, HH:MM:SS, ან "32:57 min" და მსგავსი */
export function parseSetTotalDuration(value?: string | null): number {
  if (!value || typeof value !== "string") return 0;
  let trimmed = value.trim();
  if (!trimmed) return 0;

  trimmed = trimmed
    .replace(
      /\s*(min(?:ute)?s?|мин(?:ут(?:а|ы)?)?|წთ|საათ(?:ი|ებ)?|hr?s?|hours?)\s*$/i,
      ""
    )
    .trim();

  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map((part) => {
      const match = part.trim().match(/^(\d+(?:\.\d+)?)/);
      return match ? Number(match[1]) : NaN;
    });
    if (parts.some((n) => Number.isNaN(n))) return 0;
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + parts[2] / 60;
    }
    if (parts.length === 2) {
      return parts[0] + parts[1] / 60;
    }
  }

  const asNumber = Number(trimmed);
  return Number.isFinite(asNumber) ? asNumber : 0;
}

function parseExerciseDurationMinutes(value?: string | null): number {
  if (!value) return 0;
  const dur = String(value).trim();
  if (!dur || dur === "0" || dur === "00:00" || dur === "0:00") return 0;
  return parseSetTotalDuration(dur);
}

function getExerciseDurationMinutes(exercise: {
  videoDuration?: string;
  duration?: string;
}): number {
  return (
    parseExerciseDurationMinutes(exercise.videoDuration) ||
    parseExerciseDurationMinutes(exercise.duration) ||
    0
  );
}

/** ერთი set-ის ხანგრძლივობა წუთებში — პირველ რიგში API `duration` */
export function getSetDurationMinutes(set: {
  duration?: string;
  totalDuration?: string;
  exercises?: Array<{ videoDuration?: string; duration?: string }>;
}): number {
  const fromDuration = parseSetTotalDuration(set.duration);
  if (fromDuration > 0) return Math.round(fromDuration);

  if (set.totalDuration && set.totalDuration !== "00:00") {
    const fromTotal = parseSetTotalDuration(set.totalDuration);
    if (fromTotal > 0) return Math.round(fromTotal);
  }

  if (set.exercises && set.exercises.length > 0) {
    const fromExercises = set.exercises.reduce(
      (acc, exercise) => acc + getExerciseDurationMinutes(exercise),
      0
    );
    if (fromExercises > 0) return Math.round(fromExercises);
  }

  return 0;
}

/** რამდენიმე set-ის ჯამური ხანგრძლივობა საათებში (ერთი ათობითი) */
export function sumSetsDurationHours(
  sets: Array<{
    duration?: string;
    totalDuration?: string;
    exercises?: Array<{ videoDuration?: string; duration?: string }>;
  }>
): number {
  const totalMinutes = sets.reduce(
    (acc, set) => acc + getSetDurationMinutes(set),
    0
  );
  return Math.round((totalMinutes / 60) * 10) / 10;
}

export function getSetExerciseCount(options: {
  description: string;
  totalExercises?: number;
  fallbackExerciseCount?: number;
}): number {
  const fromDescription = parseExerciseCountFromDescription(options.description);
  return (
    fromDescription ??
    (options.totalExercises && options.totalExercises > 0
      ? options.totalExercises
      : null) ??
    options.fallbackExerciseCount ??
    0
  );
}

type LocalizedField =
  | string
  | { en?: string; ru?: string; ka?: string }
  | undefined;

export function getLocalizedSetText(
  field: LocalizedField,
  locale: string
): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return (
    field[locale as keyof typeof field] ||
    field.ru ||
    field.en ||
    field.ka ||
    ""
  );
}

export function sumSetsExerciseCount(
  sets: Array<{
    description?: LocalizedField;
    totalExercises?: number;
    exercises?: unknown[];
  }>,
  locale: string
): number {
  return sets.reduce(
    (acc, set) =>
      acc +
      getSetExerciseCount({
        description: getLocalizedSetText(set.description, locale),
        totalExercises: set.totalExercises,
        fallbackExerciseCount: set.exercises?.length,
      }),
    0
  );
}

function parseExerciseCountFromDescription(description: string): number | null {
  const trimmed = description.trim();
  if (!trimmed) return null;
  const match = trimmed.match(EXERCISE_LINE) || trimmed.match(EXERCISE_ALT);
  if (!match) return null;
  const count = parseInt(match[1], 10);
  return Number.isNaN(count) ? null : count;
}

export function parseSetDescriptionMeta(options: {
  description: string;
  /** API set.duration — ძირითადი წყარო (მაგ. "25:00") */
  setDuration?: string;
  totalExercises?: number;
  fallbackExerciseCount?: number;
}): SetDescriptionMeta {
  const fromDescription = parseExerciseCountFromDescription(options.description);
  const exerciseCount =
    fromDescription ??
    (options.totalExercises && options.totalExercises > 0
      ? options.totalExercises
      : null) ??
    options.fallbackExerciseCount ??
    0;

  const durationMinutes = Math.round(
    parseSetTotalDuration(options.setDuration)
  );
  const useHoursForDuration = durationMinutes >= 60;
  const durationDisplayValue = useHoursForDuration
    ? Math.round(durationMinutes / 60)
    : durationMinutes;

  return {
    exerciseCount,
    durationMinutes,
    durationDisplayValue,
    useHoursForDuration,
  };
}
