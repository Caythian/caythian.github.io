interface FilterProps {
  onFilter: (filter: string | null) => void;
  selectedFilter: string | null;
}

export default function Filter({ onFilter, selectedFilter }: FilterProps) {
  const handleFilterClick = (filter: string) => {
    if (selectedFilter === filter) {
      onFilter(null);
    } else {
      onFilter(filter);
    }
  };

  return (
    <div className="filter-wrapper">
      <button
        type="button"
        className={`filter-option ${selectedFilter === "painting" ? "active" : ""}`}
        onClick={() => handleFilterClick("painting")}
      >
        <span className="title">Painting</span>{" "}
        <span className="titlesc">绘画</span>
      </button>
      <button
        type="button"
        className={`filter-option ${selectedFilter === "sculpture" ? "active" : ""}`}
        onClick={() => handleFilterClick("sculpture")}
      >
        <span className="title">Sculpture</span>{" "}
        <span className="titlesc">雕塑</span>
      </button>
      <button
        type="button"
        className={`filter-option ${selectedFilter === "installation" ? "active" : ""}`}
        onClick={() => handleFilterClick("installation")}
      >
        <span className="title">Installation</span>{" "}
        <span className="titlesc">装置</span>
      </button>
      <button
        type="button"
        className={`filter-option ${selectedFilter === "other" ? "active" : ""}`}
        onClick={() => handleFilterClick("other")}
      >
        <span className="title">Other</span>{" "}
        <span className="titlesc">其他</span>
      </button>
    </div>
  );
}
