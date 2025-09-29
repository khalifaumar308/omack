import { useState, useMemo } from "react";
import { useUser } from "@/contexts/useUser";
import {
  useGetSemesterResult,
  useGetTranscript,
  useGetGradingTemplates
} from "@/lib/api/queries";
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
import ResultTemplate from "@/components/ResultTemplate";
import type { PDFProps as ResultPDFProps } from "@/components/ResultTemplate";
import TranscriptTemplate from "@/components/TranscriptTemplate";
import type { TranscriptProps } from "@/components/TranscriptTemplate";
import type {
  StudentsSemesterResultsResponse,
  ResultSummary,
  PopulatedStudent,
  PopulatedDepartment,
  PopulatedFaculty,
  GradingTemplate
} from "@/components/types";
import { scoreToComment } from "@/lib/utils";
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
  const { data: gradingTemplatesRaw } = useGetGradingTemplates();
  // const gradingTemplates = Array.isArray(gradingTemplatesRaw) ? gradingTemplatesRaw : [];

  // const { data: semesterResults = [], isLoading: semesterLoading } = useGetStudentsSemesterResults(semester, session);
  const { data: semesterResult, isLoading: semesterLoading } = useGetSemesterResult(semester, session); // To refetch on semester/session change
  const { data: transcript = [], isLoading: transcriptLoading } = useGetTranscript();
  console.log(gradingTemplatesRaw);
  const currentUser = user && user.role === 'student' ? (user as PopulatedStudent) : null;
  const currentResult = semesterResult as StudentsSemesterResultsResponse | undefined; // Assume only current student's data

  // Find grading template for student's department
  const departmentId = currentUser?.department && typeof currentUser.department === 'object' ? currentUser.department.id : currentUser?.department;
  const gradingTemplate = (gradingTemplatesRaw ? (JSON.parse(JSON.stringify(gradingTemplatesRaw)) as GradingTemplate[]) : []).find(
    (tpl) => (typeof tpl.department === 'string' ? tpl.department : tpl.department?.id) === departmentId
  );
  const gradeBands = useMemo(() => gradingTemplate?.gradeBands || [], [gradingTemplate]);

  // Student data for PDFs - compute always, null if no user
  const studentData = useMemo<ResultPDFProps['studentData'] & TranscriptProps['studentData'] | null>(() => {
    if (!currentUser) return null;
    const department = currentUser.department as unknown as PopulatedDepartment;
    const faculty = (department?.faculty as unknown as PopulatedFaculty) || { name: '' };
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return {
      lastUpdated: now,
      matric: currentUser.matricNo,
      name: currentUser.name,
      session, // For semester PDF
      programme: department?.name || '',
      semester, // For semester PDF
      department: department?.name || '',
      level: currentUser.level?.toString() || '',
      faculty: faculty.name || '',
      approvalStatus: 'approved',
    };
  }, [currentUser, session, semester]);

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
      const remark = scoreToComment(gradingTemplate!, s.GPA);
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

  if (userLoading || semesterLoading || transcriptLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user || user.role !== 'student' || !studentData) {
    return <div className="container mx-auto p-6">Access denied. Student only.</div>;
  }

  const sessions = user.school?.sessions || ['2023/2024', '2024/2025', '2025/2026'];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Semester Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Semester Results</span>
            <div className="flex gap-4">
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First">First Semester</SelectItem>
                  <SelectItem value="Second">Second Semester</SelectItem>
                </SelectContent>
              </Select>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger className="w-40">
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
              <div className="overflow-x-auto mb-6">
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
                        <TableCell className="max-w-xs">{course.title}</TableCell>
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
                    <ResultTemplate
                      studentData={studentData}
                      courses={courses}
                      summary={pdfSummary}
                    />
                  }
                  fileName={`${currentUser!.name.replace(/\s+/g, '_')}-${session}-${semester}-result.pdf`}
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
                    {transcriptSummaries.map((s) => (
                      <TableRow key={s.id}>
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
                  fileName={`${currentUser!.name.replace(/\s+/g, '_')}-transcript.pdf`}
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