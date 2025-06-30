import React from "react";
import "./Popup.css";
import left from "./left.svg";
import right from "./right.svg";

const PostPopup = ({ selectedPost, closeModal }) => {
  if (!selectedPost) {
    return null;
  }

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <div className="popup-details">
          <h2>{selectedPost.title}</h2>
          <p className="publish-date">
            Published on:{" "}
            {new Date(selectedPost.publishedAt).toLocaleDateString()}
          </p>
          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <p className="tags">Tags: {selectedPost.tags.join(", ")}</p>
          )}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
