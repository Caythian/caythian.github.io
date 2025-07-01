import React from "react";
import "./Cv.css";

function Cv() {
  return (
    <div>
      <div className="cv-header-wrapper">
        <div className="header">CV <span className="headersc">简历</span></div>
        <div className="cv-caption">Last update: June 2025</div>
        <a href="/Xuecong_ArtResumeJun2025.pdf" download="Xuecong_ArtResumeJun2025.pdf" className="download-link">
          Download CV
        </a>
      </div>
      <div className="des-wrapper">
        <div className="header">Education:</div>
        <div className="generaldes">2021-2025 New York University</div>
        <div className="generaldes extra-indent">
          BFA: Studio Art, Minor: Psychology
        </div>
        <div className="header">Exhibitions:</div>
        <div className="generaldes">2025</div>
        <div className="generaldes extra-indent">
          NYU ISAI Public Showcase, La MaMa Theatre, New York, NY
        </div>
        <div className="generaldes extra-indent">
          Timeless Theatrics, Commons Gallery, New York, NY
        </div>
        <div className="generaldes extra-indent">
          Meditations in Blue, Saint Marks Arts, New York, NY
        </div>
        <div className="generaldes">2024</div>
        <div className="generaldes extra-indent">
          Multiplicities, Commons Gallery, New York, NY
        </div>
        <div className="generaldes extra-indent">
          Realism versus the Abstract, BWAC, Brooklyn, NY
        </div>
        <div className="generaldes extra-indent">
          Student Open Studio, Third North NYU, NY
        </div>
        <div className="generaldes">2023</div>
        <div className="generaldes extra-indent">
          Fingerfertigkeiten, St. Agnes, Berlin, Germany
        </div>
        <div className="generaldes">2022</div>
        <div className="generaldes extra-indent">
          NYU Earth Day Fair, Schwarz Plaza, New York, NY
        </div>
      
        <div className="header">Awards and Grants:</div>
        <div className="generaldes">2025</div>
        <div className="generaldes extra-indent">
           NYU Student Excellence Award
        </div>
        <div className="generaldes">2024</div>
        <div className="generaldes extra-indent">
          Chen Cui Artist Practice Award
        </div>
        </div>
      <div className="divider"></div>
    </div>
  );
}
export default Cv;
