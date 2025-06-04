import "./App.css";
import React, { useEffect, useState } from "react";
import Headbar from "./Components/Headbar";
import Footer from "./Components/Footer";
import PhotoDisplay from "./Components/PhotoDisplay";

function Blog() {
  return (
    <div>
      <Headbar />
      <div className="des-wrapper">
        <div className="generaldes">
          Photography, for Xuecong Wang, only acts as a documentation tool for
          her traveling and living experience. Therefore, it is entirely
          separated from her artistic practice, which is contemplative rather
          than aesthetically pleasing. Now (until the end of the season), this
          page features what she took in Savannah, Georgia, during the spring
          break. It will be updated seasonally.{" "}
        </div>
      </div>
      <PhotoDisplay />
      <Footer />
    </div>
  );
}
export default Blog;
