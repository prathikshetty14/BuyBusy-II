// MainContent.js
import styles from "../../styles/home.module.css";
import ItemCard from "./ItemCard";
import { data } from "../../Assets/data";

export default function MainContent(props) {
  const { search, price, category, applyFilter, currentPage, itemsPerPage } = props;

  const calculateStartIndex = (currentPage, itemsPerPage) => (currentPage - 1) * itemsPerPage;
  const calculateEndIndex = (startIndex, itemsPerPage) => startIndex + itemsPerPage;

  const startIndex = calculateStartIndex(currentPage, itemsPerPage);
  const endIndex = calculateEndIndex(startIndex, itemsPerPage);

  const paginatedItems = data
    .filter((item) => {
      return search.toLowerCase() === "" ? item : item.name.toLowerCase().includes(search);
    })
    .filter((item) => {
      return !applyFilter ? item : item.price <= price;
    })
    .filter((item) => {
      return !applyFilter || category === "none" ? item : item.category === category;
    })
    .slice(startIndex, endIndex);


  return (
    <div className={styles.itemContainer}>
      {/* Filter Button for the Search Bar */}
      {paginatedItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
