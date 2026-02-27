import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div>
          <div className='footer-logo'>
            <Link to='/' className='logo'>
              <img
                src='/images/rainboots_logo_light.png'
                alt='Rainboots Marketing'
              />
            </Link>
          </div>
          <p className='footer-desc'>
            A Seattle-based team of seasoned marketers, developers, and
            engineers dedicated to growing your business through strategic
            marketing.
          </p>
        </div>

        <div className='footer-section'>
          <h4>Services</h4>
          <ul>
            <li>
              <Link to='/services#outbound'>Outbound Marketing</Link>
            </li>
            <li>
              <Link to='/services#web'>Web Design & Development</Link>
            </li>
            <li>
              <Link to='/services#acquisition'>Customer Acquisition</Link>
            </li>
            <li>
              <Link to='/services#lifecycle'>Lifecycle Optimization</Link>
            </li>
            <li>
              <Link to='/services#social'>Social Media Marketing</Link>
            </li>
            <li>
              <Link to='/services#branding'>Branding & Design</Link>
            </li>
          </ul>
        </div>

        <div className='footer-section'>
          <h4>Company</h4>
          <ul>
            <li>
              <Link to='/about'>About Us</Link>
            </li>
            <li>
              <Link to='/about#team'>Our Team</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
          </ul>
        </div>

        <div className='footer-section'>
          <h4>Legal</h4>
          <ul>
            <li>
              <a href='/privacy'>Privacy Policy</a>
            </li>
            <li>
              <a href='/terms'>Terms & Conditions</a>
            </li>
          </ul>
        </div>
      </div>

      <div className='footer-bottom'>
        © {currentYear} Rainboots LLC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
