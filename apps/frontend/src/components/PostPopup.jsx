import React from "react";
import "./PostPopup.css";

function PostPopup({ selectedPost, closeModal, imageCdnBaseUrl }) {
  if (!selectedPost) return null;

  return (
    <div className="blog-popup-overlay" onClick={closeModal}>
      <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
        <span className="blog-close" onClick={closeModal}>
          &times;
        </span>
        <div className="blog-modal-content">
          <img
            src={`${imageCdnBaseUrl}${selectedPost.bannerImage}`}
            alt={selectedPost.title}
            className="blog-popup-banner"
          />
          <h2 className="blog-popup-title">{selectedPost.title}</h2>
          <div className="blog-popup-meta">
            <span>
              Published on:{" "}
              {new Date(selectedPost.publishedAt).toLocaleDateString()}
            </span>
            <div className="blog-popup-tags">
              {selectedPost.tags &&
                selectedPost.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
            </div>
          </div>
          <div
            className="blog-popup-content"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default PostPopup;
