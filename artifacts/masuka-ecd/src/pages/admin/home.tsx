import { Shell } from "@/components/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Users, GraduationCap, UserPlus, Settings } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminHome() {
  const { data: stats, isLoading } = useGetAdminStats();
  const [, navigate] = useLocation();

  return (
    <Shell title="Admin Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">Platform Overview</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Masuka Junior School ECD</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {isLoading ? "—" : stats?.teacherCount ?? 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Teachers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {isLoading ? "—" : stats?.studentCount ?? 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start gap-3"
              variant="outline"
              onClick={() => navigate("/users")}
              data-testid="btn-manage-users"
            >
              <Users className="w-4 h-4" />
              Manage Teachers &amp; Students
            </Button>
            <Button
              className="w-full justify-start gap-3"
              variant="outline"
              onClick={() => navigate("/users?action=create&role=teacher")}
            >
              <UserPlus className="w-4 h-4" />
              Add New Teacher
            </Button>
            <Button
              className="w-full justify-start gap-3"
              variant="outline"
              onClick={() => navigate("/users?action=create&role=student")}
            >
              <UserPlus className="w-4 h-4" />
              Add New Student
            </Button>
            <Button
              className="w-full justify-start gap-3"
              variant="outline"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-4 h-4" />
              App Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
              Admin Note: Passwords generated for new accounts are shown only once. Save them securely before closing the dialog.
            </p>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
