import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    queryClient.removeQueries();
    navigate("/auth", { replace: true });
  };

  return logout;
}
