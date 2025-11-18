import React from "react";
import "./Cv.css";

function Cv() {
  return (
    <div>
      <div className="cv-header-wrapper">
        <div className="header">
          CV <span className="headersc">简历</span>
        </div>
        <div className="cv-caption">Last update: October 2025</div>
        <a
          href="/Xuecong_ArtResumeOct2025.pdf"
          download="Xuecong_ArtResumeOct2025.pdf"
          className="download-link"
        >
          Download CV
        </a>
      </div>
      <div className="des-wrapper">
        <div className="header">Education:</div>
        <div className="generaldes">2021-2025 New York University</div>
        <div className="generaldes extra-indent">
          BFA: Studio Art, Minor: Psychology
        </div>
        <div className="header">Exhibition Highlights:</div>
        <div className="generaldes">2025</div>
        <div className="generaldes extra-indent">
          16th Annual Figurative Art Exhibition, Lore Degenstein Gallery, Selinsgrove, PA
        </div>
        <div className="generaldes extra-indent">
          Spectrum: A Multidisciplinary Gallery&Reading, Brown Sugar Lit, Brooklyn, NY
        </div>
        <div className="generaldes extra-indent">
          Half Wind, Half Still, A Space Gallery, Brooklyn, NY
        </div>
        <div className="generaldes extra-indent">
          NYU ISAI Public Showcase, La MaMa Theatre, New York, NY
        </div>
        <div className="generaldes extra-indent">
          Timeless Theatrics, Commons Gallery, New York, NY
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
        <div className="header">Awards and Grants:</div>
        <div className="generaldes">2025</div>
        <div className="generaldes extra-indent">
          NYU Founder's Day Award
        </div>
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
