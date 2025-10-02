import { useState, useMemo } from "react";
import { useUser } from "@/contexts/useUser";
import {
  useGetSemesterResult,
  useGetTranscript,
  useGetGradingTemplates,
  useGetStudent
} from "@/lib/api/queries";
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
// import ResultTemplate from "@/components/ResultTemplate";
import type { PDFProps as ResultPDFProps } from "@/components/NewResultTemplate";
import TranscriptTemplate from "@/components/TranscriptTemplate";
import type { TranscriptProps } from "@/components/TranscriptTemplate";
import type {
  StudentsSemesterResultsResponse,
  ResultSummary,
  PopulatedDepartment,
  PopulatedFaculty,
  GradingTemplate
} from "@/components/types";
import { scoreToComment } from "@/lib/utils";
import NewResultTemplate from "@/components/NewResultTemplate";

function LoadingSkeletonResults() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-64 h-8"><Skeleton className="w-full h-full" /></div>
        <div className="w-40 h-6"><Skeleton className="w-full h-full" /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Skeleton className="w-12 h-12 rounded-md" />
              <div className="ml-4 w-full">
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-1/2 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="mb-4"><Skeleton className="w-48 h-5" /></div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="w-1/3 h-4" />
              <Skeleton className="w-1/6 h-4" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="mb-4"><Skeleton className="w-40 h-5" /></div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-12 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Types for display
interface CourseDisplay {
  sn: number;
  code: string;
  title: string;
  credits: number;
  total: number;
  grade: string;
  gradePoint: number;
  remark: string;
}

interface SummaryDisplay {
  tcu: number;
  tca: number;
  tgp: number;
  gpa: number;
  remark: string;
  previous?: {
    TCU: number;
    TGP: number;
    CGPA: number;
  };
}

