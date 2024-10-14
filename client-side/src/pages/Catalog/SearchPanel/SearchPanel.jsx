import { useSearchParams } from "react-router-dom";
import styles from "./SearchPanel.module.scss";
import { useState } from "react";
export default function SearchPanel() {
  const [search, setSearch] = useState("");
  const [searchPrams, setSearchParams] = useSearchParams();
  function handleChange(e) {
    setSearch(e.target.value);
    setSearchParams({ search: e.target.value });
  }
  return (
    <div className={styles.searchPanel}>
      <div className={styles.searchWrapper}>
        <img src="/search.svg" alt="search" />
        <input
          type="search"
          name="gsearch"
          placeholder="Search by title"
          onChange={(e) => handleChange(e)}
          value={search}
        />
      </div>
    </div>
  );
}
