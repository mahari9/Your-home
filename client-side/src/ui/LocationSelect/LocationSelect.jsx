/* eslint-disable react/prop-types */
const towns = [
	"Addis Ababa",
    "Adama",	
	"Adigrat",
	"Adwa",
	"Agaro",
	"Aksum",
	"Alaba Kulito",
	"Alamata",
	"Aleta Wendo",
	"Ambo",
    "Arba Minch",
	"Areka",
	"Arsi Negele",
	"Asella",
	"Assosa",
	"Awassa",
	"Bahir Dar",
	"Bale Robe",
	"Batu",
	"Bedessa",
	"Bishoftu",
	"Boditi",
	"Bonga",
	"Bule Hora Town",
	"Burayu",
	"Butajira",
	"Chiro",
	"Dangila",
	"Debre Birhan",
	"Debre Mark'os",
	"Debre Tabor",
	"Degehabur",
	"Dembi Dolo",
	"Dessie",
	"Dilla",
	"Dire Dawa",
	"Durame",
	"Fiche",
	"Finote Selam",
	"Gambela",
	"Gimbi",
	"Goba",
	"Gode",
	"Gonder",
	"Haramaya",
	"Harar",
	"Hosaena",
	"Jijiga",
	"Jimma",
	"Jinka",
	"Kobo",
	"Kombolcha",
	"Mekelle",
	"Meki",
	"Metu",
	"Mizan Teferi",
	"Mojo",
	"Mota",
	"Negele Borana",
	"Nekemte",
	"Sawla",
	"Sebeta",
	"Shashamane",
	"Shire (Inda Selassie)",
	"Sodo",
	"Tepi",
	"Waliso",
	"Weldiya",
	"Welkite",
	"Wukro",
	"Yirgalem",
];
import styles from "./LocationSelect.module.scss";
export default function LocationSelect({
    register,
    setterFunc,
    location,
    bgColor,
    includeAll,
}) {
  if (register)
    return (
      <select
        style={bgColor && { backgroundColor: `var( --color-black-3)` }}
        className={styles.select}
        {...register("location", { required: "Enter your location" })}
      >
        {includeAll && (
          <option value="remove" key="includeAll">
            All
          </option>
        )}
        {towns.map((town, i) => (
          <option value={town} key={i}>
            {town[0].toUpperCase() + town.slice(1)}
          </option>
        ))}
      </select>
    );

  if (setterFunc)
    return (
      <select
        style={bgColor && { backgroundColor: `var( --color-black-3)` }}
        className={styles.select}
        onChange={(e) => setterFunc(e.target.value)}
        value={location}
      >
        {towns.map((town, i) => (
          <option value={town} key={i}>
            {town[0].toUpperCase() + town.slice(1)}
          </option>
        ))}
      </select>
    );
}
