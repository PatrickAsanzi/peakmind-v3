import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/features/auth/hooks/useAuth";
import Header from "@/shared/components/layout/Header";
import { IndexPage } from "@/features/landing";
import { AuthPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { OrgDashboardPage } from "@/features/orgDashboard";
import { CheckInPage, CheckInCompletePage } from "@/features/checkin";
import { ContentPage } from "@/features/content";
import { ConsentPage } from "@/features/consent";
import { CommunityPage } from "@/features/community";
import { DailyReadingPage } from "@/features/dailyReading";
import { MorningMeditationPage } from "@/features/meditation";
import { ProfessionalsPage } from "@/features/professionals";
import { MyCalendarPage } from "@/features/calendar";
import { FridayReflectionPage } from "@/features/reflection";
import { NotFoundPage } from "@/features/notFound";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-lg">
          <p className="text-lg font-semibold">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />
            <main className="px-4 py-8 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <DashboardPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dashboard/org"
                  element={
                    <RequireAuth>
                      <OrgDashboardPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/check-in"
                  element={
                    <RequireAuth>
                      <CheckInPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/check-in/complete"
                  element={
                    <RequireAuth>
                      <CheckInCompletePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/content"
                  element={
                    <RequireAuth>
                      <ContentPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/consent"
                  element={
                    <RequireAuth>
                      <ConsentPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <RequireAuth>
                      <CommunityPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/daily-reading"
                  element={
                    <RequireAuth>
                      <DailyReadingPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/morning-meditation"
                  element={
                    <RequireAuth>
                      <MorningMeditationPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/professionals"
                  element={
                    <RequireAuth>
                      <ProfessionalsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <RequireAuth>
                      <MyCalendarPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/friday-reflection"
                  element={
                    <RequireAuth>
                      <FridayReflectionPage />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
