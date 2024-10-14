import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { usePreventAccess } from "../../hooks/usePreventAccess";
import ReturnButton from "../../ui/ReturnButton/ReturnButton";
import Spinner from "../../ui/Spinner/Spinner";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = usePreventAccess();
  const { mutate, isLoggingIn } = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    if (!password || !email) return;
    mutate({ email, password });
  }

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.interfaceWrapper}>
      <ReturnButton/>
      {isLoggingIn && <Spinner />}
      {!isLoggingIn && (
        <form className={styles.loginForm} onSubmit={(e) => handleLogin(e)}>
          <div className={styles.headingWrapper}>
            <h2>Login</h2>
            <h3>Fill in your personal information</h3>
          </div>

          <div>
            <label htmlFor="email">Email adress</label>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.rememberMe}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <span>
            `You don't have an existing account?` <Link to="/register">Register</Link>
          </span>
          <button>Login</button>
        </form>
      )}
    </div>
  );
}