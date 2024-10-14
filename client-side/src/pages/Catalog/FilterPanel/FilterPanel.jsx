import { useQueryClient } from "@tanstack/react-query";
import LocationSelect from "../../../ui/LocationSelect/LocationSelect";
import styles from "./FilterPanel.module.scss";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
export default function FilterPanel() {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleFiltering(data) {

    if (data.listingPurpose === "remove") data.listingPurpose = "";
    if (data.location === "remove") data.location = "";
    if (data.typeProperty === "remove") data.typeProperty = "";
    setSearchParams(data);
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  return (
    <div className={styles.filterPanel}>
      Filter properties by:
      <form
        className={styles.form}
        onSubmit={handleSubmit((data) => handleFiltering(data))}
      >
        <div>
          <label htmlFor="typeProperty">Type of property</label>
          <select {...register("typeProperty")}>
            <option value="remove">All</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
          </select>
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <div className={styles.priceWrapper}>
            <input type="number" placeholder="> Greter than" {...register("pricegte")} />
            <input type="number" placeholder="< Less than" {...register("pricelte")} />
          </div>
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <LocationSelect
            register={register}
            bgColor="gray"
            includeAll={true}
          />
        </div>

        <div>
          <label htmlFor="listingPurpose">Listing Purpose</label>
          <select {...register("listingPurpose")}>
            <option value="remove">All</option>
            <option value="renting">Renting</option>
            <option value="sale">Sale</option>
          </select>
        </div>

        <button>Search changes</button>
      </form>
    </div>
  );
}
