import React from 'react';
import './App.css';
import Headbar from './Components/Headbar';
import Footer from './Components/Footer';

function Cv(){
    return(
    <div>
        <Headbar/>
        <div className="divider"></div>
        <div className="des-wrapper">
            <div className="header">Education:</div>
            <div className="generaldes">2021-2025 New York University</div>
            <div className="generaldes extra-indent">BFA: Studio Art, Minor: Psychology</div>
            <div className="header">Exhibitions:</div>
            <div className="generaldes">2025</div>
                <div className="generaldes extra-indent">Meditations in Blue, Saint Marks Arts, New York, NY</div>
            <div className="generaldes">2024</div>
                <div className="generaldes extra-indent">Multiplicities, Commons Gallery, New York, NY</div>
                <div className="generaldes extra-indent">Realism versus the Abstract, BWAC, Brooklyn, NY</div>
                <div className="generaldes extra-indent">Student Open Studio, Third North NYU, NY</div>
            <div className="generaldes">2023</div>
                <div className="generaldes extra-indent">Fingerfertigkeiten, St. Agnes, Berlin, Germany</div>
            <div className="generaldes">2022</div>
                <div className="generaldes extra-indent">NYU Earth Day Fair, Schwarz Plaza, New York, NY</div>
        </div>
        <div className="divider"></div>
        <div className="des-wrapper">
            <div className="header">Awards and Grants:</div>
            <div className="generaldes">2024</div>
            <div className="generaldes extra-indent">Chen Cui Artist Practice Award</div>
        </div>
        <div className="divider"></div>

        <Footer/>
    </div>
    );
}
export default Cv;

