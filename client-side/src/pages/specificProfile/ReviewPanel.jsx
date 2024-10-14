import { useProfileContext } from "../../context/profileContext";
import styles from "./SpecificProfile.module.scss";

export default function ReviewPanel() {
  const { activeProfile } = useProfileContext();
  const positiveReviews = activeProfile.reviews.filter(
    (r) => r.reviewType === "positive"
  );
  const negativeReviews = activeProfile.reviews.filter(
    (r) => r.reviewType === "negative"
  );

  const finishedPosts = activeProfile.posts.filter((p) => p.finished);
  const activePosts = activeProfile.posts.filter((p) => !p.finished);
  return (
    <div className={styles.reviewsWrapper}>
      <div>
        <img src="/like.svg" />
        <span>{positiveReviews.length} Positive Rating</span>
      </div>

      <div>
        <img src="/dislike.svg" />
        <span>{negativeReviews.length} Positive Rating</span>
      </div>

      <div>
        <img src="/adv.svg" />
        <span>{activePosts.length}Active Listings</span>
      </div>
      <div>
        <img src="/medal.svg" />
        <span>{finishedPosts.length} successful sales</span>
      </div>
    </div>
  );
}
