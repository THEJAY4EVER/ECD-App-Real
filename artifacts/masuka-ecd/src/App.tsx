import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import SettingsPage from "@/pages/settings";
import StudentHome from "@/pages/student/home";
import StudentLessons from "@/pages/student/lessons";
import LessonDetail from "@/pages/student/lesson-detail";
import StudentAssignments from "@/pages/student/assignments";
import StudentAssignmentDetail from "@/pages/student/assignment-detail";
import StudentStories from "@/pages/student/stories";
import StoryDetail from "@/pages/student/story-detail";
import StudentGames from "@/pages/student/games";
import GamePlay from "@/pages/student/game-play";
import StudentDraw from "@/pages/student/draw";
import { MusicProvider } from "@/lib/music";
import TeacherHome from "@/pages/teacher/home";
import TeacherAssignments from "@/pages/teacher/assignments";
import TeacherAssignmentDetail from "@/pages/teacher/assignment-detail";
import TeacherStudents from "@/pages/teacher/students";
import StudentProgress from "@/pages/teacher/student-progress";
import TeacherMaterials from "@/pages/teacher/materials";
import StudentMaterials from "@/pages/student/materials";
import AdminHome from "@/pages/admin/home";
import AdminUsers from "@/pages/admin/users";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: false } },
});

function Routes() {
  const { user, isLoading } = useAuth();
  const [loc, navigate] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (!user && loc !== "/login") navigate("/login");
    if (user && loc === "/login") navigate("/");
  }, [user, isLoading, loc, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-4xl animate-pulse">🌳</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route component={LoginPage} />
      </Switch>
    );
  }

  if (user.role === "admin") {
    return (
      <Switch>
        <Route path="/" component={AdminHome} />
        <Route path="/users" component={AdminUsers} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  if (user.role === "teacher") {
    return (
      <Switch>
        <Route path="/" component={TeacherHome} />
        <Route path="/assignments" component={TeacherAssignments} />
        <Route path="/assignments/:id" component={TeacherAssignmentDetail} />
        <Route path="/students" component={TeacherStudents} />
        <Route path="/students/:id" component={StudentProgress} />
        <Route path="/materials" component={TeacherMaterials} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={StudentHome} />
      <Route path="/materials" component={StudentMaterials} />
      <Route path="/lessons" component={StudentLessons} />
      <Route path="/lessons/:id" component={LessonDetail} />
      <Route path="/stories" component={StudentStories} />
      <Route path="/stories/:id" component={StoryDetail} />
      <Route path="/games" component={StudentGames} />
      <Route path="/games/:slug" component={GamePlay} />
      <Route path="/draw" component={StudentDraw} />
      <Route path="/assignments" component={StudentAssignments} />
      <Route path="/assignments/:id" component={StudentAssignmentDetail} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <I18nProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AuthProvider>
                <MusicProvider>
                  <Routes />
                </MusicProvider>
              </AuthProvider>
            </WouterRouter>
          </I18nProvider>
        </ThemeProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
