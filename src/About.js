import './App.css';
import React from 'react';
import Headbar from './Components/Headbar';
import Footer from './Components/Footer';
import img from './Pics/MewithTheyWhisper.JPG';
import insta from './Pics/instaicon.svg';
import email from './Pics/email.svg';
import youtube from './Pics/Youtubeicon.svg';


function About(){
    return(
    <div>
        <Headbar/>
        <div className="profilecol">
            <img className="profilepic" src={img} alt="profile"></img>
            <div className="des-wrapper">
                <div className="header">Artist Statement:</div>
                <div className="generaldes">Xuecong Wang <span className="generaldessc">王雪聪</span> (IPA:/wɑŋ çyɛ tsʰʊŋ/) lives and works in Sichuan, China, and New York, US. </div>
                <div className="generaldes">In an era marked by the rapid advancement of technology in domains such as the internet, social media, and artificial intelligence, the nature of things and people becomes ambiguous. Our knowledge and beliefs are heavily influenced by our surroundings—the tangible world and the cultural and historical contexts in which we find ourselves. There is no absolute truth, only the truth we believe in. This realization can make one feel small and seemingly irrelevant, but it also provides an advantage, allowing for a momentary retreat from the turmoil to observe the world from a distance. This is what I do in art—to find the “observed truth”.</div>
                <div className="generaldes">In my work, I reimagine the physical, cultural, and social environments that surround me. My pieces feature realistic portrayals of subjects and settings, yet they are situated within a surreal, dream-like pseudo-reality. The ambiguity of these spaces is achieved through the manipulation of light, which can be either insufficient or excessive.</div>
                <div className="generaldes">Occasionally, I employ a first-person perspective to reveal my cognitive and emotional responses to an environment. Through this approach, I explore the multifaceted nature of my own identity and dissect my psyche.  I hope that the audience will gain insights about the multifaceted nature of the world from these perspectives as well.</div>
            </div>
        </div>
        <div className="des-wrapper">
            <div className="header">Social Media:</div>
            <div className="contact">
                <a className="icon-wrapper"href="https://www.instagram.com/xc_wang.art?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                    <img className="icon" src={insta} alt="instagram icon"></img>
                    <div className="generaldes">Instagram</div>
                </a>
                <a className="icon-wrapper"href="mailto:xcatherine020202@gmail.com">
                    <img className="icon" src={email} alt="email icon"></img>
                    <div className="generaldes"> Email</div>
                </a>
                <a className="icon-wrapper"href="https://www.youtube.com/channel/UCxSwejYGGTz7fBi_y0iI7uQ" target="_blank" rel="noopener noreferrer">
                    <img className="icon" src={youtube} alt="youtube icon"></img>
                    <div className="generaldes">YouTube</div>
                </a>
            </div>
        </div>
        <Footer/>
    </div>
    );
}
export default About;

