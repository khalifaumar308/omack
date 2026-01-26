import { useEffect, useState } from "react";
import { useUser } from "@/contexts/useUser";
import { toast } from "sonner";
import { Edit, Trash2, Check, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useUpdateSchool, useSetSchoolResultsRelease, useUploadLogoMutation } from "@/lib/api/mutations";
import { useGetSchoolResultsRelease } from "@/lib/api/queries";
export default function SchoolSettings() {
  const { user } = useUser();
  const school = user?.school;

  // Academic settings
  const [currentSemester, setCurrentSemester] = useState<"First" | "Second">(school?.currentSemester === "Second" ? "Second" : "First");
  const [currentSession, setCurrentSession] = useState(school?.currentSession || "2025/2026");
  const [registrationStatus, setRegistrationStatus] = useState(school?.registrationStatus ? "open" : "closed");
  const [registrationScope, setRegistrationScope] = useState<"firstSemester" | "secondSemester" | "both">(
    school?.registrationScope ?? "both"
  );

  // Profile
  const [sessions, setSessions] = useState<string[]>(school?.sessions || []);
  const [levels, setLevels] = useState<string[]>((school?.levels as unknown as string[]) || []);
  const [newSession, setNewSession] = useState("");
  const [newLevel, setNewLevel] = useState("");

  const [editingLevelIndex, setEditingLevelIndex] = useState<number | null>(null);
  const [editingLevelValue, setEditingLevelValue] = useState("");

  // Contact + branding
  const [logo, setLogo] = useState(school?.logo || "");
  const [address, setAddress] = useState(school?.address || "");
  const [contactEmail, setContactEmail] = useState(school?.email || "");
  const [phone, setPhone] = useState(school?.phone || "");

  // Mutations
  const updateSchoolMutation = useUpdateSchool();

  useEffect(() => {
    // side-effect: show success toast when updateSchoolMutation succeeds
    if (updateSchoolMutation.isSuccess) {
      toast.success("School settings updated");
    }
  }, [updateSchoolMutation.isSuccess]);

  // Results Release (Admin)
  const schoolId = school?.id || "";
  const [releaseSemester, setReleaseSemester] = useState<"First" | "Second">(currentSemester);
  const [releaseSession, setReleaseSession] = useState(currentSession);
  const { data: releaseStatus } = useGetSchoolResultsRelease(schoolId, releaseSession, releaseSemester);
  const { mutate: setResultsRelease, isPending: settingRelease } = useSetSchoolResultsRelease();
  const uploadLogoMutation = useUploadLogoMutation();
  // Helpers
  const handleAddSession = () => {
    const s = newSession.trim();
    if (!s) return;
    if (sessions.includes(s)) {
      toast.error("Session already exists");
      return;
    }
    setSessions((prev) => [...prev, s]);
    setNewSession("");
  };

  const handleAddLevel = () => {
    const val = newLevel.trim();
    if (!val) return;
    if (levels.includes(val)) {
      toast.error("Level already exists");
      return;
    }
    setLevels((prev) => [...prev, val]);
    setNewLevel("");
  };

  const startEditLevel = (index: number) => {
    setEditingLevelIndex(index);
    setEditingLevelValue(levels[index]);
  };

  const saveEditLevel = () => {
    if (editingLevelIndex === null) return;
    const v = editingLevelValue.trim();
    if (!v) return;
    const updated = [...levels];
    updated[editingLevelIndex] = v;
    setLevels(updated);
    setEditingLevelIndex(null);
    setEditingLevelValue("");
  };

  const cancelEditLevel = () => {
    setEditingLevelIndex(null);
    setEditingLevelValue("");
  };

  const removeLevel = (index: number) => {
    const updated = levels.filter((_, i) => i !== index);
    setLevels(updated);
  };
  // Upload file mutation
 

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadLogoMutation.mutate(file, {
      onSuccess: (data) => {
        console.log("Logo uploaded successfully:", data);
        if (data && typeof data.url === 'string') {
          setLogo(data.url);
        }
      },
    });
    
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolMutation.mutate({
      schoolId: schoolId,
      schoolData: {
        currentSemester,
        currentSession,
        address,
        email: contactEmail,
        registrationStatus: registrationStatus === "open",
        registrationScope,
        sessions,
        logo,
        levels,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">School Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Forms */ }
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Current Semester</Label>
                  <Select value={currentSemester} onValueChange={(v) => setCurrentSemester(v as "First" | "Second")}>
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
                  <Label className="mb-2 block">Current Session</Label>
                  <Select value={currentSession} onValueChange={setCurrentSession}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(sessions.length ? sessions : ["2023/2024", "2024/2025", "2025/2026"]).map((sess) => (
                        <SelectItem key={sess} value={sess}>{sess}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Registration Status</Label>
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
                  <Label className="mb-2 block">Registration Scope</Label>
                  <Select
                    value={registrationScope}
                    onValueChange={(v) => setRegistrationScope(v as "firstSemester" | "secondSemester" | "both")}
                  >
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>School Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">School Email</Label>
                  <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="admin@school.edu" />
                </div>
                <div>
                  <Label className="mb-2 block">Phone Number</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="123-456-7890" />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-2 block">Address</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, Country" />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Upload Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={uploadLogoMutation.status === 'pending'}
                    />
                    {uploadLogoMutation.status === 'pending' && <Badge>Uploading...</Badge>}
                    {uploadLogoMutation.status === 'success' && (
                      <Badge variant="secondary">Uploaded</Badge>
                    )}
                    {uploadLogoMutation.status === 'error' && (
                      <Badge variant="destructive">Upload failed</Badge>
                    )}
                  </div>
                  {uploadLogoMutation.status === 'pending' && (
                    <div className="text-xs text-muted-foreground mt-1">Uploading logo, please wait...</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {logo ? (
                    <img src={logo} alt="logo" className="h-12 rounded" />
                  ) : (
                    <div className="text-xs text-muted-foreground">No logo uploaded</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catalogue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Sessions</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newSession}
                      onChange={(e) => setNewSession(e.target.value)}
                      placeholder="Add session (e.g. 2026/2027)"
                    />
                    <Button type="button" onClick={handleAddSession}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-28 overflow-auto p-1 rounded border">
                    {sessions.length === 0 && (
                      <div className="text-xs text-muted-foreground p-2">No sessions configured</div>
                    )}
                    {sessions.map((sess) => (
                      <Badge key={sess} variant="secondary">{sess}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Levels</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value)}
                      placeholder="Add level (e.g. 100)"
                    />
                    <Button type="button" onClick={handleAddLevel}>Add</Button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-auto pr-1">
                    {levels.length === 0 && <div className="text-xs text-muted-foreground">No levels configured</div>}
                    {levels.map((lvl, idx) => (
                      <div key={lvl} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        {editingLevelIndex === idx ? (
                          <div className="flex items-center gap-2 w-full">
                            <Input
                              value={editingLevelValue}
                              onChange={(e) => setEditingLevelValue(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="button" onClick={saveEditLevel}><Check size={14} /></Button>
                            <Button type="button" variant="outline" onClick={cancelEditLevel}><X size={14} /></Button>
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-medium">{lvl}</div>
                            <div className="flex items-center gap-2">
                              <Button type="button" variant="ghost" onClick={() => startEditLevel(idx)}><Edit size={14} /></Button>
                              <Button type="button" variant="ghost" onClick={() => removeLevel(idx)}><Trash2 size={14} /></Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview / Release / Actions */ }
        <div className="lg:col-span-4">
          <div className="lg:sticky top-20 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  {logo ? (
                    <img src={logo} alt="School Logo" className="h-12 rounded" />
                  ) : (
                    <div className="text-xs text-muted-foreground">No logo uploaded</div>
                  )}
                  <div className="text-sm">
                    <div className="font-medium">{school?.name}</div>
                    <div className="text-xs text-muted-foreground">{contactEmail || school?.email}</div>
                    <div className="text-xs text-muted-foreground">{address || school?.address}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results Release</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="mb-2 block">Semester</Label>
                      <Select value={releaseSemester} onValueChange={(v) => setReleaseSemester(v as "First" | "Second")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First">First Semester</SelectItem>
                          <SelectItem value="Second">Second Semester</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-2 block">Session</Label>
                      <Select value={releaseSession} onValueChange={setReleaseSession}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(sessions.length ? sessions : ["2023/2024", "2024/2025", "2025/2026"]).map((sess) => (
                            <SelectItem key={sess} value={sess}>{sess}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Status:{" "}
                      <span className={releaseStatus?.released ? "text-emerald-600" : "text-amber-600"}>
                        {releaseStatus?.released ? "Released" : "Not Released"}
                      </span>
                      {releaseStatus?.record?.releasedAt && (
                        <span> • {new Date(releaseStatus.record.releasedAt as unknown as string).toLocaleString()}</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!schoolId || settingRelease}
                      onClick={() => {
                        setResultsRelease({
                          schoolId,
                          session: releaseSession,
                          semester: releaseSemester,
                          released: !(releaseStatus?.released ?? false),
                        });
                      }}
                    >
                      {settingRelease
                        ? "Updating..."
                        : releaseStatus?.released
                        ? "Unrelease"
                        : "Release"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant="default"
                  disabled={updateSchoolMutation.isPending}
                  onClick={handleSubmit as unknown as () => void}
                >
                  {updateSchoolMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
