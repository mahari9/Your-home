import { useNavigate } from "react-router-dom";
import { usePreventAccess } from "../../hooks/usePreventAccess";
import Spinner from "../../ui/Spinner/Spinner";
import styles from "./LandingPage.module.scss";

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoading = usePreventAccess();
  if (isLoading) return <Spinner />;
  return (
    <div className={styles.landingPage}>
      {/* <h1>Your Home</h1>*/}
      <img src="/logo.svg" />
      <h2>Your perfect property, within reach.</h2>
      <div>
        <button onClick={() => navigate("/app")}>Explore Lists</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}
