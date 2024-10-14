
import { useState } from "react";
import { usePostComment } from "../../hooks/useComments";
import styles from "./Comments.module.scss";
import Comment from "./Comment";
export default function Comments({ post, user }) {
  const { mutate } = usePostComment();
  const [comment, setComment] = useState("");

  function handlePostComment(e) {
    e.preventDefault();
    if (!comment) return;
    mutate({ postId: post._id, comment });
    setComment("");
  }

  return (
    <div className={styles.commentsPanel}>
      {post.comments.length === 0 && <span>The post has no public questions</span>}
      {post.comments.length > 0 && (
        <span className={styles.questionCount}>
          Questions: {post.comments.length}
        </span>
      )}

      {/*If the current user is not the creator of the post, display the form for posting a comment */}
      {user && post.creator._id !== user._id && (
        <div>
          <form
            className={styles.form}
            onSubmit={(e) => handlePostComment(e)}
            id="formComment"
          >
            <input
              type="text"
              placeholder="Ask a public question"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button>Publish</button>
          </form>
        </div>
      )}
      {post.comments.length > 0 && (
        <div className={styles.questionsWrapper}>
          {post.comments.reverse().map((com) => (
            <Comment com={com} key={com._id} user={user} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
