import { useState, useMemo } from "react";
import {
  useCreateGradingTemplate,
  useDeleteGradingTemplate,
  useUpdateGradingTemplate,
} from "@/lib/api/mutations";
import {
  useGetDepartments,
  useGetGradingTemplates,
} from "@/lib/api/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import type { GradeBand as AppGradeBand, PopulatedDepartment } from "@/components/types";


// --- Types ---
type GradeBand = AppGradeBand;
type Department = PopulatedDepartment;
type GradingTemplate = {
  _id: string;
  name: string;
  department: string | Department;
  gradeBands: GradeBand[];
};

const GradingTemplates = () => {
  const { data: templatesRaw, isLoading, isError } = useGetGradingTemplates();
  const { data: departmentsRaw } = useGetDepartments();
  const createGradingTemplate = useCreateGradingTemplate();
  const updateGradingTemplate = useUpdateGradingTemplate();
  const deleteGradingTemplate = useDeleteGradingTemplate();

  // Type guards
  const templates: GradingTemplate[] = useMemo(() => Array.isArray(templatesRaw) ? templatesRaw : [], [templatesRaw]);
  const departments: Department[] = useMemo(() => Array.isArray(departmentsRaw) ? departmentsRaw : [], [departmentsRaw]);

  // Search/filter state
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string>("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<GradingTemplate | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    department: "",
    grades: "",
  });

  // Reset form when modal closes/opens
  const handleOpenModal = (template?: GradingTemplate) => {
    if (template) {
      setEditTemplate(template);
      setForm({
        name: template.name,
        department: typeof template.department === "string"
          ? template.department
          : template.department?.id || "",
        grades: (template.gradeBands || [])
          .map((g) => `${g.grade}:${g.minScore}-${g.maxScore}:${g.point}`)
          .join(", "),
      });
    } else {
      setEditTemplate(null);
      setForm({ name: "", department: "", grades: "" });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTemplate(null);
    setForm({ name: "", department: "", grades: "" });
  };

  // Parse grades string to array (format: A:70-100:5, B:60-69:4, ...)
  const parseGrades = (gradesStr: string): GradeBand[] => {
    return gradesStr
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean)
      .map((g) => {
        // Accepts format: grade:min-max:point (e.g. A:70-100:5)
        const [grade, range, pointStr] = g.split(":");
        const [minScore, maxScore] = (range || "").split("-").map(Number);
        const point = pointStr !== undefined ? Number(pointStr) : 0;
        return { grade: (grade || "").trim(), minScore, maxScore, point };
      })
      .filter((g) => g.grade && !isNaN(g.minScore) && !isNaN(g.maxScore) && !isNaN(g.point));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      department: form.department,
      gradeBands: parseGrades(form.grades),
    };
    try {
      if (editTemplate) {
        await updateGradingTemplate.mutateAsync({
          id: editTemplate._id,
          data: payload,
        });
        toast.success("Template updated!");
      } else {
        await createGradingTemplate.mutateAsync(payload);
        toast.success("Template created!");
      }
      handleCloseModal();
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to save template");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this grading template?")) return;
    try {
      await deleteGradingTemplate.mutateAsync(id);
      toast.success("Template deleted!");
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to delete template");
    }
  };

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
  const matchesDept = !filterDept || (typeof t.department === "string" ? t.department === filterDept : t.department?.id === filterDept);
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (typeof t.department === "object" && t.department?.name?.toLowerCase().includes(search.toLowerCase()));
      return matchesDept && matchesSearch;
    });
  }, [templates, search, filterDept]);

  // Summary
  const totalTemplates = templates.length;
  const coveredDepartments = useMemo(() => {
    const ids = new Set(
      templates.map((t) =>
        typeof t.department === "string"
          ? t.department
          : t.department?.id || ""
      )
    );
    return ids.size;
  }, [templates]);

  // Responsive table
  return (
    <div className="max-w-6xl mx-auto px-2 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <Card className="flex-1 bg-white text-slate-800 shadow border border-slate-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-700">Grading Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <span className="font-semibold text-2xl text-slate-800">{totalTemplates}</span>{" "}
                <span className="text-slate-500">templates</span>
              </div>
              <div>
                <span className="font-semibold text-2xl text-slate-800">{coveredDepartments}</span>{" "}
                <span className="text-slate-500">departments covered</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-end md:items-center md:justify-end w-full md:w-auto">
          <Button
            className="gap-2 bg-slate-800 text-white shadow hover:bg-slate-700 transition"
            onClick={() => handleOpenModal()}
          >
            <Plus size={18} /> New Template
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-2 md:p-4 overflow-x-auto border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
          <Input
            placeholder="Search by name or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs bg-slate-50 border-slate-200 text-slate-700"
          />
          <select
            className="border border-slate-200 rounded px-2 py-2 max-w-xs bg-slate-50 text-slate-700"
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-2 items-center border-b py-3">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-40 bg-slate-200 rounded" />
                <div className="h-8 w-20 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-500">Failed to load templates.</div>
        ) : (
          <table className="min-w-[600px] w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-2 px-2 text-left text-slate-700">Name</th>
                <th className="py-2 px-2 text-left text-slate-700">Department</th>
                <th className="py-2 px-2 text-left text-slate-700">Grades</th>
                <th className="py-2 px-2 text-left text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="py-2 px-2 font-medium text-slate-800">{t.name}</td>
                  <td className="py-2 px-2 text-slate-700">
                    {typeof t.department === "object"
                      ? t.department?.name
                      : departments.find((d) => d.id === t.department)?.name ||
                        "-"}
                  </td>
                  <td className="py-2 px-2 text-slate-700">
                    {(t.gradeBands || [])
                      .map(
                        (g) =>
                          `${g.grade}: ${g.minScore}-${g.maxScore} (${g.point})`
                      )
                      .join(", ")}
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-100"
                      onClick={() => handleOpenModal(t)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="border-slate-200 bg-white text-red-700 hover:bg-slate-100"
                      onClick={() => handleDelete(t._id)}
                      disabled={deleteGradingTemplate.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredTemplates.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    No grading templates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for create/update */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>
              {editTemplate ? "Update Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-slate-700">Name</label>
              <Input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Standard Grading"
                className="bg-slate-50 border-slate-200 text-slate-700"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-700">Department</label>
              <select
                required
                className="w-full border border-slate-200 rounded px-2 py-2 bg-slate-50 text-slate-700"
                value={form.department}
                onChange={(e) =>
                  setForm((f) => ({ ...f, department: e.target.value }))
                }
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-700">
                Grades <span className="text-xs text-slate-500">(e.g. A:70-100:5, B:60-69:4, C:50-59:3)</span>
              </label>
              <Input
                required
                value={form.grades}
                onChange={(e) =>
                  setForm((f) => ({ ...f, grades: e.target.value }))
                }
                placeholder="A:70-100:5, B:60-69:4, C:50-59:3"
                className="bg-slate-50 border-slate-200 text-slate-700"
              />
              <div className="text-xs text-slate-500 mt-1">
                Format: <code>Grade:MinScore-MaxScore:Point</code> (e.g. <code>A:70-100:5</code>)
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-slate-800 text-white hover:bg-slate-700"
                disabled={
                  createGradingTemplate.isPending ||
                  updateGradingTemplate.isPending
                }
              >
                {editTemplate
                  ? updateGradingTemplate.isPending
                    ? "Updating..."
                    : "Update"
                  : createGradingTemplate.isPending
                  ? "Creating..."
                  : "Create"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradingTemplates;