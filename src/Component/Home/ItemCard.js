import styles from "../../styles/home.module.css";

import { addToCartThunk } from "../../Redux/Reducers/productReducer";
import { useDispatch } from "react-redux";

export default function ItemCard(props) {

  const dispatch = useDispatch();

  const { name, image, price, category } = props.item;

  return (
    <>
      {/* Card Container */}
      <div className={styles.cardContainer}>

        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img src={image} alt={category} />
        </div>

        {/* Product Description */}
        <div className={styles.itemInfo}>
          <div className={styles.namePrice}>
            {/* Product Name */}
            <div className={styles.name}>{name}</div>

            {/* Product Price */}
            <div className={styles.price}>₹{price}</div>
          </div>

          {/* Add to Cart Button */}
          <div className={styles.btnContainer}>
            <button
              className={styles.addBtn}
              onClick={() => dispatch(addToCartThunk(props.item))}
            >
              <span className="text">
                Add to Cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
