import { Link } from "react-router-dom";
import './HomePage.css';
import HomepageFeature from "../../components/homePageFeature/HomePageFeature";
import { useScrollToTop } from "../../common/lib";



function HomePage() {
    useScrollToTop();
    return (
        <div className="container-lg bg-light pb-5">
            <div className="row p-5 text-center mx-3 hero border-primary border" id="hero">
                <div className="col-lg-6 mx-auto my-5 py-5">
                    <div className="text-shadow">
                        <div className="display-6 text-light">Welcome to</div>
                        <h1 className="display-3 text-light">CodeCapable</h1>
                        <p className="lead fw-normal text-light">The definitive Python learning platform</p>
                    </div>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-lg-3 p-4 pb-5 ps-5">
                <HomepageFeature
                    title={`1784 problems so far`}
                    description={"Embark on your journey to become a Python master by solving real-world problems and challenges."}
                    icon={"bi-file-earmark-code"} />
                <HomepageFeature
                    title={"Beat the interviewers at their own game"}
                    description={"Our platform is designed to help you prepare for technical interviews and hackathons."}
                    icon={"bi-trophy"} />
                <HomepageFeature
                    title={"Completely free for you"}
                    description={"We don't charge you anything for using our platform. You can use it for free, forever."}
                    icon={"bi-piggy-bank"} />
            </div>
            <div className="row bg-ccdarkblue py-4 mt-5 justify-content-center mx-5 rounded-3">
                <div className="col-lg-3 justify-content-center">
                    <p className="text-light text-center">Still waiting?</p>
                    <div className="d-grid justify-content-center mb-4 mb-lg-0">
                        <Link to="/offers" className="btn btn-sm btn-primary px-5">See the problems</Link>
                    </div>
                </div>
                <div className="col-lg-3 justify-content-center">
                    <p className="text-light text-center">Contribute to the community</p>
                    <div className="d-grid justify-content-center mb-3 mb-lg-0">
                        <Link to="/create" className="btn btn-sm btn-primary px-5">Submit a problem</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;