import "./App.css";
import React from "react";
const imageCdnBaseUrl =
  import.meta.env.VITE_CDN_URL || "https://images.xuecong.art/";
const img = `${imageCdnBaseUrl}MewithTheyWhisper.JPG`;
const insta = `${imageCdnBaseUrl}instaicon.svg`;
const email = `${imageCdnBaseUrl}email.svg`;

function About() {
  return (
    <div>
      <div className="profilecol">
        <img className="profilepic" src={img} alt="profile"></img>
        <div className="des-wrapper">
          <div className="header">Artist Statement:</div>
          <div className="generaldes">
            Xuecong Wang <span className="generaldessc">王雪聪</span> (IPA:/wɑŋ
            çyɛ tsʰʊŋ/) lives and works in Sichuan, China, and New York,
            US.{" "}
          </div>
          <div className="generaldes">
            "My art is about human, or perhaps it is not. 
            It reflects on how, from a fragments of my experience, that a bigger picture of humanity unfolds.
            It is a bull charging into a vast variety of topics, mundane or peculiar. 
            Society is a cold-blooded machine run by people with hearts." 
          </div>
          <div className="generaldes">
            My art investigates the presence of subjectivity in an era encouraging reason and objective thinking. It shows the reciprocal nurturing between internal, unquantified qualities of humanity-such as emotion, memory, and belief- and individuals' perception of the external world. That is, for an individual, the fragment of the outer reality they choose to see often mirrors their soul. 
          </div>
          <div className="generaldes">
            My interest lies in the stories and concepts characterized by the tension between human intuitive responses and their objective explanations. By recreating them from a peculiar angle like first-person perspective, my art highlights the immediacy of the human protagonist and their mental states. 
          </div>
        </div>
      </div>
      <div className="contact-wrapper">
        <div className="header">Contact and Social Media:</div>
        <div className="contact">
          <a
            className="icon-wrapper"
            href="https://www.instagram.com/xc_wang.art?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="icon" src={insta} alt="instagram icon"></img>
            {/* <div className="generaldes">Instagram</div> */}
          </a>
          <a className="icon-wrapper" href="mailto:inquiry@xuecong.art">
            <img className="icon" src={email} alt="email icon"></img>
            {/* <div className="generaldes">Email</div> */}
          </a>
        </div>
      </div>
    </div>
  );
}
export default About;
