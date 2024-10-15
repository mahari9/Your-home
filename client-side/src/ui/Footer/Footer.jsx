import { NavLink } from "react-router-dom";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <ul className={styles.list}>
          <li>
            <NavLink to="/app/dashboard">Home</NavLink>
          </li>
          <li>
            <NavLink to="/app/catalog">Explore Lists</NavLink>
          </li>
          <li>
            <NavLink to="/app/contact">Contact Us</NavLink>
          </li>
        </ul>
        <ul className={styles.list}>
          <li>
            <NavLink to="/app/privacy-policy">Privacy Policy</NavLink>
          </li>
          <li>
            <NavLink to="/app/terms-of-service">Terms of Service</NavLink>
          </li>
        </ul>
        <div className={styles.socialMedia}>
          <a href="https://github.com/mahari9/Your-home" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="https://www.linkedin.com/in/mahari-tsegay-22376524a" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://x.com/TsegayMahari?t=VdjwWg-QUN3yc7nZAC186w&s=09" target="_blank" rel="noopener noreferrer">X</a>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Your-home. All rights reserved.
        </div>
      </div>
    </footer>
  );
}