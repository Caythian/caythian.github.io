import React from 'react';
import { Link } from 'react-router-dom';
import './Headbar.css';

function Headbar() {
  return (
    <div className="headbar-wrapper">
      <div className="headbar">
        <div className="title">Xuecong Wang</div>
        <div className="titlesc">王雪聪</div>
      </div>
      <div className="menubar">
        <div className="menubarcol">
          <Link to="/" className="subtitle">Art  <span className="subtitlesc">艺术</span></Link>
        </div>
        <div className="menubarcol">
          <Link to="/photography" className="subtitle">Photography <span className="subtitlesc">摄影</span></Link>
        </div>
        <div className="menubarcol">
          <Link to="/about" className="subtitle">About <span className="subtitlesc">关于</span></Link>
        </div>
        <div className="menubarcol">
          <Link to="/cv" className="subtitle">CV <span className="subtitlesc">简历</span></Link>
        </div>
      </div>
    </div>
  );
}

export default Headbar;
