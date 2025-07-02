import "./App.css";
import React, { useEffect, useState } from "react";
import BlogFilter from "./components/Blogfilter";
import PostPopup from "./components/PostPopup";
import "./components/Filter.css";
import "./Blog.css";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const imageCdnBaseUrl = import.meta.env.DEV
    ? "/api/image/"
    : "https://images.xuecong.art/";

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedPost]);

  useEffect(() => {
    const fetchPosts = async () => {
      const url = selectedFilter
        ? `/api/posts/${selectedFilter}`
        : `/api/posts`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [selectedFilter]);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };
  const handleFilter = (filterType) => {
    setSelectedFilter((prevFilter) => {
      if (prevFilter === filterType) {
        return null;
      } else {
        return filterType;
      }
    });
  };
  return (
    <div>
      <div className="blog-header-wrapper">
          <div className="header">Blog <span className="headersc">博客</span></div>
      </div>
      <BlogFilter onFilter={handleFilter} selectedFilter={selectedFilter} />
      <div className="blog-gallery-wrapper">
        {posts.map((post) => (
          <div
            className="blog-gallery"
            key={post.id}
            onClick={() => openModal(post)}
          >
            <div className="blog-image-container">
              <img
                src={`${imageCdnBaseUrl}${post.bannerImage}`}
                alt={post.title}
                loading="lazy"
              />
              <div className="blog-overlay">{post.title}</div>
            </div>
            <div className="blog-info">
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-date">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <PostPopup
        selectedPost={selectedPost}
        closeModal={closeModal}
        imageCdnBaseUrl={imageCdnBaseUrl}
      />
    </div>
  );
}
export default Blog;
