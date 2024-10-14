import { useCurrUser } from "../../hooks/useCurrUser";
import styles from "./Me.module.scss";

export default function MyReviewPanel() {
  const { data: me } = useCurrUser();
  const positiveReviews = me.reviews.filter((r) => r.reviewType === "positive");
  const negativeReviews = me.reviews.filter((r) => r.reviewType === "negative");
  const finishedPosts = me.posts.filter((p) => p.finished);
  const activePosts = me.posts.filter((p) => !p.finished);
  return (
    <div className={styles.reviewsWrapper}>
      <div>
        <img src="/like.svg" />
        <span>{positiveReviews.length} Positive Rating</span>
      </div>

      <div>
        <img src="/dislike.svg" />
        <span>{negativeReviews.length} Negative Rating</span>
      </div>

      <div>
        <img src="/adv.svg" />
        <span>{activePosts.length} Active Listing</span>
      </div>

      <div>
        <img src="/medal.svg" />
        <span>{finishedPosts.length} Successful Sales/Rent</span>
      </div>
    </div>
  );
}
