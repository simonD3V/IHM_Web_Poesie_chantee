import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className='footer-container'>
            <section className="social-media">
                <div className="social-media-wrap">
                    <div className="footer-logo">
                        <Link to='/' className='social-logo'>
                            ProjetTIMBRES <i className='fas fa-music' />

                        </Link>
                    </div>
                    <img className="iremus-logo" src="../../images/iremus-logo_1.png" />
                    <div className="social-icons">
                        <Link
                            className="social-icon-link facebook"
                            to='/'
                            aria-label='Facebook'
                        >
                            <i className="fab fa-facebook-f"></i>
                        </Link>
                        <Link
                            className="social-icon-link youtube"
                            to={'https://www.youtube.com/channel/UC45IULhh6mfqXjD72Ebiw4A'}
                            aria-label='Youtube'
                            target="_blank"
                        >
                            <i className="fab fa-youtube"></i>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Footer
