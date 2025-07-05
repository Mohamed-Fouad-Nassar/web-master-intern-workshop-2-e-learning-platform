import { Users, BookOpen, FileQuestion, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: "Students",
      icon: <Users className="text-primary" />,
      value: stats?.students ?? 0,
    },
    {
      title: "Lessons",
      icon: <BookOpen className="text-primary" />,
      value: stats?.lessons ?? 0,
    },
    {
      title: "Exams",
      icon: <ListChecks className="text-primary" />,
      value: stats?.exams ?? 0,
    },
    {
      title: "Questions",
      icon: <FileQuestion className="text-primary" />,
      value: stats?.questions ?? 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="bg-card text-card-foreground shadow-sm border border-border"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
