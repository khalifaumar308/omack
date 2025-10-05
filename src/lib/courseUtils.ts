/* Small helpers to normalize Course objects that may be populated or not.
   Provides a consistent lightweight shape for UI consumption and safe accessors.
*/
import type { Course, PopulatedCourse } from "@/components/types";

export interface NormalizedCourse {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName?: string;
  schoolId?: string;
  instructors: string[];
  creditUnits: number;
  semester: "First" | "Second";
  level?: string;
  // keep original reference when needed
  original: Course | PopulatedCourse;
}

export function normalizeCourse(course: Course | PopulatedCourse): NormalizedCourse {
  // type guard: populated course has department as an object with 'id' and 'name'
  const maybePopulated = (c: Course | PopulatedCourse): c is PopulatedCourse => {
    return typeof (c as PopulatedCourse).department === 'object' && !!(c as PopulatedCourse).department;
  };

  const isPopulated = maybePopulated(course);
  const departmentId = isPopulated ? (course as PopulatedCourse).department.id : (course as Course).department;
  const departmentName = isPopulated ? (course as PopulatedCourse).department.name : undefined;
  const courseAsCourse = course as Course;
  const courseAsPop = course as PopulatedCourse;

  const schoolId = typeof courseAsCourse.school === "string" ? courseAsCourse.school : courseAsPop.school?.id;

  let id = "";
  if ('id' in courseAsCourse && courseAsCourse.id) id = courseAsCourse.id;
  else {
    // try checking _id as a fallback without using `any` in a broad scope
    const fallback = (courseAsCourse as unknown) as { _id?: string };
    if (fallback._id) id = fallback._id;
  }
  const code = courseAsCourse.code || "";
  const title = courseAsCourse.title || "";
  const instructors = courseAsCourse.instructors || [];
  const creditUnits = courseAsCourse.creditUnits || 0;
  const semester = (courseAsCourse.semester || "First") as "First" | "Second";
  const level = courseAsCourse.level;

  return {
    id,
    code,
    title,
    departmentId,
    departmentName,
    schoolId,
    instructors,
    creditUnits,
    semester,
    level,
    original: course,
  };
}

export function getDepartmentName(course: Course | PopulatedCourse): string {
  const norm = normalizeCourse(course);
  return norm.departmentName || norm.departmentId || "N/A";
}
