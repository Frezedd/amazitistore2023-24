import React, { useEffect, useRef, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import HeaderBottom from "./HeaderBottom";

import { logo } from "../../assets/index";
import { allItems } from "../../Constants/Items";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSignOut } from "../../redux/amazonSlice";

const Header = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.amazon.products);

  const userInfo = useSelector((state) => state.amazon.userInfo);

  const ref = useRef();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (e.target.contains(ref.current)) {
        showAll && setShowAll(false);
      }
    });
  }, [ref, showAll]);

  const handlelogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out Successfully");
        dispatch(userSignOut());
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="w-full bg-amazon_green text-white px-4 py-2 flex md:justify-between items-center gap-2 md:gap-4 lgl:gap-2 xl:gap-4">
        {/* ***************Image start here********************** */}
        <Link to="/">
          <div className="headerHover">
            <img className="w-24 mt-2 " src={logo} alt="logo" />
          </div>
        </Link>
        {/* ****************Image ends here********************* */}

        {/* ****************Deliver start here********************* */}
        <div className="hidden md:inline-flex headerHover">
          <LocationOnIcon />
          <p className="flex flex-col text-xs text-lightText font-light">
            Deliver to{""}
            <span className="text-sm font-semibold -mt-1 text-whiteText">
              Update location
            </span>
          </p>
        </div>
        {/* ****************Deliver ends here********************* */}

        {/* ****************Search start here********************* */}
        <div className="hidden lgl:inline-flex h-10 rounded-md flex-grow relative">
          <span
            onClick={() => setShowAll(!showAll)}
            className="w-14 h-full bg-gray-200 hover:bg-gray-300 border-2 cursor-pointer duration-300 text-sm text-amazon_blue font-titleFont flex items-center justify-center rounded-tl-md rounded-bl-md">
            All
            <span>
              <ArrowDropDownIcon />
            </span>
          </span>

          {showAll && (
            <div>
              <ul className="absolute w-56 h-80 top-10 left-0 overflow-y-scroll overflow-x-hidden bg-white border-[1px] border-amazon_blue text-black p-2 flex flex-col gap-1 z-50">
                {allItems.map((item) => (
                  <li
                    key={item._id}
                    className="text-sm tracking-wide font-titleFont border-b-[1px] border-b-transparent hover:border-b-amazon_blue cursor-pointer duration-200">
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input
            className="h-full text-base text-amazon_blue flex-grow outline-none border-none px-2"
            type="text"
          />

          <span className="w-12 h-full flex items-center justify-center bg-amazon_yellow hover:bg-[#f3a847] duration-300 text-amazon_blue cursor-pointer rounded-tr-md rounded-br-md">
            <SearchIcon />
          </span>
        </div>

        {/* ****************Search ends here********************* */}

        {/* ****************Signin start here********************* */}
        <Link to="/signin">
          <div className="flex flex-col items-start justify-center headerHover">
            {userInfo ? (
              <p className="text-sm text-gray-100 font-medium">
                {userInfo.userName}
              </p>
            ) : (
              <p className="text-xs text-lightText font-light">
                Hello, sign in
              </p>
            )}
            <p className="hidden md:inline-flex text-sm font-semibold -mt-1 text-whiteText">
              Accounts & Lists{""}
              <span>
                <ArrowDropDownIcon />
              </span>
            </p>
          </div>
        </Link>
        {/* ****************Signin ends here********************* */}

        {/* *****************Orders start here******************** */}
        <Link to='/order'>
          <div className="hidden mdl:flex flex-col items-start justify-center headerHover">
            <p className="text-xs text-lightText font-light">Returns</p>

            <p className="text-sm font-semibold -mt-1 text-whiteText">
              & Orders
            </p>
          </div>
        </Link>

        {/* ******************Orders ends here******************* */}

        {/* ******************Cart start here******************* */}
        <Link to="/cart">
          <div className="flex items-start justify-center headerHover relative">
            <ShoppingCartOutlinedIcon />

            <p className="hidden sm:inline-flex text-xs font-semibold mt-3 text-whiteText">
              Cart {""}
              <span className="absolute text-xs top-0 left-6 w-4 font-semibold p-1 h-4 bg-[#f3a847] text-amazon_blue rounded-full flex justify-center items-center">
                {products.length > 0 ? products.length : 0}
              </span>
            </p>
          </div>
        </Link>
        {/* ******************Cart ends here******************* */}

        {/* ******************Logout******************* */}

        {userInfo && (
          <div
            onClick={handlelogout}
            className="flex flex-col justify-center items-center headerHover relative">
            <LogoutIcon />
            <p className="hidden mdl:inline-flex text-xs font-semibold text-whiteText">
              Log out
            </p>
          </div>
        )}
      </div>
      <HeaderBottom />
    </div>
  );
};

export default Header;
