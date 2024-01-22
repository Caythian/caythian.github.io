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
                <div className="generaldes">Honestly, it is not a good idea for me to write a “solid” statement for my art. I have heard how much people would struggle for “a style” at the beginning of their art career. I have not yet started my art career. As a BFA senior at New York University, much of my practice today involves delving into learning new techniques and named assignments. There’s not much space for me to express myself somehow. However, I find myself squeezing ideas into those assignments as much as possible. And most recently, I discovered what I want to work on. </div>
                <div className="generaldes">I don’t know my style, but I prefer to work with watercolor at the moment. In my most recent piece <span className="generaldesita"> They Whisper</span>, featured in the exhibition “Finger Fertig Keiten” in Berlin, I employed watercolor as the prime medium. In the process of creating this piece, I challenged myself with unpredictability, something I would have hated in the past. Going in a good plan was the way to go in my life and creation. But as the forthcoming graduation and “where to go after graduation” crises became more and more urgent, I fear unpredictability. Watercolor is how I confront unpredictability using my art. In creating <span className="generaldesita">They Whisper</span>, I dripped two streams of colors on my paper for water flows to encounter and interact freely, while not expecting to see the result until a day later. By accepting the lack of control in this medium, I unconsciously respond to my internal turmoil about impending crises. </div>
                <div className="generaldes">Then, irreversibility is another appreciated quality of watercolor. Every brushstroke is irreversible, and thus it needs to be carefully put with a careful amount of water, or a whole painting will be ruined by a splash. This is not something that I was aware of in my previous work with acrylics or digital pieces until I experimented with watercolor for <span className="generaldesita">They Whisper</span>. I admire the maneuver of the intricate balance between pigments and water, as well as the determinacy that a watercolor artist possesses when they paint. More importantly, the possibility for viewers to perceive artists’ physical movement and emotional involvement in the watercolor piece is sentimental, quiet, and tender.</div>
                <div className="generaldes">It wasn’t until finishing <span className="generaldesita">They Whisper</span> that I found watercolor as the medium reflecting my ultimate theme: fragility. Watercolor painting, compared to the other paintings, is more vulnerable to environmental conditions like light and humidity. It coincides with the characteristics of the topics I worked with- nature’s darkness invaded by artificial light in <span className="generaldesita">They Whisper</span>, fading culture in On Horseback, and death and preservation in Taxidermy Studio- they all weave into the web called fragility. May there be no style established for me, but may that theme linger with watercolor. </div>
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

