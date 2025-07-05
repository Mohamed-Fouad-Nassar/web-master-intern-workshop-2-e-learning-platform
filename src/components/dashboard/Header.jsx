import Logo from "@/components/Logo";
import UserButton from "@/components/UserButton";
import ThemeToggle from "@/components/ThemeToggle";
import SidebarSheet from "@/components/dashboard/SidebarSheet";

export default function Header() {
  return (
    <header className="border-b py-3 px-4 md:px-6 flex items-center justify-between gap-3">
      <div className="h-8 flex items-center gap-3">
        <SidebarSheet />
        <Logo />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
