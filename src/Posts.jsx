import { useState, useEffect } from "react";
import axios from "./axios";
import "./Posts.css";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import StaggeredWrapper from "./components/StaggeredWrapper";
import { AnimatePresence, motion } from "framer-motion";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    showPageItems();
  }, [posts, currentPage, itemPerPage]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/posts");
      setPosts(response.data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError("Page not found. Please check the name.");
      } else if (status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(`Unexpected error (${status}). Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const lastItemIndex = currentPage * itemPerPage;
  const firstItemIndex = lastItemIndex - itemPerPage;

  const showPageItems = () => {
    setLoading(true);
    setVisibleItems(posts.slice(firstItemIndex, lastItemIndex));
    setLoading(false);
  };

  const start = posts.length === 0 ? 0 : firstItemIndex + 1;
  const end = Math.min(lastItemIndex, posts.length);
  const totalPages = Math.ceil(posts.length / itemPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleItemPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setItemPerPage(value);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={index} className="pagination-ellipsis">
            ...
          </span>
        );
      }

      return (
        <button
          key={index}
          className={`pagination-button ${
            currentPage === page ? "active" : ""
          }`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      );
    });
  };

  const itemOptions = [];
  for (let i = 10; i <= posts.length; i += 5) {
    itemOptions.push(i);
  }
  if (
    posts.length > 0 &&
    itemOptions[itemOptions.length - 1] !== posts.length
  ) {
    itemOptions.push(posts.length);
  }

  return (
    <>
      <div className="control-wrapper">
        <h1>Here are blog posts</h1>

        <div className="control-bar">
          <label htmlFor="itemLimit">Items per page:</label>
          <select
            id="itemLimit"
            value={itemPerPage}
            onChange={handleItemPerPageChange}
          >
            {itemOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600 mt-2 text-center">
          Showing {start} to {end} of {posts.length} results
        </div>
        <nav className="pagination-container">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          {renderPagination()}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </nav>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <AnimatePresence mode="wait">
          <motion.ul
            key={currentPage}
            className="post-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {visibleItems.map((post) => (
              <StaggeredWrapper
                key={post.id}
                direction="left"
                staggerDelay={0.1}
                duration={0.5}
              >
                <li className="post-card">
                  <h4>
                    <strong>Title:</strong> {post.title}
                  </h4>
                  <p>
                    <strong>Content:</strong> {post.body}
                  </p>
                </li>
              </StaggeredWrapper>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}

      <ErrorMessage message={error} />
    </>
  );
};

export default Posts;
