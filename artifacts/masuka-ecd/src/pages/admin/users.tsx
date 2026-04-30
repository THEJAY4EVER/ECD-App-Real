import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useListAdminUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
  useResetAdminUserPassword,
  getListAdminUsersQueryKey,
  type AdminUser,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  UserPlus, Pencil, Trash2, KeyRound, Copy, Eye, EyeOff,
  GraduationCap, Users, RefreshCw, CheckCircle2, XCircle, Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CLASSES = ["ECD A", "ECD B"];

const AVATAR_COLORS = [
  "#F59E0B", "#10B981", "#0EA5E9", "#EC4899",
  "#8B5CF6", "#EF4444", "#F97316", "#06B6D4",
];

type FilterTab = "all" | "teacher" | "student";

function slugPreview(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(".");
}

function PasswordReveal({ password, label }: { password: string; label: string }) {
  const [visible, setVisible] = useState(false);
  const { toast } = useToast();

  function copy() {
    navigator.clipboard.writeText(password).then(() =>
      toast({ title: "Password copied to clipboard" })
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-3 space-y-2">
      <p className="text-xs font-medium text-green-700 dark:text-green-400">{label}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm font-mono bg-white dark:bg-background border rounded px-2 py-1 truncate">
          {visible ? password : "•".repeat(password.length)}
        </code>
        <Button size="icon" variant="ghost" className="shrink-0 h-8 w-8" onClick={() => setVisible(!visible)}>
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button size="icon" variant="ghost" className="shrink-0 h-8 w-8" onClick={copy}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Save this password — it will not be shown again.</p>
    </div>
  );
}

export default function AdminUsers() {
  const [loc] = useLocation();
  const params = new URLSearchParams(loc.includes("?") ? loc.split("?")[1] : "");
  const initialAction = params.get("action");
  const initialRole = (params.get("role") as "teacher" | "student") ?? "teacher";

  const [filter, setFilter] = useState<FilterTab>("all");
  const [showCreate, setShowCreate] = useState(initialAction === "create");
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<{ username: string; password: string } | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    role: initialRole as "teacher" | "student",
    classLevel: "ECD A",
    avatarColor: AVATAR_COLORS[0],
    customUsername: "",
    useCustomUsername: false,
    password: "",
    useCustomPassword: false,
  });

  const [editForm, setEditForm] = useState({
    fullName: "",
    classLevel: "ECD A",
    avatarColor: AVATAR_COLORS[0],
    password: "",
    changePassword: false,
  });

  const [showPrintConfig, setShowPrintConfig] = useState(false);
  const [printClass, setPrintClass] = useState<"all" | "ECD A" | "ECD B">("all");
  const [printLayout, setPrintLayout] = useState<"table" | "slips">("table");
  const [printResetPwds, setPrintResetPwds] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useListAdminUsers();
  const createM = useCreateAdminUser();
  const updateM = useUpdateAdminUser();
  const deleteM = useDeleteAdminUser();
  const resetM = useResetAdminUserPassword();

  useEffect(() => {
    if (initialAction === "create") {
      setShowCreate(true);
      setForm((f) => ({ ...f, role: initialRole }));
    }
  }, [initialAction, initialRole]);

  const filtered = users.filter((u) =>
    filter === "all" ? true : u.role === filter
  );

  function resetCreateForm() {
    setForm({
      fullName: "", role: "teacher", classLevel: "ECD A",
      avatarColor: AVATAR_COLORS[0], customUsername: "",
      useCustomUsername: false, password: "", useCustomPassword: false,
    });
    setCreatedUser(null);
  }

  async function handleCreate() {
    if (!form.fullName.trim()) {
      toast({ title: "Full name is required", variant: "destructive" });
      return;
    }
    try {
      const body: Parameters<typeof createM.mutateAsync>[0]["data"] = {
        fullName: form.fullName.trim(),
        role: form.role,
        classLevel: form.role === "student" ? form.classLevel : null,
        avatarColor: form.avatarColor,
      };
      if (form.useCustomUsername && form.customUsername.trim()) {
        body.username = form.customUsername.trim().toLowerCase();
      }
      if (form.useCustomPassword && form.password.trim()) {
        body.password = form.password.trim();
      }
      const result = await createM.mutateAsync({ data: body });
      qc.invalidateQueries({ queryKey: getListAdminUsersQueryKey() });
      setCreatedUser({ username: result.username, password: result.password });
      toast({ title: `${result.fullName} created successfully` });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to create user";
      toast({ title: msg, variant: "destructive" });
    }
  }

  async function handleUpdate() {
    if (!editUser) return;
    if (editForm.changePassword && editForm.password.trim().length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    try {
      const body: Parameters<typeof updateM.mutateAsync>[0]["data"] = {
        fullName: editForm.fullName.trim() || undefined,
        classLevel: editUser.role === "student" ? editForm.classLevel || null : undefined,
        avatarColor: editForm.avatarColor,
      };
      if (editForm.changePassword && editForm.password.trim()) {
        body.password = editForm.password.trim();
      }
      await updateM.mutateAsync({ id: editUser.id, data: body });
      qc.invalidateQueries({ queryKey: getListAdminUsersQueryKey() });
      setEditUser(null);
      toast({ title: "User updated" });
    } catch {
      toast({ title: "Failed to update user", variant: "destructive" });
    }
  }

  async function handleToggleActive(u: AdminUser) {
    try {
      await updateM.mutateAsync({ id: u.id, data: { isActive: !u.isActive } });
      qc.invalidateQueries({ queryKey: getListAdminUsersQueryKey() });
      toast({ title: u.isActive ? `${u.fullName} disabled` : `${u.fullName} re-enabled` });
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteM.mutateAsync({ id: deleteTarget.id });
      qc.invalidateQueries({ queryKey: getListAdminUsersQueryKey() });
      setDeleteTarget(null);
      toast({ title: `${deleteTarget.fullName} deleted` });
    } catch {
      toast({ title: "Failed to delete user", variant: "destructive" });
    }
  }

  async function handleReset() {
    if (!resetTarget) return;
    try {
      const result = await resetM.mutateAsync({ id: resetTarget.id });
      setNewPassword(result.password);
      toast({ title: "Password reset successfully" });
    } catch {
      toast({ title: "Failed to reset password", variant: "destructive" });
    }
  }

  function openEdit(u: AdminUser) {
    setEditForm({
      fullName: u.fullName,
      classLevel: u.classLevel ?? "ECD A",
      avatarColor: u.avatarColor ?? AVATAR_COLORS[0],
      password: "",
      changePassword: false,
    });
    setEditUser(u);
  }

  function escHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function handleGeneratePrint() {
    const targets = users.filter((u) => {
      if (u.role !== "student") return false;
      if (printClass === "all") return true;
      return u.classLevel === printClass;
    });

    if (targets.length === 0) {
      toast({ title: "No students found for the selected class", variant: "destructive" });
      return;
    }

    setIsPrinting(true);
    try {
      type CredRow = { fullName: string; username: string; classLevel: string | null; password: string };
      let rows: CredRow[] = [];

      if (printResetPwds) {
        const settled = await Promise.allSettled(
          targets.map((u) =>
            resetM.mutateAsync({ id: u.id }).then((r) => ({
              fullName: u.fullName,
              username: u.username,
              classLevel: u.classLevel ?? null,
              password: r.password,
            }))
          )
        );
        qc.invalidateQueries({ queryKey: getListAdminUsersQueryKey() });
        const failed = settled.filter((s) => s.status === "rejected").length;
        if (failed > 0) {
          toast({
            title: `${failed} password reset(s) failed — sheet shows "—" for those students`,
            variant: "destructive",
          });
        }
        rows = settled.map((s, i) =>
          s.status === "fulfilled"
            ? s.value
            : {
                fullName: targets[i].fullName,
                username: targets[i].username,
                classLevel: targets[i].classLevel ?? null,
                password: "—",
              }
        );
      } else {
        rows = targets.map((u) => ({
          fullName: u.fullName,
          username: u.username,
          classLevel: u.classLevel ?? null,
          password: "—",
        }));
      }

      const classTitle = printClass === "all" ? "All Students" : printClass;
      const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

      const tableHtml = `
        <table>
          <thead>
            <tr><th>#</th><th>Full Name</th><th>Class</th><th>Username</th><th>Password</th></tr>
          </thead>
          <tbody>
            ${rows.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${escHtml(r.fullName)}</td>
                <td>${escHtml(r.classLevel ?? "—")}</td>
                <td class="mono">${escHtml(r.username)}</td>
                <td class="mono">${escHtml(r.password)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      const slipsHtml = rows.map((r) => `
        <div class="slip">
          <div class="slip-school">MASUKA JUNIOR SCHOOL ECD</div>
          <div class="slip-row"><span class="slip-label">Name:</span> <span class="slip-value">${escHtml(r.fullName)}</span></div>
          <div class="slip-row"><span class="slip-label">Class:</span> <span class="slip-value">${escHtml(r.classLevel ?? "—")}</span></div>
          <div class="slip-row"><span class="slip-label">Username:</span> <span class="slip-value mono">${escHtml(r.username)}</span></div>
          <div class="slip-row"><span class="slip-label">Password:</span> <span class="slip-value mono">${escHtml(r.password)}</span></div>
        </div>
      `).join("");

      const pw = window.open("", "_blank", "width=900,height=700");
      if (!pw) {
        toast({ title: "Please allow pop-ups to print", variant: "destructive" });
        return;
      }

      pw.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Class List – ${classTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #111; background: #fff; padding: 20px; }
    .no-print { margin-bottom: 16px; }
    @media print { .no-print { display: none !important; } }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .header p { font-size: 12px; color: #555; margin-top: 4px; }
    .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { background: #f0f0f0; border: 1px solid #ccc; padding: 6px 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { border: 1px solid #ccc; padding: 6px 8px; }
    tr:nth-child(even) td { background: #fafafa; }
    .mono { font-family: "Courier New", monospace; }
    /* Slips */
    .slips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .slip { border: 1.5px dashed #888; border-radius: 6px; padding: 10px 12px; }
    .slip-school { font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; color: #444; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    .slip-row { display: flex; gap: 6px; margin-top: 4px; font-size: 12px; }
    .slip-label { font-weight: bold; min-width: 70px; color: #555; }
    .slip-value { flex: 1; }
    /* Buttons */
    .btn { display: inline-block; padding: 8px 18px; background: #1a1a2e; color: #fff; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; margin-right: 8px; }
    .btn-outline { background: transparent; color: #333; border: 1px solid #aaa; }
    .note { font-size: 11px; color: #888; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="no-print" style="display:flex;align-items:center;gap:8px;">
    <button class="btn" onclick="window.print()">&#128438; Print</button>
    <button class="btn btn-outline" onclick="window.close()">Close</button>
    <span class="note">${printResetPwds ? "Passwords have been reset — save this sheet." : "Passwords not shown. Reset individual passwords from the admin panel."}</span>
  </div>
  <div class="header">
    <h1>Masuka Junior School ECD</h1>
    <p>Class List &mdash; ${classTitle} &mdash; ${dateStr}</p>
  </div>
  ${printLayout === "table" || printLayout === "slips" ? `<div class="section-title">Student Login Details</div>` : ""}
  ${printLayout === "table" ? tableHtml : ""}
  ${printLayout === "slips" ? `<div class="slips-grid">${slipsHtml}</div>` : ""}
</body>
</html>`);
      pw.document.close();
      setShowPrintConfig(false);
    } catch {
      toast({ title: "Failed to generate print sheet", variant: "destructive" });
    } finally {
      setIsPrinting(false);
    }
  }

  const autoUsername = slugPreview(form.fullName);

  return (
    <Shell title="Manage Users">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Users</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPrintConfig(true)}
              data-testid="btn-print-class-list"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print class list
            </Button>
            <Button size="sm" onClick={() => { resetCreateForm(); setShowCreate(true); }} data-testid="btn-create-user">
              <UserPlus className="w-4 h-4 mr-1.5" />
              Add User
            </Button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-border">
          {(["all", "teacher", "student"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                filter === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "all" ? "All" : tab === "teacher" ? "Teachers" : "Students"}
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({tab === "all" ? users.length : users.filter((u) => u.role === tab).length})
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">No users yet</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((u) => (
              <div
                key={u.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border bg-card",
                  u.isActive ? "border-border" : "border-border/50 opacity-60"
                )}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 relative"
                  style={{ backgroundColor: u.avatarColor ?? "#64748B" }}
                >
                  {u.fullName[0]}
                  {!u.isActive && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-destructive border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm truncate">{u.fullName}</span>
                    <Badge variant={u.role === "teacher" ? "default" : "secondary"} className="text-xs shrink-0">
                      {u.role === "teacher" ? "Teacher" : "Student"}
                    </Badge>
                    {u.classLevel && (
                      <Badge variant="outline" className="text-xs shrink-0">{u.classLevel}</Badge>
                    )}
                    {!u.isActive && (
                      <Badge variant="destructive" className="text-xs shrink-0">Disabled</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">@{u.username}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn("h-8 w-8", u.isActive ? "text-green-600 hover:text-green-700" : "text-muted-foreground")}
                    onClick={() => handleToggleActive(u)}
                    title={u.isActive ? "Disable account" : "Enable account"}
                    disabled={updateM.isPending}
                  >
                    {u.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(u)} title="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => { setResetTarget(u); setNewPassword(null); }}
                    title="Reset password"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(u)}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create dialog ── */}
      <Dialog
        open={showCreate}
        onOpenChange={(open) => {
          if (!open) { resetCreateForm(); setShowCreate(false); }
        }}
      >
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              {createdUser ? "Account created. Share these credentials with the user." : "Fill in the details to create a new account."}
            </DialogDescription>
          </DialogHeader>

          {createdUser ? (
            <div className="space-y-3">
              <div className="rounded-lg border p-3 space-y-1 text-sm">
                <p><span className="text-muted-foreground">Username:</span> <strong className="font-mono">{createdUser.username}</strong></p>
              </div>
              <PasswordReveal password={createdUser.password} label="Temporary Password (save now)" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. Tendai Moyo"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  data-testid="input-full-name"
                />
              </div>

              <div className="space-y-2">
                <Label>Role <span className="text-destructive">*</span></Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as "teacher" | "student" }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">
                      <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Teacher</span>
                    </SelectItem>
                    <SelectItem value="student">
                      <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Student</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.role === "student" && (
                <div className="space-y-2">
                  <Label>Class Level <span className="text-destructive">*</span></Label>
                  <Select value={form.classLevel} onValueChange={(v) => setForm((f) => ({ ...f, classLevel: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="rounded-lg border border-dashed p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Custom Username</p>
                    <p className="text-xs text-muted-foreground">
                      {form.useCustomUsername ? "Set manually" : `Auto: ${autoUsername || "generated from name"}`}
                    </p>
                  </div>
                  <Switch
                    checked={form.useCustomUsername}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, useCustomUsername: v, customUsername: "" }))}
                  />
                </div>
                {form.useCustomUsername && (
                  <Input
                    placeholder="e.g. t.moyo"
                    value={form.customUsername}
                    onChange={(e) => setForm((f) => ({ ...f, customUsername: e.target.value }))}
                    data-testid="input-custom-username"
                  />
                )}
              </div>

              <div className="rounded-lg border border-dashed p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Custom Password</p>
                    <p className="text-xs text-muted-foreground">
                      {form.useCustomPassword ? "Set manually" : "Auto-generated (shown after creation)"}
                    </p>
                  </div>
                  <Switch
                    checked={form.useCustomPassword}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, useCustomPassword: v, password: "" }))}
                  />
                </div>
                {form.useCustomPassword && (
                  <Input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    data-testid="input-custom-password"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Avatar Colour</Label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, avatarColor: c }))}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-transform",
                        form.avatarColor === c ? "border-foreground scale-125" : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {createdUser ? (
              <Button onClick={() => { resetCreateForm(); setShowCreate(false); }} className="w-full">Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { resetCreateForm(); setShowCreate(false); }}>Cancel</Button>
                <Button onClick={handleCreate} disabled={createM.isPending} data-testid="btn-confirm-create">
                  {createM.isPending ? "Creating…" : "Create Account"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit dialog ── */}
      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) setEditUser(null); }}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update {editUser?.fullName}'s details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1 text-sm rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-muted-foreground text-xs">Username (cannot be changed)</p>
              <p className="font-mono font-medium">@{editUser?.username}</p>
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editForm.fullName}
                onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
              />
            </div>
            {editUser?.role === "student" && (
              <div className="space-y-2">
                <Label>Class Level</Label>
                <Select value={editForm.classLevel} onValueChange={(v) => setEditForm((f) => ({ ...f, classLevel: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Avatar Colour</Label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setEditForm((f) => ({ ...f, avatarColor: c }))}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-transform",
                      editForm.avatarColor === c ? "border-foreground scale-125" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-dashed p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Set a new login password</p>
                </div>
                <Switch
                  checked={editForm.changePassword}
                  onCheckedChange={(v) => setEditForm((f) => ({ ...f, changePassword: v, password: "" }))}
                />
              </div>
              {editForm.changePassword && (
                <Input
                  type="password"
                  placeholder="New password (min. 6 characters)"
                  value={editForm.password}
                  onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                  data-testid="input-edit-password"
                />
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateM.isPending}>
              {updateM.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete dialog ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.fullName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account and all associated data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteM.isPending}
              data-testid="btn-confirm-delete-user"
            >
              {deleteM.isPending ? "Deleting…" : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Reset password dialog ── */}
      <Dialog
        open={!!resetTarget}
        onOpenChange={(open) => {
          if (!open) { setResetTarget(null); setNewPassword(null); }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Reset Password</span>
            </DialogTitle>
            <DialogDescription>
              {newPassword
                ? "New password generated. Save it now — it won't be shown again."
                : `Generate a new random password for ${resetTarget?.fullName}? Their current password will be invalidated immediately.`}
            </DialogDescription>
          </DialogHeader>
          {newPassword && (
            <PasswordReveal password={newPassword} label="New Password (save now)" />
          )}
          <DialogFooter className="gap-2">
            {newPassword ? (
              <Button onClick={() => { setResetTarget(null); setNewPassword(null); }} className="w-full">Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setResetTarget(null)}>Cancel</Button>
                <Button onClick={handleReset} disabled={resetM.isPending} data-testid="btn-confirm-reset-password">
                  {resetM.isPending ? "Resetting…" : "Reset Password"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ── Print config dialog ── */}
      <Dialog open={showPrintConfig} onOpenChange={(open) => { if (!open) setShowPrintConfig(false); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2"><Printer className="w-4 h-4" /> Print Class List</span>
            </DialogTitle>
            <DialogDescription>
              Generate a printable sheet of student login details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={printClass} onValueChange={(v) => setPrintClass(v as typeof printClass)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Layout</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["table", "slips"] as const).map((layout) => (
                  <button
                    key={layout}
                    type="button"
                    onClick={() => setPrintLayout(layout)}
                    className={cn(
                      "rounded-lg border-2 p-3 text-sm font-medium transition-colors text-left",
                      printLayout === layout
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    )}
                  >
                    {layout === "table" ? (
                      <>
                        <div className="font-semibold mb-0.5">Table</div>
                        <div className="text-xs font-normal opacity-70">Rows with all students listed</div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold mb-0.5">Slips</div>
                        <div className="text-xs font-normal opacity-70">Individual cut-out slips</div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className={cn(
              "rounded-lg border p-3 space-y-2",
              printResetPwds ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800" : "border-border"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reset passwords &amp; show on sheet</p>
                  <p className="text-xs text-muted-foreground">Generates new passwords for selected students</p>
                </div>
                <Switch
                  checked={printResetPwds}
                  onCheckedChange={setPrintResetPwds}
                  data-testid="toggle-reset-passwords"
                />
              </div>
              {printResetPwds && (
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Current passwords will be invalidated immediately. New passwords will appear on the printed sheet.
                </p>
              )}
            </div>

            {!printResetPwds && (
              <p className="text-xs text-muted-foreground">
                Without resetting, the password column will show "—". Reset passwords from the admin panel to get known values.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPrintConfig(false)}>Cancel</Button>
            <Button
              onClick={handleGeneratePrint}
              disabled={isPrinting}
              data-testid="btn-generate-print"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              {isPrinting ? "Generating…" : "Generate Print Sheet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
