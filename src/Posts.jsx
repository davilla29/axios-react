import { useState, useEffect } from "react";
import axios from "./axios";
import "./Posts.css";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/posts");
      setPosts(response.data);
    } catch (err) {
      console.error(err.message);
      setError(`❌ Failed to fetch posts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Here are blog comments</h1>
      <ul className="post-list">
        {posts.slice(0, 10).map((post) => {
          return (
            <li key={post.id} className="post-card">
              <h4>
                <strong>Title:</strong> {post.title}
              </h4>
              <p>
                <strong>Content:</strong> {post.body}{" "}
              </p>
            </li>
          );
        })}
      </ul>

      {loading === true && <Loader />}

      <ErrorMessage message={error} />
    </>
  );
};

export default Posts;
