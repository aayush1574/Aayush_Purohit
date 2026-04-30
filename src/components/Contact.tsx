import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="mailto:aayush.purohit150704@gmail.com"
                data-cursor="disable"
              >
                aayush.purohit150704@gmail.com
              </a>
            </p>
            <p>
              <a href="tel:+917225083904" data-cursor="disable">
                +91-7225083904
              </a>
            </p>
            <p>Vidisha, Madhya Pradesh</p>
            <h4>Education</h4>
            <p>
              B.Tech CSE (Blockchain Technology), Samrat Ashok Technological
              Institute, Vidisha — 2022–2026
            </p>
            <p>
              Higher Secondary, New Shanti Niketan HSS, Vidisha — 2020–2022
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/aayush1574"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/aayush-purohit-17a440369/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="https://portfolio-website-jade-nine-84.vercel.app/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Portfolio <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Aayush Purohit</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
