import React from "react";
import Banner from "../Components/Home/Banner";
import Products from "../Components/Home/Products";

const Home = () => {
  return (
    <div>
      <Banner />
      <div className="w-full bg-gray-100 py-10 -mt-[150px] lg:-mt-[380px] ">
      <Products />
      </div>
    </div>
  );
};

export default Home;