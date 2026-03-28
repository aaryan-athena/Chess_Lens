import Header from "./header";
import NavButton from "./navButton";

const Home = () => {
  return (
    <div className="container-flex d-flex overflow-hidden h-100 flex-column p-0 m-0 text-center text-white bg-dark">
      <Header />
      <div className="row m-2">
        <div className="col">
          <NavButton text="Upload" />
        </div>
        <div className="col">
          <NavButton text="Record" />
        </div>
      </div>
    </div>
  );
};

export default Home;
