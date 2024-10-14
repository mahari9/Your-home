/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useModalContext } from "../../context/modalContext";
import styles from "./Post.module.scss";
import { useFinishPost } from "../../hooks/useFinishPost";
export default function InfoComponent({ post, user }) {
  const { setIsOpenModal, setSelectedPost } = useModalContext();
  const { mutate } = useFinishPost();

  const navigate = useNavigate();
  return (
    <div className={styles.infoWrapper}>
      <h2>{post.title}</h2>
      <h3>{post.subtitle}</h3>
      <div className={styles.userInfo}>
        {post.creator._id !== user?._id && (
          <>
            <span>
              {post.creator.role === "User" ? "User:" : "Agency"}
            </span>
            <span>{post.creator.fullName || post.creator.agencyName}</span>
            {post.finished && <span>Sale Completed</span>}
            <button
              onClick={() => navigate(`/app/profile/${post.creator._id}`)}
            >
              View More
            </button>
          </>
        )}

        {user && post.creator._id === user._id && (
          <>
            <span>Your Post</span>
            {!post.finished && (
              <>
                <button onClick={() => mutate(post._id)}>Finish List</button>
                <button
                  onClick={() => {
                    setIsOpenModal(true);
                    setSelectedPost(post);
                  }}
                >
                  Delete Post
                </button>
              </>
            )}
            {post.finished && <span>The listing is over</span>}
          </>
        )}
      </div>
      <p>{post.description}</p>

      {user && post.creator._id !== user._id && (
        <button onClick={() => handleScroll()}>
          Question for
          {post.creator.role === "User" ? " Owner" : " agency"}
        </button>
      )}
    </div>
  );
}

function handleScroll() {
  const element = document.querySelector("#formComment");
  if (element) element.scrollIntoView({ behavior: "smooth" });
}
