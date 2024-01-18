import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetCart , addOrder } from "../redux/amazonSlice";

const CreditCardForm = ({ onChange, onCheckout, calculateTotal }) => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(undefined);
  const amazon = useSelector((state) => state.amazon);

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
    onChange(event);
  };

  const initializeStripeElements = () => {
    if (elements) {
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        cardElement.on("change", handleChange);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (processing || !stripe || !elements) {
        // console.error("Invalid submission.");
        return;
      }

      setProcessing(true);

      const cardElement = elements.getElement(CardElement);

      if (!clientSecret || !stripe || !elements || !cardElement) {
        // console.error("Invalid setup for payment.");
        return;
      }

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      // console.log("Payment Payload:", payload);

      if (payload.error) {
        throw new Error(`Payment failed: ${payload.error.message}`);
      }

      // console.log("Payment succeeded! Navigating to the order page...");

      setTimeout(() => {
        setSucceeded(true);
        setProcessing(false);
        dispatch(resetCart());
        dispatch(addOrder());

        if (totalPrice !== undefined) {
          const orderData = {
            id: "",
            total: totalPrice,
            created: Date.now(),
            items: amazon.products,
          };


          if (!isNaN(totalPrice)) {
            navigate("/order", { state: { order: orderData } });

            if (onCheckout && typeof onCheckout === "function") {
              onCheckout(); // Call the callback function provided by onCheckout
            }
          } else {
            console.error("Invalid totalPrice:", totalPrice);
          }
          // console.log("Navigating to the order page or triggering checkout...");
        }
      }, 1000);
    } catch (error) {
      // console.error("Error confirming card payment:", error);
      setError(`Payment failed: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };


  useEffect(() => {
    const getClientSecret = async () => {
      try {
        if (amazon && amazon.products && amazon.products.length > 0) {
          const total = calculateTotal(amazon.products) * 100;
          // console.log("Calculated Total:", total);

          const response = await axios.post("/order/create", {
            method: "post",
            total: calculateTotal(amazon.products) * 100,
          });

          // console.log("Server Response:", response);

          if (response.status === 201) {
            setClientSecret(response.data.clientSecret);
            setDisabled(false);

            console.log("The Secret is >>>", response.data.clientSecret);
          } else {
            setClientSecret(null);
          }
        }
      } catch (error) {
        setClientSecret(null);
      }
    };

    getClientSecret();
    initializeStripeElements();
  }, [amazon, elements]);

  const calculateTotalPrice = (products) => {
    return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  useEffect(() => {
    if (amazon) {
      const total = calculateTotalPrice(amazon.products);
      setTotalPrice(total);
    }
  }, [amazon]);

  return (
    <div>
      <CardElement onChange={handleChange} />
      <button
        disabled={processing || disabled || succeeded}
        onClick={handleSubmit}
        className="w-full text-sm py-1 font-medium rounded-md bg-gradient-to-tr from-yellow-400 to-yellow-200 hover:from-yellow-300 hover:to-yellow-400 border border-yellow-500 hover:border-yellow-700 active:bg-gradient-to-bl active:from-yellow-400 active:to-yellow-500 duration-200"
      >
        {processing ? "Processing" : "Place Order"}
      </button>
      {error && <div>{error}</div>}
    </div>
  );
};

export default CreditCardForm;








