/**
 * კურსში embedded instructor ↔ პროფილის id/სახელი (ლეგაცია: სახელი ციფრებით/უციფროდ, "|" გამყოფით).
 * გამოიყენება CourseService და InstructorService-ში იგივე მაჩვენებლისთვის.
 */
function escapeMongoRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildInstructorCourseMatch(
  instructorId: string,
  instructorDisplayName?: string,
): Record<string, unknown>[] {
  const or: Record<string, unknown>[] = [
    { 'instructor.instructorId': instructorId },
  ];
  const nameTrim = instructorDisplayName?.trim();
  if (!nameTrim) return or;

  or.push({ 'instructor.name': nameTrim });

  const baseNoTrailingDigits = nameTrim.replace(/\d+$/u, '').trim();
  if (baseNoTrailingDigits.length >= 2 && baseNoTrailingDigits !== nameTrim) {
    or.push({ 'instructor.name': baseNoTrailingDigits });
    or.push({
      'instructor.name': {
        $regex: new RegExp(`^${escapeMongoRegex(baseNoTrailingDigits)}`, 'i'),
      },
    });
  }

  for (const part of nameTrim
    .split('|')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)) {
    if (part === nameTrim) continue;
    or.push({ 'instructor.name': part });
    or.push({
      'instructor.name': { $regex: new RegExp(`^${escapeMongoRegex(part)}`, 'i') },
    });
  }

  return or;
}
