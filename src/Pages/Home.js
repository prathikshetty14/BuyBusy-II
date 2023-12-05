// Home.js
import { useState, useEffect } from "react";
import FilterBar from "../Component/Home/FilterBar";
import MainContent from "../Component/Home/MainContent";
import styles from "../styles/home.module.css";
import Loader from "../Component/Loader/Loader";
import { data } from "../Assets/data";

import {
  authSelector,
  getInitialUserList,
  setLoggedIn,
  setUserLoggedIn,
} from "../Redux/Reducers/authReducer";
import { getInitialCartOrdersThunk } from "../Redux/Reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";

export function Home() {
  const dispatch = useDispatch();

  const { isLoggedIn, userLoggedIn } = useSelector(authSelector);

  const [isLoading, setLoading] = useState(true);

  const [applyFilter, setApplyFilter] = useState(false);

  const [price, setPrice] = useState(30000);
  const [category, setCategory] = useState("none");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust this based on your preference

  useEffect(() => {
    dispatch(getInitialCartOrdersThunk());
  }, [userLoggedIn]);

  // Update currentPage to 1 when the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);

    const token = window.localStorage.getItem("token");
    if (token) {
      const index = window.localStorage.getItem("index");
      const user = JSON.parse(index);

      dispatch(setLoggedIn(token));
      dispatch(setUserLoggedIn(user));
    }
  }, []);

  useEffect(() => {
    dispatch(getInitialUserList());
  }, [isLoggedIn]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const pageCount = Math.ceil(data.length / itemsPerPage);
  const marginPagesDisplayed = 2; // Adjust this based on your preference
  const marginRangeDisplayed = 3; // Adjust this based on your preference
  const FIRST_PAGES = 3;
  const LAST_PAGES = 3;

  return (
    <>
      {/* Loading Screen Condition */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Page Header */}
          <div className={styles.header}>
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search for product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Bar & Main Content Container */}
          <div className={styles.mainContainer}>
            {/* Filter Button */}
            <span className={styles.header}>
              <button onClick={() => setApplyFilter(!applyFilter)} role="button">
                {applyFilter ? "Cancel" : "Apply Filter"}
              </button>{" "}
            </span>

            {/* Filter Section  */}
            {applyFilter && <FilterBar price={price} setPrice={setPrice} setCategory={setCategory} />}

            {/* Products Section */}
            <MainContent
              search={search}
              price={price}
              category={category}
              applyFilter={applyFilter}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />

            {/* Pagination controls */}
            <div className={styles.pagination}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {[...Array(pageCount)].map((_, index) => {
                const isWithinFirst = index < FIRST_PAGES;
                const isWithinLast = index >= pageCount - LAST_PAGES;
                const isWithinRange =
                  index >= currentPage - marginPagesDisplayed &&
                  index <= currentPage + marginPagesDisplayed;
                const isEdge =
                  index < marginRangeDisplayed || index >= pageCount - marginRangeDisplayed;
                const shouldRender =
                  isWithinFirst ||
                  isWithinLast ||
                  (isWithinRange && !isEdge) ||
                  (isEdge && Math.abs(currentPage - index) <= marginRangeDisplayed);

                return shouldRender ? (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? styles.active : ""}
                  >
                    {index + 1}
                  </button>
                ) : (
                  <span key={index} className={styles.pageBreak}>
                    ...
                  </span>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * itemsPerPage >= data.length}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
