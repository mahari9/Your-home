/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { useState } from "react";
import { useLogout } from "../../hooks/uselogout";

export default function MobileNav({ isLoading, user, NavLogin }) {
  const [isActive, setIsActive] = useState(false);
  const { mutate: logout, isLoading: isLoggingOut} = useLogout();

  return (
    <div className={styles.mobileNav}>
      <h1>Your Home</h1>
      <button onClick={() => setIsActive(true)}>
        <HiMenuAlt3 />
      </button>

      <div className={`${styles.mobilePanel} ${isActive && styles.active}`}>
        <h1>Your Home</h1>
        <button
          onClick={() => setIsActive(false)}
          className={styles.closePanel}
        >
          <MdOutlineClose />
        </button>
        <ul>
          <li onClick={() => setIsActive(false)}>
            <NavLink to="/app/dashboard">Home</NavLink>
          </li>
          <li onClick={() => setIsActive(false)}>
            <NavLink to="/app/catalog">Search listings</NavLink>
          </li>

          <li onClick={() => setIsActive(false)}>
            <NavLink to="/app/create-post">
              <img src="/plus.svg" />
              Post
            </NavLink>
          </li>

          <li onClick={() => setIsActive(false)}>
            {!isLoading && user && (
              <NavLink to="/app/me">
                <img src="/profile_icon.svg" />
                Profile
              </NavLink>
            )}
            {!isLoading && !user && <NavLogin />}
          </li>
          {(!isLoading && user) ? (
            <li onClick={() => setIsActive(false)}>
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
    </div>
  );
}
