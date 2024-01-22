import React from 'react';
import './App.css';
import Headbar from './Components/Headbar';
import Footer from './Components/Footer';

function Cv(){
    return(
    <div>
        <Headbar/>
        <div className="divider"></div>
        <div className="generaldes">This page is in progress I know:( Will update soon</div>
        <div className="divider"></div>

        <Footer/>
    </div>
    );
}
export default Cv;

