import { Loader2 } from "lucide-react";

import StatsCards from "@/features/admin/StatsCards";
import AddExamModal from "@/features/admin/exams/AddExamModal";
import AddLessonModal from "@/features/admin/lessons/AddLessonModal";
import AddQuestionModal from "@/features/admin/questions/AddQuestionModal";

import { useLessons } from "@/hooks/admin/useLessons";
import { useAllUsers } from "@/hooks/admin/useAllUsers";
import { useExams } from "@/hooks/admin/exams/useExams";
// import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import { useQuestions } from "@/hooks/admin/questions/useQuestions";

// import { Cards, SAdminActions } from "../SuperAdmin";

export default function DashboardHome() {
  const { data: exams = [], isLoading: loadingExams } = useExams();
  const { data: users = [], isLoading: loadingUsers } = useAllUsers();
  const { data: lessons = [], isLoading: loadingLessons } = useLessons();
  const { data: questions = [], isLoading: loadingQuestions } = useQuestions();

  const isLoading =
    loadingUsers || loadingLessons || loadingExams || loadingQuestions;

  const stats = {
    exams: exams.length,
    lessons: lessons.length,
    questions: questions.length,
    students: users.filter((u) => u.role === "user").length,
  };

  // const sAdmin = useIsSuperAdmin();
  // const data = [
  //   {
  //     title: "Students",
  //     value: users.length,
  //     icon: <Users className="text-primary" />,
  //   },
  //   {
  //     title: "Admins",
  //     value: admins.length,
  //     icon: <UserCog className="text-primary" />,
  //   },
  // ];

  return (
    <div className="space-y-6 px-4 py-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* {isLoading ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : sAdmin ? (
        <Cards {...{ data }} />
      ) : (
        <StatsCards stats={stats} />
      )} */}

      {isLoading ? (
        <Loader2 className="animate-spin size-8 mx-auto my-28" />
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* <div className="mt-6">
        {sAdmin ? (
          <SAdminActions />
        ) : (
          <div className="flex gap-4 items-center">
            <AddExamModal />
            <AddLessonModal />
            <AddQuestionModal />
          </div>
        )}
      </div> */}

      <div className="flex gap-4 items-center">
        <AddExamModal />
        <AddLessonModal />
        <AddQuestionModal />
      </div>
    </div>
  );
}
