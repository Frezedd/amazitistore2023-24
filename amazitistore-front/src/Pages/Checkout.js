import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetCart } from "../redux/amazonSlice";
import { Link, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddressForm from "./AddressForm";
import CreditCardForm from "./CreditCardForm";
import { updateDoc, doc, arrayUnion, addDoc, getDoc, setDoc ,collection  } from "firebase/firestore"; 
import { db } from "../firebase.config";

import axios from "../axios";

const stripePromise = loadStripe(
  "pk_test_51OQD4iFealxv0C5f8rVCTkLRE5NjC94Qh9RrAVXCcB6J0QSpJuGvNGQi2bmXdpue07zWJYtjDt6pJeYQZN5MC12800bhvvxXwO"
);

const Checkout = () => {
  const navigate = useNavigate();
  const amazon = useSelector((state) => state.amazon);
  const user = useSelector((state) => state.amazon.userInfo);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(undefined);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [orderDataReady, setOrderDataReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleAddressSave = (newAddress) => {
    setAddress(newAddress);
  };

  useEffect(() => {
    if (orderDataReady) {
      console.log("Payment successful. Navigating to the orderData page...");
      navigate("/orderData");
    }
  }, [orderDataReady, navigate]);

  const handleCreditCardFormCheckout = async (e) => {
    if (e) {
      e.preventDefault();
    }
  
    setProcessing(true);
  
    try {
      const clientSecretResponse = await axios.post("/order/create", {
        method: "post",
        total: calculateTotal(amazon.products) * 100,
      });
  
      if (clientSecretResponse.status === 201) {
        const newOrderData = {
          _id: "",
          total: calculateTotal(amazon.products) * 100,
          created: Date.now(),
          items: amazon.products.map((product) => ({ ...product })),
        };
  
        // Check if the user document exists
        const userDocRef = doc(db, 'users', user?.email);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (!userDocSnapshot.exists()) {
          // If user document does not exist, create it
          await setDoc(userDocRef, {});
          
          // Log that the user document was created (you may want to handle this differently)
          console.log("User document created for:", user?.email);
        }
  
        // Proceed with updating the user document and adding the order to the 'orders' subcollection
        const orderDocRef = await addDoc(collection(db, 'users', user?.email, 'orders'), newOrderData);
  
        // Include the logic to update savedOrders
        const orderID = doc(db, 'users', user?.email);
  
        if (newOrderData.items && newOrderData.items.length > 0) {
          // Ensure newOrderData.items is defined and not empty
          await updateDoc(orderID, {
            savedorders: arrayUnion({
              id: orderDocRef.id,
              title: newOrderData.items[0].title || "",
              img: newOrderData.items[0].img || "",
            }),
          });
        } else {
          console.error("Invalid order data items:", newOrderData.items);
        }
  
        setDisabled(false);
        setOrderData(newOrderData);
        setOrderDataReady(true);
      } else {
        console.error(
          "Unexpected server response:",
          clientSecretResponse.status,
          clientSecretResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error in handleCreditCardFormCheckout:", error);
    } finally {
      setProcessing(false);
    }
  };
  
  
  
  
  useEffect(() => {
    if (amazon) {
      const total = calculateTotal(amazon.products);
      setTotalPrice(total);
    }
  }, [amazon]);

  const calculateTotal = (products) => {
    return products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="container mx-auto h-auto grid grid-cols-5 gap-8">
        <div className="w-full bg-white px-4 col-span-5 xl:col-span-4">
          <img
            className="w-full mb-8 rounded"
            src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
            alt=""
          />
          <div className="font-titleFont xl:flex items-center justify-between border-b-[1px] border-b-gray-400 py-3">
            <h1 className="text-2xl font-semibold">Checkout</h1>
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <Link to="/">
              <p className="px-4 py-2 my-2 flex items-center justify-center bg-blue-400 hover:bg-blue-600 active:bg-red-500 text-white rounded-lg font-titleFont font-semibold text-lg tracking-wide">
                Home page
              </p>
            </Link>
          </div>

          {amazon && amazon.products.length > 0 ? (
            <div>
              {amazon.products.map((item) => (
                <div
                  key={item.id}
                  className="w-full border-b-[1px] border-b-gray-300 p-4 md:p-0 md:py-4 flex items-center gap-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="w-full flex flex-col gap-2 xl:gap-1">
                    <p className="text-lg font-semibold">{item.title}</p>
                    <p className="text-gray-600">${item.price}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your basket is empty.</p>
          )}

          <div className="w-full">
            <button
              onClick={() => dispatch(resetCart())}
              className="px-8 py-2 my-4 bg-red-500 hover:bg-red-600 active:bg-red-500 text-white rounded-lg font-titleFont font-semibold text-lg tracking-wide">
              Clear Cart
            </button>
          </div>
        </div>
        <div className="col-span-5 md:col-span-3 lg:col-span-2 xl:col-span-1 bg-white h-auto flex flex-col items-center p-4 space-y-4">
          <AddressForm onSave={handleAddressSave} />
          <div className="text-md bg-blue-100 font-medium py-4 px-2 mb-4 rounded w-full text-center">
            <p>
              Get in on the perks. We're giving you 30 days of Prime benefits
              for FREE.
            </p>
            <button className="w-full text-sm py-2 font-normal rounded-sm bg-gradient-to-t from-slate-200 to-slate-100 hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-amazonInput">
              Try Prime FREE
            </button>
          </div>
          {address && (
            <div className="text-sm bg-blue-100 font-medium p-4 rounded w-full">
              <h2 className="text-lg font-semibold mb-2">Saved Address</h2>
              <p>Street: {address.street}</p>
              <p>City: {address.city}</p>
              <p>State: {address.state}</p>
              <p>Postal Code: {address.postalCode}</p>
            </div>
          )}
          {totalPrice !== undefined && (
            <div className="text-base font-semibold p-4 rounded w-full">
              <p className="justify-between">
                Subtotal:{" "}
                <span className="text-sm font-bold">${totalPrice}</span>
              </p>
            </div>
          )}

          <div className="h-8 text-xs font-semibold bg-opacity-50 text-white rounded-lg cursor-not-allowed w-full">
            <Elements stripe={stripePromise}>
              <CreditCardForm
                onChange={handleChange}
                amazon={amazon}
                onCheckout={handleCreditCardFormCheckout}
                calculateTotal={calculateTotal}

              />
            </Elements>
          </div>

          {error && <div className="text-red-500">{error}</div>}
          <p className="flex items-center gap-2 text-sm">
            Your orderData qualifies for Free shipping. Choose this option at
            Checkout. See details...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;