const Results = () => {
  const { user, isLoading: userLoading } = useUser();
  const [semester, setSemester] = useState(user?.school?.currentSemester || 'First');
  const [session, setSession] = useState(user?.school?.currentSession || '2025/2026');
  const { data: gradingTemplatesRaw, isLoading:templatesLoading } = useGetGradingTemplates();
  // const { data: semesterResults = [], isLoading: semesterLoading } = useGetStudentsSemesterResults(semester, session);
  const { data: semesterResult, isLoading: semesterLoading } = useGetSemesterResult(semester, session); // To refetch on semester/session change
  const { data: transcript = [], isLoading: transcriptLoading } = useGetTranscript();
  const { data:studentDataa, isLoading:fetchingStudent } = useGetStudent(user?.id || '');
  const currentResult = semesterResult as StudentsSemesterResultsResponse | undefined; // Assume only current student's data

  // Find grading template for student's department
  const departmentId = studentDataa?.department && typeof studentDataa.department === 'object' ? studentDataa.department.id : studentDataa?.department;
  const gradingTemplate = (gradingTemplatesRaw ? (JSON.parse(JSON.stringify(gradingTemplatesRaw)) as GradingTemplate[]) : []).find(
    (tpl) => (typeof tpl.department === 'string' ? tpl.department : tpl.department?.id) === departmentId
  );
  const gradeBands = useMemo(() => gradingTemplate?.gradeBands || [], [gradingTemplate]);
  // console.log("current User", studentDataa);

  // Student data for PDFs - compute always, null if no user
  const studentData = useMemo<ResultPDFProps['studentData'] & TranscriptProps['studentData'] | null>(() => {
    if (!studentDataa) return null;
    const department = studentDataa.department as unknown as PopulatedDepartment;
    const faculty = (department?.faculty as unknown as PopulatedFaculty) || { name: '' };
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return {
      lastUpdated: now,
      matric: studentDataa.matricNo,
      name: studentDataa.name,
      session, // For semester PDF
      programme: department?.name || '',
      semester, // For semester PDF
      department: department?.name || '',
      level: studentDataa.level?.toString() || '',
      faculty: faculty.name || '',
      approvalStatus: 'approved',
    };
  }, [studentDataa, session, semester]);

  // Format courses for display and PDF
  const courses: CourseDisplay[] = useMemo(() => {
    if (!currentResult?.courses) return [];
    const getGradeAndPoint = (score: number): { grade: string; point: number } => {
      for (const band of gradeBands) {
        if (score >= band.minScore && score <= band.maxScore) {
          return { grade: band.grade, point: band.point };
        }
      }
      return { grade: '', point: 0 };
    };
    return currentResult.courses.map((reg, index) => {
      const score = reg.score || 0;
      const { grade, point } = getGradeAndPoint(score);
      const gradePoint = point * reg.course.creditUnits;
      const remark = grade ? (point > 0 ? 'PASSED' : 'FAILED') : 'Not Graded';
      return {
        sn: index + 1,
        code: reg.course.code,
        title: reg.course.title,
        credits: reg.course.creditUnits,
        total: score,
        grade,
        gradePoint,
        remark,
      };
    });
  }, [currentResult?.courses, gradeBands]);

  // Summary for display and PDF
  const summary: SummaryDisplay = useMemo(() => {
    if (currentResult?.summary) {
      const s = currentResult.summary;
      const remark = gradingTemplate ? scoreToComment(gradingTemplate, s.GPA) : '';
      return {
        tcu: s.TCU,
        tca: s.TCU, // Assume TCA = TCU
        tgp: s.TGP,
        gpa: s.GPA,
        remark,
        previous: s.previous
      };
    }
    // Calculate if no summary
    if (courses.length === 0) {
      return { tcu: 0, tca: 0, tgp: 0, gpa: 0, remark: 'No Results' };
    }
    const tcu = courses.reduce((sum, c) => sum + c.credits, 0);
    const tgp = courses.reduce((sum, c) => sum + c.gradePoint, 0);
    const gpa = tcu > 0 ? tgp / tcu : 0;
    const remark = scoreToComment(gradingTemplate!, gpa);;
    return { tcu, tca: tcu, tgp, gpa, remark };
  }, [currentResult?.summary, courses, gradingTemplate]);

  // For ResultTemplate Summary interfaceltcu
  const pdfSummary = useMemo(() => ({
    current: summary,
    previous: { 
      ltcu: `${summary.previous?.TCU || 0}`, 
      ltca: `${summary.previous?.TCU || 0}`, 
      ltgp: `${summary.previous?.TGP || 0}`, 
      lcgpa: `${summary.previous?.CGPA || 0}` 
    },
    cumulative: { tcu: summary.tcu, tca: summary.tca, tgp: summary.tgp, cgpa: summary.gpa },
  }), [summary]);

  // For transcript PDF, use ResultSummary[] but filter if needed
  const transcriptSummaries: TranscriptProps['summaries'] = useMemo(() =>
    transcript.map((s: ResultSummary) => ({
      id: s.id,
      session: s.session,
      semester: s.semester,
      TCU: s.TCU,
      TGP: s.TGP,
      GPA: s.GPA,
      cumulativeTCU: s.cumulativeTCU,
      cumulativeTGP: s.cumulativeTGP,
      CGPA: s.CGPA,
    })), [transcript]);

  if (userLoading || semesterLoading || transcriptLoading || templatesLoading || fetchingStudent) {
    return <LoadingSkeletonResults />;
  }

  if (!user || user.role !== 'student' || !studentData) {
    return <div className="container mx-auto p-6">Access denied. Student only.</div>;
  }

  const sessions = user.school?.sessions || ['2023/2024', '2024/2025', '2025/2026'];
  console.log(transcriptSummaries, "transcriptSummaries");
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Semester Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-lg font-medium">Semester Results</span>
            <div className="flex gap-3 flex-wrap items-center">
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First">First Semester</SelectItem>
                  <SelectItem value="Second">Second Semester</SelectItem>
                </SelectContent>
              </Select>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((sess) => (
                    <SelectItem key={sess} value={sess}>
                      {sess}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No results available for {semester} semester, {session}.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S/N</TableHead>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>CU</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>GP</TableHead>
                      <TableHead>Remark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.code}>
                        <TableCell>{course.sn}</TableCell>
                        <TableCell>{course.code}</TableCell>
                        <TableCell className="max-w-xs break-words">{course.title}</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>{course.total.toFixed(2)}</TableCell>
                        <TableCell>{course.grade}</TableCell>
                        <TableCell>{course.gradePoint.toFixed(1)}</TableCell>
                        <TableCell>{course.remark}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Result Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">TCU</div>
                    <div className="font-bold">{summary.tcu}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">GPA</div>
                    <div className="font-bold">{summary.gpa.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Classification</div>
                    <div className="font-bold">{summary.remark}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Semester Result */}
              <div className="flex justify-center pt-4">
                <PDFDownloadLink
                  document={
                    <NewResultTemplate
                      studentData={studentData}
                      courses={courses}
                      summary={pdfSummary}
                      schoolInfo={user.school!}
                    />
                  }
                  fileName={`${studentDataa!.name.replace(/\s+/g, '_')}-${session}-${semester}-result.pdf`}
                >
                  {({ loading }) => (
                    <Button disabled={loading}>
                      {loading ? 'Generating PDF...' : 'Download Semester Result'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Transcript Section */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          {transcriptSummaries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No transcript available yet.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Classification</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transcriptSummaries.map((s, id) => (
                      <TableRow key={id}>
                        <TableCell>{s.session}</TableCell>
                        <TableCell>{s.semester}</TableCell>
                        <TableCell>{s.GPA.toFixed(2)}</TableCell>
                        <TableCell>{s.CGPA.toFixed(2)}</TableCell>
                        <TableCell>{scoreToComment(gradingTemplate!, s.CGPA)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Download Transcript */}
              <div className="flex justify-center pt-4">
                <PDFDownloadLink
                  document={
                    <TranscriptTemplate
                      studentData={studentData}
                      summaries={transcriptSummaries}
                    />
                  }
                  fileName={`${studentDataa!.name.replace(/\s+/g, '_')}-transcript.pdf`}
                >
                  {({ loading }) => (
                    <Button disabled={loading}>
                      {loading ? 'Generating PDF...' : 'Download Transcript'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;