/* eslint-disable react/prop-types */
import { formatDate } from "../../services/formatDate";

import styles from "./Post.module.scss";

export default function FeaturesComonent({ post }) {
  return (
    <div className={styles.features}>
      <div className={styles.generalPanel}>
        <div>
          <img src="/pin.svg" />
          <span>{post.location[0].toUpperCase() + post.location.slice(1)}</span>
        </div>
        <div className={styles.createdAt}>
          <img src="/calendar.svg" />
          {formatDate(post.createdAt)}
        </div>

        <div>
          <img src="/money.svg" />
          <p className={styles.priceTag}>
            {post.price.toLocaleString("en-US")} Birr
          </p>
        </div>
      </div>

      <div className={styles.featuresPanel}>
        {post.newbuilding && (
          <div>
            <img src="/building-sm.svg" />
            <span>newbuilding</span>
          </div>
        )}

        {post.furnished && (
          <div>
            <img src="/furnished.svg" />
            <span>Furnished</span>
          </div>
        )}

        <div>
          <img src="/heating.svg" />
          <span>{post.heating.toUpperCase()}</span>
        </div>
        <div>
          <img src="/door.svg" />
          <span>number of rooms: {post.roomNum}</span>
        </div>
        <div>
          <span> {post.listingPurpose.toUpperCase()}</span>
        </div>
        <div>
          <img src="/lift.svg" />
          <span>
            {post.propertyType === "house" ? "Number of floors" : "floor"}{" "}
            {post.floor}
          </span>
        </div>
        {post.indexed && (
          <div>
            <img src="/registry.svg" />
            <span>Registered</span>
          </div>
        )}
        <div>
          <img src="/size.svg" />
          <span>Square meters: {post.square_meters}</span>
        </div>
        {post.parking && (
          <div>
            <img src="/parking.svg" />
            <span>Parking</span>
          </div>
        )}
      </div>
    </div>
  );
}
