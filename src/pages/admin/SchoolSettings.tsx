import { useState } from "react";
import { useUser } from "@/contexts/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect } from "react";
import { useUpdateSchool } from "@/lib/api/mutations";

export default function SchoolSettings() {
  const { user } = useUser();
  const school = user?.school;
  const [currentSemester, setCurrentSemester] = useState(school?.currentSemester || "First");
  const [currentSession, setCurrentSession] = useState(school?.currentSession || "2025/2026");
  const [registrationStatus, setRegistrationStatus] = useState(school?.registrationStatus ? "open" : "closed");
  const [registrationScope, setRegistrationScope] = useState<string>(school?.registrationScope || "both");
  const [sessions, setSessions] = useState<string[]>(school?.sessions || []);
  const [newSession, setNewSession] = useState("");
  const [logo, setLogo] = useState<string>(school?.logo || "");
  const [address, setAddress] = useState<string>(school?.address || "");
  const [contactEmail, setContactEmail] = useState<string>(school?.email || "");
  const updateSchoolMutation = useUpdateSchool();

  useEffect(() => {
    if (updateSchoolMutation.isSuccess) {
      toast.success("School settings updated");
    }
  }, [updateSchoolMutation.isSuccess]);

  const handleAddSession = () => {
    if (newSession && !sessions.includes(newSession)) {
      setSessions([...sessions, newSession]);
      setNewSession("");
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogo(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolMutation.mutate({
      schoolId: school?.id || "",
      schoolData: {
        currentSemester,
        currentSession,
        address,
        email: contactEmail,
        registrationStatus: registrationStatus === "open",
  registrationScope: registrationScope as "firstSemester" | "secondSemester" | "both",
        sessions,
        logo,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>School Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">School Email</Label>
                <Input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="admin@school.edu" />
                <p className="text-xs text-muted-foreground mt-1">Primary contact email for the school.</p>
              </div>
              <div>
                <Label className="mb-2">Address</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, City, Country" />
                <p className="text-xs text-muted-foreground mt-1">Physical address displayed on reports.</p>
              </div>

              <div>
                <Label className="mb-2">Current Semester</Label>
                <Select value={currentSemester} onValueChange={setCurrentSemester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First">First</SelectItem>
                    <SelectItem value="Second">Second</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Current Session</Label>
                <Select value={currentSession} onValueChange={setCurrentSession}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((sess) => (
                      <SelectItem key={sess} value={sess}>{sess}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Registration Status</Label>
                <Select value={registrationStatus} onValueChange={setRegistrationStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Registration Scope</Label>
                <Select value={registrationScope} onValueChange={setRegistrationScope}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both Semesters</SelectItem>
                    <SelectItem value="firstSemester">First Semester Only</SelectItem>
                    <SelectItem value="secondSemester">Second Semester Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2">Sessions</Label>
              <div className="flex gap-2 mb-2">
                <Input value={newSession} onChange={e => setNewSession(e.target.value)} placeholder="Add session (e.g. 2026/2027)" />
                <Button type="button" onClick={handleAddSession}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sessions.map(sess => (
                  <span key={sess} className="px-2 py-1 bg-gray-100 rounded text-xs">{sess}</span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-1">
                <Label>Logo</Label>
                <Input type="file" accept="image/*" onChange={handleLogoChange} />
                {logo && <img src={logo} alt="School Logo" className="mt-2 h-16 rounded" />}
              </div>
              <div className="flex-1">
                <div className="p-4 border border-dashed rounded bg-gray-50">
                  <div className="text-sm font-medium">Preview</div>
                  <div className="text-xs text-muted-foreground mt-2">A small preview of the school logo and contact info.</div>
                  <div className="mt-3">
                    {logo ? (
                      <img src={logo} alt="logo preview" className="h-12" />
                    ) : (
                      <div className="text-xs text-muted-foreground">No logo uploaded</div>
                    )}
                    <div className="mt-2 text-sm">
                      <div className="font-medium">{school?.name}</div>
                      <div className="text-xs text-muted-foreground">{contactEmail || school?.email}</div>
                      <div className="text-xs text-muted-foreground">{address || school?.address}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateSchoolMutation.isPending}>
                {updateSchoolMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
