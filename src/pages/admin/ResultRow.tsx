/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PDFDownloadLink } from '@react-pdf/renderer';
// import ResultTemplate from '@/components/ResultTemplate';
import type { StudentsSemesterResultsResponse, GradingTemplate, School } from '@/components/types';
import NewResultTemplate from '@/components/NewResultTemplate';

const getGradeAndPoint = (score: number, gradeBands: any[] = []) => {
  for (const band of gradeBands) {
    if (score >= band.minScore && score <= band.maxScore) {
      return { grade: band.grade, point: band.point };
    }
  }
  return { grade: '', point: 0 };
};

const getCommentForPoint = (point: number, commentBands: any[] = []) => {
  for (const band of commentBands) {
    if (point >= band.minScore && point <= band.maxScore) return band.comment;
  }
  return '';
};

// A lightweight internal formatter kept here to avoid circular imports.
const formatForResultTemplate = (
  result: StudentsSemesterResultsResponse,
  gradingTemplates: GradingTemplate[],
  session: string,
  semester: string
) => {
  const student = result.student as any;
  const department = student.department as any;
  const faculty = department?.faculty as any;
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const rsummary = result.summary || ({} as any);

  const template = gradingTemplates.find(
    (tpl) => (typeof tpl.department === 'string' ? tpl.department : tpl.department?.id) === department?._id
  );
  const gradeBands = template?.gradeBands || [];

  const courses = result.courses.map((reg: any, index: number) => {
    const score = reg.score || 0;
    const { grade, point } = getGradeAndPoint(score, gradeBands);
    return {
      sn: index + 1,
      code: reg.course.code,
      title: reg.course.title,
      credits: reg.course.creditUnits,
      total: Math.trunc(score),
      grade,
      gradePoint: point * reg.course.creditUnits,
      remark: grade ? (point > 0 ? 'PASSED' : 'FAILED') : 'Not Graded',
    };
  });

  const tcu = rsummary?.TCU || courses.reduce((sum: number, c: any) => sum + c.credits, 0);
  const tgp = rsummary?.TGP || courses.reduce((sum: number, c: any) => sum + c.gradePoint, 0);
  const gpa = rsummary?.GPA || (tcu > 0 ? tgp / tcu : 0);
  const remark = rsummary?.comment || getCommentForPoint(gpa, template?.commentBands ?? []) || 'Not Set';

  const summary = {
    current: { tcu: rsummary?.TCU || tcu, tca: tcu, tgp: rsummary?.TGP || tgp, gpa: rsummary?.GPA || gpa, remark },
    previous: {
      ltcu: `${rsummary?.previous?.TCU}` || 'Nill',
      ltca: `${rsummary?.previous?.TCU}` || 'Nill',
      ltgp: `${rsummary?.previous?.TGP}` || 'Nill',
      lcgpa: `${rsummary?.previous?.CGPA?.toFixed?.(2)}` || 'Nill',
    },
    cumulative: {
      tcu: rsummary?.cumulativeTCU || tcu,
      tca: rsummary?.cumulativeTCU || tcu,
      tgp: rsummary?.cumulativeTGP || tgp,
      cgpa: rsummary?.CGPA || gpa,
    },
  };

  const studentData = {
    lastUpdated: currentDate,
    matric: student.matricNo,
    name: student.name,
    session,
    programme: department?.name,
    semester,
    department: department?.name,
    level: student.level?.toString?.(),
    faculty: faculty?.name,
    approvalStatus: 'approved',
  };

  return { studentData, courses, summary } as const;
};

const ResultRow = memo(function ResultRow({
  result,
  gradingTemplates,
  session,
  semester,
  style,
  school,
  variant = 'row',
}: {
  result: StudentsSemesterResultsResponse;
  gradingTemplates: GradingTemplate[];
  session: string;
  semester: string;
  style?: React.CSSProperties;
  school: School;
  variant?: 'row' | 'card';
}) {
  const passed = useMemo(() => result.courses.filter((c: any) => c.grade && c.grade !== 'F').length, [result.courses]);
  const failed = useMemo(() => result.courses.filter((c: any) => c.grade === 'F').length, [result.courses]);
  const gpa = result.summary?.GPA;

  const pdfDocument = useMemo(() => {
    const props = {...formatForResultTemplate(result, gradingTemplates, session, semester), schoolInfo:school};
    return <NewResultTemplate {...props} />;
  }, [result, gradingTemplates, session, semester, school]);
  const nameShort = result.student.name.split(" ").slice(0,2).join(" ");
  if (variant === 'card') {
    return (
      <div style={style} className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm text-muted-foreground">{result.student.matricNo}</div>
            <div className="font-semibold text-lg">{result.student.name}</div>
            <div className="text-sm text-muted-foreground">{result.student.level} • {school?.name}</div>
          </div>
          <div className="text-right">
            <div className="text-sm">GPA</div>
            <div className="font-medium text-lg">{gpa !== undefined ? gpa.toFixed(2) : 'N/A'}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div>Passed: <span className="text-foreground font-medium">{passed}</span></div>
          <div>Failed: <span className="text-foreground font-medium">{failed}</span></div>
          <div>Courses: <span className="text-foreground font-medium">{result.courses.length}</span></div>
        </div>

        <div className="flex gap-2">
          <PDFDownloadLink document={pdfDocument} fileName={`${result.student.name}-result.pdf`}>
            {({ loading }) => (
              <Button variant="ghost" size="sm" disabled={loading}>
                {loading ? 'Generating...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      className="grid grid-cols-9 gap-2 border-b py-2 px-2"
    >
      <div className='flex sm:hidden text-sm col-span-2'>{nameShort}</div>
      <div className="hidden sm:flex font-medium pr-2 col-span-2">{result.student.name}</div>
      <div className="col-span-[2]">{result.student.matricNo}</div>
      <div className="col-span-[1]">{result.student.level}</div>
      <div className="col-span-1">{passed}</div>
      <div className="col-span-1">{failed}</div>
      <div className="col-span-1">{gpa !== undefined ? gpa.toFixed(2) : 'N/A'}</div>
      <div className="col-span-1">
        <PDFDownloadLink document={pdfDocument} fileName={`${result.student.name}-result.pdf`}>
          {({ loading }) => (
            <Button variant="ghost" size="sm" disabled={loading}>
              {loading ? 'Generating...' : 'Download PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
});

export default ResultRow;
