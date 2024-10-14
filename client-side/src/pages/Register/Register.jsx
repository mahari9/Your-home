import { useState } from "react";
import styles from "./Register.module.scss";
import RegisterUser from "./RegisterUser";
import RegisterAgency from "./RegisterAgency";
import ReturnButton from "../../ui/ReturnButton/ReturnButton";
import { usePreventAccess } from "../../hooks/usePreventAccess";
import Spinner from "../../ui/Spinner/Spinner";
export default function Register() {
  const isLoading = usePreventAccess();
  const [activePanel, setActivePanel] = useState(null);

  if (isLoading) return <Spinner />;
  return (
    <div className={styles.interfaceWrapper}>
      <ReturnButton
      />
      {!activePanel && (
        <div className={styles.pickModal}>
          <span>Register as</span>
          <div onClick={() => setActivePanel("agency")}>
            <span>Agency</span>
            <img src="/agent.svg" alt="agency briefcase" />
          </div>
          <div onClick={() => setActivePanel("user")}>
            <span>User</span>
            <img src="/user.svg" alt="user icon" />
          </div>
        </div>
      )}

      {activePanel === "user" && <RegisterUser />}
      {activePanel === "agency" && <RegisterAgency />}
    </div>
  );
}
