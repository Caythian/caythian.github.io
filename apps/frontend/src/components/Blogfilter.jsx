import React from "react";
import "./Filter.css";

function BlogFilter({ onFilter, selectedFilter }) {
  const handleFilterClick = (filter) => {
    onFilter(filter);
  };

  return (
    <div>
    <div className="divider"></div>
    <div className="filter-wrapper">
      <div
        className={`filter-option ${selectedFilter === "artrelated" ? "active" : ""}`}
        onClick={() => handleFilterClick("artrelated")}
      >
        <span className="title">Art Related</span>{" "}
        <span className="titlesc">艺术相关</span>
      </div>
      <div
        className={`filter-option ${selectedFilter === "life" ? "active" : ""}`}
        onClick={() => handleFilterClick("life")}
      >
        <span className="title">Life</span>{" "}
        <span className="titlesc">生活</span>
      </div>
      <div
        className={`filter-option ${selectedFilter === "photography" ? "active" : ""}`}
        onClick={() => handleFilterClick("photography")}
      >
        <span className="title">Photography</span>{" "}
        <span className="titlesc">摄影</span>
      </div>
      <div
        className={`filter-option ${selectedFilter === "inspiration" ? "active" : ""}`}
        onClick={() => handleFilterClick("inspiration")}
      >
        <span className="title">Inspiration</span>{" "}
        <span className="titlesc">灵感</span>
      </div>
      
    </div>
    </div>
  );
}

export default BlogFilter;
