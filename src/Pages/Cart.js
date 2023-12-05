import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CartItem from "../Component/Cart/CartItem";
import Loader from "../Component/Loader/Loader";
import firstStyles from "../styles/home.module.css";
import secondStyles from "../styles/cart.module.css";
import { toast } from "react-toastify";

import { authSelector, setLoggedIn, setUserLoggedIn } from "../Redux/Reducers/authReducer";
import { clearCartThunk, productSelector, purchaseAllThunk, getInitialCartOrdersThunk } from "../Redux/Reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";



// Cart component
export function Cart() {

  const dispatch = useDispatch();

  // State for loading indicator
  const [isLoading, setLoading] = useState(true);

  // Access relevant data and functions from contexts
  const { cart, total, itemInCart } = useSelector(productSelector);
  const {userLoggedIn} = useSelector(authSelector);
  const navigate = useNavigate();

  useEffect(() => {
  dispatch(getInitialCartOrdersThunk());
  },[userLoggedIn]);


  // Simulate loading for 300ms
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);

    const token = window.localStorage.getItem("token");
    if(token){
      const index = window.localStorage.getItem("index");
      const user = JSON.parse(index);

      dispatch(setLoggedIn(token));
      dispatch(setUserLoggedIn(user));
    }
  }, []);


  // Handle the purchase of all items in the cart
  function handlePurchase() {
    if (itemInCart === 0) {
      toast.error("Nothing to Purchase!");
      return;
    }

    // Check if userLoggedIn is available
    if (userLoggedIn) {
      dispatch(purchaseAllThunk());
      toast.success("Order Purchased Successfully!");
      navigate("/myorder");
    } else {
      toast.error("User not logged in. Please log in first.");
      navigate("/signin");
    }
  }

  return (
    <>
      {/* Loading Condition */}
      {isLoading ? (
        <Loader />
      ) : (
        // Cart Container
        <div className={secondStyles.mainContainer}>

          {/* Heading */}
          <div className={secondStyles.header}>

            <div className={secondStyles.userInfo}>
              <h1>
                Welcome to your cart <u>{userLoggedIn.name}</u>. <small>Make sure to check your selected items before purchasing! </small>
              </h1>
            </div>

            {/* Purchase Button and Cart Details */}
            <div className={secondStyles.cartDetail}>
              <div>
                {/* Cart Items */}
                Item{itemInCart > 1 ? "'s" : ""}: {itemInCart}
                <br />
                {/* Empty Cart Button */}
                <button className={secondStyles.removeAll} onClick={ () => dispatch(clearCartThunk())}>
                 Remove All
                </button>
              </div>

              <div>

                {/* Total Amount */}
                Total Amount: ₹{total}

                <br />

                {/* Purchase Button */}
                <button
                  className={secondStyles.purchaseAll}
                  onClick={handlePurchase}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>

          {/* All Cart Items */}
          <div className={firstStyles.itemContainer}>
            
            {/* If Cart is Empty  */}
            {cart.length === 0 ? (
              <h1>OMG! The cart is empty 😱</h1>
            ) : (
              // If Cart is not Empty
              cart.map((product, i) => <CartItem key={i} product={product} />)
            )}
          </div>
        </div>
      )}
    </>
  );
}
