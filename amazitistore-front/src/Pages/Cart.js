import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  deleteItem,
  resetCart,
  inCrementQuantity,
  deCrementQuantity,
} from "../redux/amazonSlice";
import { emptyCart } from "../assets/index";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.amazon.products);
  const isAuthenticated = useSelector((state) => state.amazon.userInfo !== null);

  const [totalPrice, setTotalPrice] = useState("");

  useEffect(() => {
    console.log("Inside useEffect, calculating total price...");
    let price = 0;
    products.forEach((item) => {
      price += item.price * item.quantity;
    });
    setTotalPrice(price.toFixed(2));
  }, [products]);

  
  const handleProceedToBuy = (e) => {
    e.preventDefault();
    // console.log("Handling proceed to buy...");
  
    if (isAuthenticated) {
      
      if (products.length > 0) {
        // console.log("Products are available. Proceeding to checkout...");
  
        navigate("/checkout");
      } 
    } else {
      // console.log("User is not authenticated. Redirecting to login...");
      navigate("/signin");
    }
  };
  
  console.log("Finished rendering Cart component.");

  return (
    <div className="w-full bg-gray-100 p-4">
      {products.length > 0 ? (
        <div className="container mx-auto h-auto grid grid-cols-5 gap-8">
          <div className="w-full bg-white px-4 col-span-5 xl:col-span-4">
            <div className="font-titleFont  xl:flex items-center justify-between border-b-[1px] border-b-gray-400 py-3">
              <h1 className="text-3xl font-semibold">Shopping Cart</h1>
              <h3 className="text-xl font-semibold animate-bounce hidden xl:flex">
                Subtotal
              </h3>
            </div>
            <div>
              {products.map((item) => (
                <div
                  key={item.id}
                  className="w-full border-b-[1px] border-b-gray-300 p-4 md:p-0 md:py-4 flex items-center gap-6"
                >
                  <div className="w-full flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-2/5 xl:w-1/5">
                      <img
                        className="w-full h-44 object-contain"
                        src={item.image}
                        alt="productImg"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-2 xl:gap-1">
                      <h2 className="font-semibold text-lg">{item.title}</h2>
                      <p className="xl:pr-10 text-sm">{item.description}</p>
                      <p className="text-base">
                        Unit Price:{" "}
                        <span className="font-semibold text-green-600">
                          ${item.price}
                        </span>
                      </p>
                      <div className="bg-[#F0F2F2] flex justify-center items-center gap-2 w-36 py-1 text-center drop-shadow-lg rounded-md">
                        <p className="text-base font-normal">Qty:</p>
                        <p
                          onClick={() => {
                            dispatch(deCrementQuantity(item.id));
                          }}
                          className="cursor-pointer bg-gray-200 px-2 rounded-sm hover:bg-gray-400 font-semibold duration-300"
                        >
                          -
                        </p>
                        <p className="font-titleFont text-base font-semibold text-amazon_blue">
                          {item.quantity}
                        </p>
                        <p
                          onClick={() => dispatch(inCrementQuantity(item.id))}
                          className="cursor-pointer bg-gray-200 px-2 rounded-sm hover:bg-gray-400 font-semibold duration-300"
                        >
                          +
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(deleteItem(item.id))}
                        className="bg-red-500 w-36 py-1 rounded-lg text-white mt-2 hover:bg-red-700 active:bg-red-900 duration-300"
                      >
                        Delete Item
                      </button>
                    </div>
                    <div className="w-full md:w-24">
                      <p className="text-lg xl:w-24 font-titleFont font-semibold text-green-600 animate-bounce">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div onClick={() => dispatch(resetCart())} className="w-full py-4">
              <button className="px-10 py-2 bg-red-500 hover:bg-red-600 active:bg-red-500 text-white rounded-lg font-titleFont font-semibold text-lg tracking-wide">
                Clear Cart
              </button>
            </div>
          </div>

          <div className="col-span-5 md:col-span-3 lg:col-span-2 xl:col-span-1 bg-white h-52 flex items-center p-4">
            <div>
              <p className="flex gap-2 items-start text-sm">
                <span>
                  <CheckCircleIcon className="bg-white text-green-500 rounded-full" />
                </span>
                Your order qualifies for FREE Shipping. Choose this option at
                checkout. See details....
              </p>
              <div>
                <p className="font-semibold px-6 py-1 flex items-center justify-between">
                  Total: <span className="text-lg font-bold">${totalPrice}</span>
                </p>
              </div>
              <Link to="/checkout">
              {isAuthenticated && (
                <button
                  onClick={handleProceedToBuy}
                  // disabled={!isAuthenticated || products.length === 0} 
                  className="w-full font-titleFont font-medium text-base bg-gradient-to-tr from-yellow-400 to-yellow-200 border hover:from-yellow-300 hover:to-yellow-400 border-yellow-500 hover:border-yellow-700 active:bg-gradient-to-bl active:from-yellow-400 active:to-yellow-500 duration-200 py-1.5 rounded-md mt-3" >

                  Proceed to Buy
                </button>
                )}
              </Link>
              {!isAuthenticated && (
                <p className="flex flex-col items-center text-xs mt-3 text-red-500 font-semibold animate-bounce">
                  Please Sign In to continue
                </p>
              )}
            </div>
          </div>
        </div>

      ) : (
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center items-center gap-4 py-10"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="w-96 p-4 bg-white flex  flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-boldha">
              Your Amazon Cart is empty.
            </h1>
            <p className="text-sm text-center group ">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              groceries, clothing, household supplies, electronics, and more.
              Continue shopping on the{" "}
              <Link to="/">
                <span className="text-blue-600 group-hover:text-orange-700 group-hover:underline underline-offset-1">
                  Amazon.com{" "}
                </span>
              </Link>
            </p>
            <Link to="/">
              <button className="mt-6 bg-yellow-400 rounded-md cursor-pointer hover:bg-yellow-500 active:bg-yellow-700 px-8 py-2 font-titleFont font-semibold text-lg">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;


