const BASE_URL = `/`;
export async function handleLogout() {
    if (window.confirm("Are you sure you want to logout?")) {
        try {
            const res = await fetch(`${BASE_URL}api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            return data;
        }
        catch (err) {
            throw new Error(err);
        }
    }
}