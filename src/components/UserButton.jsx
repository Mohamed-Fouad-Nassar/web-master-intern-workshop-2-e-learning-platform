import { Link } from "react-router";
import { ChartPie, LogOut, ShoppingCart, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import useUser from "@/features/auth/useUser";
import useLogout from "@/features/auth/useLogout";

import userAvatar from "@/assets/user-avatar.png";

export default function UserButton() {
  const { data: user } = useUser();
  const { fullName, role } = user;
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer size-10">
          <AvatarImage src={userAvatar} alt="avatar" />
          <AvatarFallback>{fullName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-1">
        <DropdownMenuLabel>logged in as {fullName}</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="size-4 text-inherit" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/cart"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="size-4 text-inherit" />
            <span>Cart</span>
          </Link>
        </DropdownMenuItem>

        {role === "admin" ? (
          <DropdownMenuItem asChild>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 cursor-pointer"
            >
              <ChartPie className="size-4 text-inherit" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            className="w-full flex items-center gap-2 cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 hover:text-red-500 focus:text-red-500 rounded-md px-2 py-1"
            variant="destructive"
            onClick={logout}
          >
            <LogOut className="size-4 text-inherit" />
            <span>Logout</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
