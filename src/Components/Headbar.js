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
          <Link to="/" className="subtitlesc">Art 艺术</Link>
        </div>
        <div className="menubarcol">
          <Link to="/photography" className="subtitlesc">Photography 摄影</Link>
        </div>
        <div className="menubarcol">
          <Link to="/about" className="subtitlesc">About 关于</Link>
        </div>
        <div className="menubarcol">
          <Link to="/cv" className="subtitlesc">CV 简历</Link>
        </div>
      </div>
    </div>
  );
}

export default Headbar;
