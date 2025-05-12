import { useState, useEffect } from "react";
import axios from "./axios";
import "./Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/comments");
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
        {posts.map((post) => {
          return (
            <li key={post.id} className="post-card">
              <h4>Name: {post.name} </h4>
              <h5>Email: {post.email} </h5>
              <p> {post.body} </p>
            </li>
          );
        })}
      </ul>

      {/* {loading !== false && <p>⏳ Loading posts...</p>} */}
      {loading !== false && (
        <div className="loading-spinner">
          <div className="circle-loader"></div> Loading posts...
        </div>
      )}

      {/* {error !== "" && <p style={{ color: "red" }}>{error}</p>} */}
      {error !== "" && <div className="error-message">{error}</div>}
    </>
  );
};

export default Posts;
