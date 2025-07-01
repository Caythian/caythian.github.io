import "./App.css";
import React, { useEffect, useState } from "react";

import PostPopup from "./components/PostPopup";
import "./components/Artworks.css";
import "./components/Filter.css";
import "./Blog.css";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const imageCdnBaseUrl = import.meta.env.DEV
    ? "/api/image/"
    : "https://images.xuecong.art/";

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`/api/posts/tags`);
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const url = selectedTag ? `/api/posts/${selectedTag}` : `/api/posts`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [selectedTag]);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      <div className="filter-container">
        <button
          onClick={() => setSelectedTag(null)}
          className={selectedTag === null ? "active" : ""}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={selectedTag === tag ? "active" : ""}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="blog-posts-wrapper">
        {posts.map((post) => (
          <div
            className="blog-post-card"
            key={post.id}
            onClick={() => openModal(post)}
          >
            <img
              src={`${imageCdnBaseUrl}${post.bannerImage}`}
              alt={post.title}
              loading="lazy"
              className="blog-post-image"
            />
            <div className="blog-post-content">
              <div className="blog-post-tags">
                {post.tags &&
                  post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
              </div>
              <h3 className="blog-post-title">{post.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <PostPopup selectedPost={selectedPost} closeModal={closeModal} />
    </div>
  );
}
export default Blog;
