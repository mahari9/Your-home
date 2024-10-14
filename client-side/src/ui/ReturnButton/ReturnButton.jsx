/* eslint-disable react/prop-types */
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ReturnButton.module.scss";

export default function ReturnButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the back and forward buttons should be active
  const canGoBack = location.key !== "default"; // Simplified check for demo purposes
  const canGoForward = window.history.length > 0; // Simplified check for demo purposes

  return (
    <div className={styles.navigationButtons}>
      <button
        onClick={() => canGoBack && navigate(-1)}
        className={`${styles.returnBtn} ${!canGoBack && styles.inactive}`}
        disabled={!canGoBack}
      >
        <HiArrowLeft />
      </button>
      <button
        onClick={() => canGoForward && navigate(1)}
        className={`${styles.forwardBtn} ${!canGoForward && styles.inactive}`}
        disabled={!canGoForward}
      >
        <HiArrowRight />
      </button>
    </div>
  );
}
