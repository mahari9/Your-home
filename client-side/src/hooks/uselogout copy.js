import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleLogout } from "../services/logout";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate, isLoading } = useMutation({
        mutationFn: handleLogout,
        onSuccess: (res) => {
            if (res.status === "success") {
                queryClient.invalidateQueries({ queryKey: ["userSession"] });
                toast.success(res.message);
                navigate("/login");
            }
            if (res.status === "fail") toast.error(res.message);
            },
        onError: (err) => toast.error(err.message),
    });

    return { mutate, isLoading };
}