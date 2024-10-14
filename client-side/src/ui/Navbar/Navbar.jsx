import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "../../ui/Spinner/Spinner";
import styles from "./Navbar.module.scss";
import { useCurrUser } from "../../hooks/useCurrUser";
import { useLogout } from "../../hooks/uselogout";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const { data: user, isLoading } = useCurrUser();
  const { mutate: logout, isLoading: isLoggingOut } = useLogout();

  if (isLoading || isLoggingOut) return <Spinner />;

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.navContainer}`}>
        <ul className={styles.list}>
          <img src="/logo.svg" className={styles.logoImg} />
          <li>
            <NavLink to="/app/dashboard">Home</NavLink>
          </li>
          <li>
            <NavLink to="/app/catalog">Explore Lists</NavLink>
          </li>
        </ul>
        <ul className={styles.list}>
          <li>
            <NavLink to="/app/create-post">
              <img src="/post_icon.svg" />
              Post
            </NavLink>
          </li>

          <li>
            {!isLoading && user && (
              <NavLink to="/app/me">
                <img src="/profile_icon.svg" />
                Profile
              </NavLink>
            )}
            {!isLoading && !user && <NavLogin />}
          </li>
          {!isLoading && user ? (
            <li>
              <span
                className={styles.navLogout} 
                onClick={() => {logout()}}
                disabled={isLoggingOut}
              >
                Logout
              </span>
            </li>
          ) : (
            null
            )}
        </ul>
      </div>

      <MobileNav isLoading={isLoading} user={user} NavLogin={NavLogin} />
    </nav>
  );
}
function NavLogin() {
  const navigate = useNavigate();
  return (
    <button className={styles.navLogin} onClick={() => navigate("/login")}>
      Login
    </button>
  );
}