import React from "react";
import { useState, useEffect } from "react";


const Loader = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      {/* {loading !== false && <p>⏳ Loading posts...</p>} */}
      {loading !== false && (
        <div className="loading-spinner">
          <div className="circle-loader"></div> Loading posts...
        </div>
      )}
    </div>
  );
};

export default Loader;
