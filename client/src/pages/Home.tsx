import { Carousel } from "react-bootstrap";
import logo from "../images/logo.svg";
import search from "../images/search.png";
import search_mobile from "../images/search_mobile.png";
import visualisation from "../images/visualisation.png";
import visualisation_mobile from "../images/visualisation_mobile.png";
import tags from "../images/tags.png";
import tags_mobile from "../images/tags_mobile.png";
import settings from "../images/settings.png";
import settings_mobile from "../images/settings_mobile.png";

const Home = () => {
  const screenWidth = window.innerWidth;
  const useMobileImages = screenWidth <= 768;

  return (
    <div className="home-page">
      <div className="title-div">
        <img src={logo} alt="TaskMaster logo"></img>
        <h1>
          <span className="task-text">Task</span>
          <span className="master-text">Master</span>
        </h1>
      </div>

      <h5>Organise your tasks with ease using TaskMaster!</h5>

      <Carousel className="carousel-root" data-bs-theme="light">
        <Carousel.Item>
          <div>
            Gauge your productivity at a glance with helpful data
            visualisations.
          </div>
          <img
            src={useMobileImages ? visualisation_mobile : visualisation}
            alt="Task data visualisation screenshot."
          ></img>
          <Carousel.Caption>
            <h3>Dashboard page</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div>
            Optionally assign priorities and tags to tasks for easier task
            management.
          </div>
          <img
            src={useMobileImages ? tags_mobile : tags}
            alt="Task with priority and tags screenshot."
          ></img>
          <Carousel.Caption>
            <h3>Task grouping</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div>
            Sort, filter and search your tasks to easily find what you are
            looking for.
          </div>
          <img
            src={useMobileImages ? search_mobile : search}
            alt="Search functinality screenshot."
          ></img>
          <Carousel.Caption>
            <h3>Task searching</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div>
            Peronalise your experience with the help of various task-related
            settings.
          </div>
          <img
            src={useMobileImages ? settings_mobile : settings}
            alt="Task settings screenshot."
          ></img>
          <Carousel.Caption>
            <h3>Task settings</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <h4>Welcome to TaskMaster</h4>
      <p>
        TaskMaster is a web application which makes it incredibly simple and
        convenient to manage your tasks from your PC, phone or tablet. Simply{" "}
        <a href="/signup">create an account</a> to get started, or{" "}
        <a href="/login">log in</a> if you already have an account. If you have
        any issues, suggestions or feedback, you can reach out to us at{" "}
        <a href="taskmasterhq@gmail.com">taskmasterhq@gmail.com</a>.
      </p>
    </div>
  );
};

export default Home;
