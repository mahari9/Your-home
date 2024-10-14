
import { formatDate } from "../../services/formatDate";
import {
  useAnswerComment,
  useDeleteAnswer,
  useDeleteComment,
} from "../../hooks/useComments";
import styles from "./Comments.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Comment({ com, user, post }) {
  const { mutate: answer } = useAnswerComment();
  const { mutate: deleteAnswer } = useDeleteAnswer();
  const { mutate: deleteComment } = useDeleteComment();
  const [answerInput, setAnswerInput] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!answerInput) return;
    answer({ commentId: com._id, answer: answerInput });
  }

  return (
    <div>
      <div>
        <div
          className={styles.questionUser}
          onClick={() => navigate(`/app/profile/${com.creator._id}`)}
        >
          <span>{com.creator.fullName || com.creator.agencyName}</span>
          <span>{formatDate(com.createdAt)}</span>
        </div>

        <div>
          <p className={styles.question}>
            {com.comment}

            {/*IF the USER is Logged in and the USER is the creator of the comment, render a button for deleting the comment.*/}
            {user && user._id === com.creator._id && (
              <button onClick={() => deleteComment(com._id)}>
                <img src="/trash.svg" />
              </button>
            )}
          </p>
          {com.answer && (
            <div className={styles.answerWrapper}>
              <span>{post.creator.fullName || post.creator.agencyName}</span>
              <p className={styles.answer}>
                {com.answer}{" "}
                {/*If there is a user and if the creator of the post is the same as the logged-in user, it means that they have permission to delete their own responses */}
                {user && post.creator._id === user._id && (
                  <button type="button" onClick={() => deleteAnswer(com._id)}>
                    <img src="/trash.svg" />
                  </button>
                )}
              </p>
            </div>
          )}

          {/*If the user exists and if the creator of the post is the currently logged-in user and if the comment has no response, display the form */}
          {user && post.creator._id === user._id && !com.answer && (
            <form
              className={styles.answerForm}
              onSubmit={(e) => handleSubmit(e)}
            >
              <input
                type="text"
                placeholder="Answer the question"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
              />

              <button>Post an answer</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
