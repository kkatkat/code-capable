import logo from '../../assets/logo_cc.png';
import { Link } from "react-router-dom";


function Footer() {

    function focusSearchBar () {
        document.getElementById("searchBar")?.focus();
        scrollToTop();
    }

    function scrollToTop () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="container Footer">
            <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 mt-5 border-top">
                <div className="col mb-3">
                    <a href="/" className="d-flex align-items-center mb-3 link-dark text-decoration-none">
                    <img src={logo} height="35" className="d-inline-block align-top" />
                    </a>
                </div>

                <div className="col mb-3">
                    <h5>Follow us</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted"><i className="bi bi-twitter-x me-2"></i>Twitter</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted"><i className="bi bi-instagram me-2"></i>Instagram</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted"><i className="bi bi-linkedin me-2"></i>Linkedin</a></li>
                    </ul>
                </div>

                <div className="col mb-3">
                    <h5>About us</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Careers</a></li>
                        <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Contact</a></li>
                        <li className="nav-item mb-2"><Link to="/privacy-policy" className="nav-link p-0 text-muted">Privacy policy</Link></li>
                    </ul>
                </div>

                <div className="col mb-3">
                    <h5>Problems</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><Link to="/create" className="nav-link p-0 text-muted">Submit a problem</Link></li>
                        <li className="nav-item mb-2"><Link to="/offers" className="nav-link p-0 text-muted">View all</Link></li>
                        <li className="nav-item mb-2"><Link to="#" className="nav-link p-0 text-muted" onClick={focusSearchBar}>Search</Link></li>
                    </ul>
                </div>

                <div className="col mb-3">
                    <h5>Account</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2"><Link to="/signup" className="nav-link p-0 text-muted" onClick={scrollToTop}>Sign up</Link></li>
                        <li className="nav-item mb-2"><Link to="/login" className="nav-link p-0 text-muted" onClick={scrollToTop}>Log in</Link></li>
                        <li className="nav-item mb-2"><Link to="/correspondences" className="nav-link p-0 text-muted" onClick={scrollToTop}>My profile</Link></li>
                    </ul>
                </div>
            </footer>
        </div>
    )
}

export default Footer;
