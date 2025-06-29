import "./App.css";
import React, { useEffect, useState } from "react";
import Headbar from "./components/Headbar";
import Footer from "./components/Footer";
import PostPopup from "./components/PostPopup";
import "./components/Artworks.css";
import "./components/Filter.css";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const imageCdnBaseUrl = "/api/image/";
  const apiBaseUrl = "/api";

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/posts/tags`);
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
      const url = selectedTag
        ? `${apiBaseUrl}/posts/${selectedTag}`
        : `${apiBaseUrl}/posts`;
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
      <Headbar />
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
      <div className="artworkgallery-wrapper">
        {posts.map((post) => (
          <div
            className="artworkgallery"
            key={post.id}
            onClick={() => openModal(post)}
          >
            <img
              src={`${imageCdnBaseUrl}${post.bannerImage}`}
              alt={post.title}
              loading="lazy"
            />
            <div className="overlay">{post.title}</div>
          </div>
        ))}
      </div>
      <PostPopup selectedPost={selectedPost} closeModal={closeModal} />
      <Footer />
    </div>
  );
}
export default Blog;
