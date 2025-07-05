import {
  Menu,
  Home,
  Globe,
  Users,
  BookOpen,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router";

import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { to: "/", label: "Website", icon: Globe },
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/dashboard/lessons", label: "Lessons", icon: BookOpen },
  { to: "/dashboard/exams", label: "Exams", icon: FileText },
  { to: "/dashboard/questions", label: "Questions", icon: HelpCircle },
  { to: "/dashboard/students", label: "Students", icon: Users },
];

export default function SidebarSheet() {
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden p-2 rounded hover:bg-muted transition">
        <Menu className="size-6" />
      </SheetTrigger>

      <SheetContent side="left" className="w-64 bg-background text-foreground">
        <SheetTitle className="p-2.5 text-xl font-bold">Dashboard</SheetTitle>

        <div className="px-3 space-y-2">
          {links.map(({ to, label, icon }) => {
            const Icon = icon;
            return (
              <Link
                to={to}
                key={label}
                className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition"
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
