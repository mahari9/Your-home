import LocationSelect from "../../ui/LocationSelect/LocationSelect";
import styles from "./Register.module.scss";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Spinner from "../../ui/Spinner/Spinner";
import { useRegisterAgency } from "../../hooks/useRegisterAgency";

export default function RegisterAgency() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isLoading } = useRegisterAgency();

  if (isLoading) return <Spinner />;
  return (
    <form
      className={styles.registerForm}
      onSubmit={handleSubmit((data) => mutate(data))}
    >
      <div className={styles.headingWrapper}>
        <h2>Agency registration</h2>
        <h3>Complete the information</h3>
      </div>
      <div>
        <label htmlFor="agencyName">Agency name*</label>
        <input
          type="text"
          placeholder="Newc Agency"
          name="agencyName"
          id="agencyName"
          {...register("agencyName", { required: "Enter the name of the agency" })}
        />
        {errors.agencyName?.message && (
          <span>{errors.agencyName?.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="contactPerson">Contact person</label>
        <input
          type="text"
          placeholder="Newc contact"
          name="contactPerson"
          id="contactPerson"
          {...register("contactPerson", {
            required: "Enter the name of the contact person",
          })}
        />
        {errors.contactPerson?.message && (
          <span>{errors.contactPerson?.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="email">Email adress of your agency</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          name="email"
          id="email"
          {...register("email", { required: "Enter the agency’s email" })}
        />
        {errors.email?.message && <span>{errors.email?.message}</span>}
      </div>
      <div>
        <label htmlFor="location">Agency location*</label>
        <LocationSelect register={register} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Your password"
          name="password"
          id="password"
          {...register("password", { required: "Enter password" })}
        />
        {errors.password?.message && <span>{errors.password?.message}</span>}
      </div>
      <div>
        <label htmlFor="phoneNumber">Agency’s phone numbere</label>
        <input
          type="number"
          placeholder="Your phone"
          name="phoneNumber"
          id="phoneNumber"
          {...register("phoneNumber")}
        />
      </div>
      <div>
        <label htmlFor="passwordConfirm">Repeat the password</label>
        <input
          type="password"
          placeholder="Confirm Your password*"
          name="passwordConfirm"
          id="passwordConfirm"
          {...register("passwordConfirm", { required: "Repeat the password" })}
        />
        {errors.passwordConfirm?.message && (
          <span>{errors.passwordConfirm?.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="website">`Agency’s website`</label>
        <input
          type="text"
          placeholder="Your website address"
          name="website"
          id="website"
          {...register("website")}
        />
      </div>
      <div className={styles.textareaWrapper}>
        <label htmlFor="about">About the Agency</label>
        <textarea name="about" id="about" {...register("about")}></textarea>
      </div>

      <span>
        Do you already have an existing account? <Link to="/login">Log in</Link>
      </span>
      <button>Register</button>
    </form>
  );
}
