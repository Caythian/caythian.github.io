import React,{ useState, useEffect } from "react";
import "./App.css";
import Headbar from "./Components/Headbar";
import Footer from "./Components/Footer";
import Artworkdisplay from "./Components/Artworks";
import Starter from "./Components/Artpage";
import Filter from "./Components/Filter";

function App() {
  const [headbarOnTop, setHeadbarOnTop] = useState(false);

  useEffect(() => {
      const handleScroll = () => {
        const starterHeight = document.querySelector('.Starter')?.offsetHeight || 0;
        if (window.scrollY > 10) {
          setHeadbarOnTop(true);
        } else {
          setHeadbarOnTop(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  return (
    <div>
      <Starter />
      <Headbar style={{ zIndex: headbarOnTop ? 2 : 1 }} />
      <Filter />
      <Artworkdisplay />
      <Footer />
    </div>
  );
}

export default App;
