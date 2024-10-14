import LocationSelect from "../../ui/LocationSelect/LocationSelect";
import styles from "./Register.module.scss";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import Spinner from "../../ui/Spinner/Spinner";
import { useRegisterUser } from "../../hooks/useRegisterUser";
export default function RegisterUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading } = useRegisterUser();

  if (isLoading) return <Spinner />;
  return (
    <form
      className={styles.registerForm}
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      <div className={styles.headingWrapper}>
        <h2>Registration</h2>
        <h3>Fill in your personal information</h3>
      </div>
      <div>
        <label htmlFor="fullName">First and Last Name</label>
        <input
          type="text"
          placeholder="Mahari Tsegay"
          {...register("fullName", { required: "Enter your first and last name" })}
        />
        {errors.fullName?.message && <span>{errors.fullName.message} </span>}
      </div>
      <div>
        <label htmlFor="email">Email adress</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          {...register("email", { required: "Enter your email!" })}
        />
        {errors.email?.message && <span>{errors.email.message} </span>}
      </div>
      <div>
        <label htmlFor="location">Residence location</label>
        <LocationSelect register={register} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="*********"
          {...register("password", { required: "Enter your password" })}
        />
        {errors.password?.message && <span>{errors.password.message} </span>}
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone number</label>
        <input
          type="number"
          placeholder="+251944779932"
          {...register("phoneNumber")}
        />
      </div>
      <div>
        <label htmlFor="passwordConfirm">Repeat the password</label>
        <input
          type="password"
          placeholder="********"
          {...register("passwordConfirm", { required: "Repeat the password!" })}
        />
        {errors.passwordConfirm?.message && (
          <span>{errors.passwordConfirm.message} </span>
        )}
      </div>
      <span>
        Do you already have an existing account? <Link to="/login">Log in</Link>
      </span>
      <button>Register</button>
    </form>
  );
}
