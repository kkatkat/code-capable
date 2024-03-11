import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../../assets/logo_cc.png'
import user from '../../assets/user.png'
import { UserContext } from "../../UserProvider";
import './NavBar.css';

function NavBar() {

  const { loggedUser, setLoggedUser } = useContext(UserContext)
  const [searchTerm, setSearchTerm] = useState<string>();
  const nav = useNavigate();

  const logOut = (e: any) => {
    e.preventDefault();
    setLoggedUser(null);
    window.localStorage.removeItem('accessToken');
    toast.success("You have been logged out.");
    nav('/');
  }

const handleSearchBarChange = (e: any) => {
    setSearchTerm(e.target.value);
}

  return (
    <div className="NavBar">
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom fixed-top border-primary border-1">
        <div className="container-lg">
          <Link to="/" className="navbar-brand">
            <img src={logo} height="35" className="d-inline-block align-top" />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-5 me-auto mb-2 mb-lg-0">
              <li className="nav-item me-2">
                <Link to="/problems" className="nav-link">Problems</Link>
              </li>
              <li className="nav-item dropdown me-2">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categories
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#">Array</a></li>
                  <li><a className="dropdown-item" href="#">String</a></li>
                  <li><a className="dropdown-item" href="#">Hash Table</a></li>
                  <li><a className="dropdown-item" href="#">Dynamic Programming</a></li>
                  <li><a className="dropdown-item" href="#">Math</a></li>
                  <li><a className="dropdown-item" href="#">Sorting</a></li>
                  <li><a className="dropdown-item" href="#">Depth-First Search</a></li>
                  <li><a className="dropdown-item" href="#">Database</a></li>
                  <li><a className="dropdown-item" href="#">Binary Search</a></li>
                  <li><a className="dropdown-item" href="#">Tree</a></li>
                </ul>
              </li>
              <li className="nav-item me-2">
                <Link to="/create" className="nav-link">Submit a problem</Link>
              </li>
            </ul>
            <form className="d-flex mx-5 mx-lg-0">
              <input className="form-control me-2" id="searchBar" type="search" placeholder="Search for problems" aria-label="Search" onChange={handleSearchBarChange}/>
              <button className="btn btn-outline-primary border-0" type="submit"><i className="bi bi-search"></i></button>
            </form>
            {
              loggedUser && <div className="dropdown pt-3 pb-2 pb-lg-0 pt-lg-0 ms-lg-4 ms-5">
                <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={user} width="35" height="35" className="rounded-circle" />
                </a>
                <ul className="dropdown-menu text-small mt-2">
                  <li><span className="text-muted ms-3">{loggedUser?.username}John Doe</span></li>
                  <li><Link to="/create" className="dropdown-item">Submit a problem</Link></li>
                  <li><Link to={`/profile/${loggedUser?.id}`} className="dropdown-item">My profile</Link></li>
                  {
                    loggedUser?.role === 'admin' && 
                    <li><Link to="/adminpanel" className="dropdown-item">Admin panel</Link></li>
                  }
                  <li><hr className="dropdown-divider" /></li>
                  <li><a onClick={logOut} className="dropdown-item" href="#">Sign out</a></li>
                </ul>
              </div>
            }
            {
              loggedUser === null && <>
                <Link to='/login' className="btn btn-outline-primary ms-2">Login</Link>
                <Link to='/signUp' className="btn btn-primary ms-2">Sign up</Link>
              </>
            }

          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavBar;