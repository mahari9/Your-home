import { useModalContext } from "../../../context/modalContext";
import { useDeletePost } from "../../../hooks/useDeletePost";
import Spinner from "../../../ui/Spinner/Spinner";
import styles from "./ConfirmDelete.module.scss";
export default function ConfirmDelete() {
  const { setIsOpenModal, selectedPost } = useModalContext();
  const { mutate: removePost, isLoading: isDeleting } = useDeletePost();
  if (isDeleting) return <Spinner />;
  return (
    <div className={styles.ConfirmDelete}>
      <span>Are you sure you want to delete this post? </span>
      <div>
        <button onClick={() => removePost(selectedPost._id)}>Yes, delete</button>
        <button onClick={() => setIsOpenModal(false)}>Cancel</button>
      </div>
    </div>
  );
}
