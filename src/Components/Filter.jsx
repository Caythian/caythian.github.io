import React from "react";
import "./Filter.css";

function Filter({ onFilter, selectedFilter }) {
  const handleFilterClick = (filter) => {
    onFilter(filter);
  };

  return (
    <div className="filter-wrapper">
      <div
        className={`filter-option ${selectedFilter === "painting" ? "active" : ""}`}
        onClick={() => handleFilterClick("painting")}
      >
        <span className="title">Paintings</span> <span className="titlesc">绘画</span>
      </div>
      <div
        className={`filter-option ${selectedFilter === "sculpture" ? "active" : ""}`}
        onClick={() => handleFilterClick("sculpture")}
      >
        <span className="title">Sculpture</span> <span className="titlesc">雕塑</span>
      </div>
      <div
        className={`filter-option ${selectedFilter === "installation" ? "active" : ""}`}
        onClick={() => handleFilterClick("installation")}
      >
        <span className="title">Installation</span> <span className="titlesc">装置</span>
      </div>
      <div
        className={`filter-option ${selectedFilter === "other" ? "active" : ""}`}
        onClick={() => handleFilterClick("other")}
      >
        <span className="title">Other</span> <span className="titlesc">其他</span>
      </div>
    </div>
  );
}

export default Filter;
