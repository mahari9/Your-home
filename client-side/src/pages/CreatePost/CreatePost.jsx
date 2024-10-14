/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./CreatePost.module.scss";
import { useForm } from "react-hook-form";
import LocationSelect from "../../ui/LocationSelect/LocationSelect";
import { toast } from "react-hot-toast";
import { useCreatePost } from "../../hooks/useCreatePost";
import Spinner from "../../ui/Spinner/Spinner";
import Map from "./Map";
import { usePositionContext } from "../../context/PositionContext";

export default function CreatePost() {
  const [type, setType] = useState(null);

  return (
    <div className={styles.body}>
      <div className={`container ${styles.CreatePostContainer}`}>
        {!type && <ChooseType onSetType={setType} />}
        {type && <Form type={type} />}
      </div>
    </div>
  );
}

function ChooseType({ onSetType }) {
  return (
    <div className={styles.typeWrapper}>
      <span>Select the type of property</span>

      <div>
        <div onClick={() => onSetType("apartment")} className={styles.option}>
          <img src="/apartm.svg" alt="apartment" />
          Apartment
        </div>
        <div onClick={() => onSetType("house")} className={styles.option}>
          <img src="/house.svg" alt="house" />
          House
        </div>
      </div>
    </div>
  );
}

function Form({ type }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [newbuilding, setNewbuilding] = useState(null);
  const [furnished, setFurnished] = useState(null);
  const [parking, setParking] = useState(null);
  const [indexed, setIndexed] = useState(null);
  const [location, setLocation] = useState("Addis Ababa");
  const { position: coordinates } = usePositionContext();

  const { mutate, isLoading } = useCreatePost();

  function handlePost(data) {
    if (
      newbuilding === null ||
      furnished === null ||
      parking === null ||
      indexed === null
    )
      return toast.error("Fill in all the fields!");

    if (coordinates.length === 0)
      return toast.error("Mark on the map where your property is located");
    data.coords = [...coordinates];
    data.newbuilding = newbuilding;
    data.typeProperty = type;
    data.furnished = furnished;
    data.parking = parking;
    data.indexed = indexed;
    data.location = location;

    const formData = new FormData();
    const filesArray = Array.from(data.photos);
    data.photos = undefined;
    Object.entries(data).forEach((e) => formData.append(e[0], e[1]));
    filesArray.forEach((file) => formData.append("photos", file));
    mutate(formData);
  }

  if (isLoading) return <Spinner />;
  return (
    <form
      className={styles.postForm}
      onSubmit={handleSubmit((data) => handlePost(data))}
      encType="multipart/form-data"
    >
      <div className={styles.title}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          placeholder={
            type === "apartment" ? "apartment in Addis Ababa" : "house in Addis Ababa"
          }
          {...register("title", { required: "Enter the title of your post" })}
          name="title"
        />
        {errors.title?.message && (
          <span className={styles.errorMsg}> {errors.title.message}</span>
        )}
      </div>
      <div className={styles.subtitle}>
        <label htmlFor="subtitle">Subtitle</label>
        <input
          type="text"
          placeholder={
            type === "apartment"
              ? "apartment 300 meters from the sea"
              : "house 300 meters from the sea"
          }
          {...register("subtitle", {
            required: "Enter the subtitle of your post",
          })}
          name="subtitle"
        />
        {errors.subtitle?.message && (
          <span className={styles.errorMsg}>{errors.subtitle.message}</span>
        )}
      </div>
      <div className={styles.description}>
        <label htmlFor="description">
          {type === "apartment" ? "Describe your apartment" : "Describe your house"}
        </label>
        <textarea
          {...register("description", {
            required: "Enter a description of your post",
          })}
        />
        {errors.description?.message && (
          <span className={styles.errorMsg}>{errors.description.message}</span>
        )}
      </div>
      <div className={styles.photos}>
        <label htmlFor="photos">Select photos</label>
        <input
          type="file"
          multiple
          id="photos"
          name="photos"
          {...register("photos", { required: "Enter photos" })}
        />

        {errors.photos?.message && (
          <span className={styles.errorMsg}>{errors.photos.message}</span>
        )}
      </div>
      <Map location={location} />
      <div className={styles.location}>
        <label htmlFor="location">Location</label>
        <LocationSelect
          setterFunc={setLocation}
          location={location}
          bgColor="gray"
        />
      </div>
      <div className={styles.newbuilding}>
        <span>newbuilding</span>
        <div>
          <button
            type="button"
            className={newbuilding ? "blackBtn" : ""}
            onClick={() => setNewbuilding(true)}
          >
            YES
          </button>
          <button
            type="button"
            className={newbuilding === false ? "blackBtn" : ""}
            onClick={() => setNewbuilding(false)}
          >
            NO
          </button>
        </div>
      </div>
      <div className={styles.furnished}>
        <span>Furnished</span>
        <div>
          <button
            type="button"
            className={furnished ? "blackBtn" : ""}
            onClick={() => setFurnished(true)}
          >
            YES
          </button>
          <button
            type="button"
            className={furnished === false ? "blackBtn" : ""}
            onClick={() => setFurnished(false)}
          >
            NO
          </button>
        </div>
      </div>
      <div className={styles.heating}>
        <label htmlFor="heating">Heating</label>
        <select
          id="heating"
          {...register("heating", { required: "Specify the type of heating" })}
        >
          <option value="gas">gas</option>
          <option value="central">central</option>
          <option value="without heating">without heating</option>
        </select>
        {errors.heating?.message && (
          <span className={styles.errorMsg}>{errors.heating.message}</span>
        )}
      </div>
      <div className={styles.sobe}>
        <label htmlFor="roomNum">Number of rooms</label>
        <input
          type="number"
          name="roomNum"
          {...register("roomNum", {
            required: `Specify number of rooms ${
              type == "apartment" ? "your apartment" : "your house"
            }`,
          })}
        />
        {errors.roomNum?.message && (
          <span className={styles.errorMsg}>{errors.roomNum.message}</span>
        )}
      </div>

      <div className={styles.listingPurpose}>
        <label htmlFor="listingPurpose">Purpose listing</label>
        <select
          {...register("listingPurpose", { required: "Specify  purpose listing" })}
        >
          <option value="sale">sale</option>
          <option value="renting">Renting</option>
        </select>
        {errors.listingPurpose?.message && (
          <span className={styles.errorMsg}>{errors.listingPurpose.message}</span>
        )}
      </div>
      <div className={styles.floor}>
        <label htmlFor="floor">{type == "apartment" ? "Floor" : "Floors"}</label>
        <input
          type="number"
          {...register("floor", {
            required: `${
              type === "apartment"
                ? "Specify which floor the apartment is on"
                : "Specify how many floors the house has"
            }`,
          })}
        />
        {errors.floor?.message && (
          <span className={styles.errorMsg}>{errors.floor.message}</span>
        )}
      </div>
      <div className={styles.parking}>
        <span>Parking</span>
        <div>
          <button
            type="button"
            className={parking ? "blackBtn" : ""}
            onClick={() => setParking(true)}
          >
            YES
          </button>
          <button
            type="button"
            className={parking === false ? "blackBtn" : ""}
            onClick={() => setParking(false)}
          >
            NO
          </button>
        </div>
      </div>
      <div className={styles.indexed}>
        <span>Registered</span>
        <div>
          <button
            type="button"
            className={indexed ? "blackBtn" : ""}
            onClick={() => setIndexed(true)}
          >
            YES
          </button>
          <button
            type="button"
            className={indexed === false ? "blackBtn" : ""}
            onClick={() => setIndexed(false)}
          >
            NO
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="square_meters">Square meters</label>
        <input
          type="number"
          {...register("square_meters", {
            required: `Enter how many square meters it has ${
              type === "apartment" ? "your apartment" : "your house"
            }`,
          })}
          name="square_meters"
        />
        {errors.square_meters?.message && (
          <span className={styles.errorMsg}>{errors.square_meters.message}</span>
        )}
      </div>
      <div className={styles.price}>
        <label htmlFor="price">Price </label>
        <input
          type="number"
          placeholder="Birr"
          {...register("price", {
            required: `Enter the price  ${
              type === "apartment" ? "your apartment" : "your house"
            }`,
          })}
          name="price"
        />
        {errors.price?.message && (
          <span className={styles.errorMsg}>{errors.price.message}</span>
        )}
      </div>
      <button className={styles.postBtn}>Post advertisement</button>
    </form>
  );
}
