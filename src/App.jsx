import React from "react";
import "./App.css";
import Headbar from "./Components/Headbar";
import Footer from "./Components/Footer";
import Artworkdisplay from "./Components/Artworks";
import Starter from "./Components/Artpage";
import Filter from "./Components/Filter";

function App() {
  return (
    <div>
      <Headbar />
      <Starter />
      <Filter />
      <Artworkdisplay />
      <Footer />
    </div>
  );
}

export default App;
