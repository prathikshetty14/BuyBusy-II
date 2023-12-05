import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import OrderDetail from "../Component/MyOrder/OrderDetail";
import Loader from "../Component/Loader/Loader";
import styles from "../styles/myorder.module.css";


import { productSelector, getInitialMyOrdersThunk } from "../Redux/Reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, setLoggedIn, setUserLoggedIn } from "../Redux/Reducers/authReducer";


export function MyOrder() {

  const { myorders } = useSelector(productSelector);
  const {userLoggedIn} = useSelector(authSelector);

  console.log("userLoggedIn MyOrder", userLoggedIn)
  
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInitialMyOrdersThunk());
  },[userLoggedIn]);


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

  return (

    <>
      {/* Loading Condition */}
      {isLoading ? (
        <Loader />
      ) : (
        // Page Container
        <div className={styles.mainContainer}>
          {/* Heading */}
          <h1 className={styles.orderHeading}>Order History</h1>

          {/* Message if orders is Empty */}
          {myorders && myorders.length === 0 ? (
            <>
              <h1>Uh oh! Looks like you haven't placed an order with us. Yet...</h1>
              
              {/* Link to Redirect */}
              <Link to="/"> Click on this link to start! </Link>
            </>
          ) : (
            // if contains order then render them one by one
            // order list container
            <div className={styles.orderListContainer}>
              {myorders.map((order, i) => (
                <OrderDetail key={i} order={order} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
