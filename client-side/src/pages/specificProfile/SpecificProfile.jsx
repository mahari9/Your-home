import { useEffect } from "react";
import { useGetProfileData } from "../../hooks/useGetProfileData";
import Spinner from "../../ui/Spinner/Spinner";
import styles from "./SpecificProfile.module.scss";
import { useProfileContext } from "../../context/profileContext";
import ProfileInfo from "./ProfileInfo";
import { useCurrUser } from "../../hooks/useCurrUser";
import { useNavigate } from "react-router-dom";
import ActivePostPanel from "./ActivePostPanel";
import RatePanel from "./RatePanel";
export default function SpecificProfile() {
  const { data, isLoading } = useGetProfileData();
  const { setActiveProfile } = useProfileContext();
  const { data: currUser } = useCurrUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      currUser &&
      data?.validProfile &&
      currUser._id === data.validProfile?._id
    )
      return navigate("/app/me");

    if (!isLoading && data.status === "success")
      setActiveProfile(data.validProfile);
  }, [data, isLoading, setActiveProfile, currUser, navigate]);

  if (isLoading) return <Spinner />;
  {
    /*If there is a Logged in  USER and if thier id is equalL to the id of the profile being requested, redirect the USER to the /me page */
  }

  if (data.status === "fail")
    return <span className={styles.errorMessage}>Profile not found 🤷🏽‍♀️</span>;
  return (
    <div className={styles.pageBody}>
      <div className={`container ${styles.profileContainer}`}>
        <ProfileInfo />
        <RatePanel />
        <ActivePostPanel />
      </div>
    </div>
  );
}
