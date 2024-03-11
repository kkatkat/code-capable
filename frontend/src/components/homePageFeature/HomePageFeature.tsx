import './HomePageFeature.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function HomepageFeature(props: {icon: string; title: string; description: string}) {
    return (
        <div className="col mt-5 pe-5 HomepageFeature">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center bg-cclightblue text-white fs-2 mb-3">
            <i className={`bi ${props.icon}`}></i>
          </div>
          <h2>{props.title}</h2>
          <p>{props.description}</p>
        </div>
    )
}

export default HomepageFeature;