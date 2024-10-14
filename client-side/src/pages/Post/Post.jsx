/* eslint-disable react/prop-types */
import { useGetSinglePost } from "../../hooks/useGetSinglePost";
import { useCurrUser } from "../../hooks/useCurrUser";
import Spinner from "../../ui/Spinner/Spinner";
import FeaturesComonent from "./FeaturesComponent";
import ImageComponent from "./ImageComponent";
import InfoComponent from "./InfoComponent";
import styles from "./Post.module.scss";
import PostMap from "./PostMap";
import Comments from "./Comments";
import Modal from "../../ui/Modal/Modal";
import { useModalContext } from "../../context/modalContext";
import ConfirmDelete from "./ConfirmDelete/ConfirmDelete";

export default function Post() {
  const { data, isLoading } = useGetSinglePost();
  const { data: user, isLoading: isGettingUser } = useCurrUser();
  const { isOpenModal } = useModalContext();
  if (isLoading) return <Spinner />;
  if (isGettingUser) return <Spinner />;
  if (data.status === "fail")
    return (
      <span className={styles.notFound}>
        The post you are looking for was not found, please try again
      </span>
    );
  const { post } = data;
  //There is no need for context because it is one level of prop drilling (If there are more child components that will use it - switch to context)
  return (
    <div className={styles.postBody}>
      <div className={`container ${styles.postContainer}`}>
        <ImageComponent post={post} />
        <InfoComponent post={post} user={user} />
        <FeaturesComonent post={post} />
        <PostMap post={post} />
        <Comments post={post} user={user} />

        {isOpenModal && (
          <Modal>
            <ConfirmDelete />
          </Modal>
        )}
      </div>
    </div>
  );
}
