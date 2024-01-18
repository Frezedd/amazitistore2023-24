import React, { useState }  from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import { ProductsData } from "./api/api";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Registration from "./Pages/Resgistration";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import AuthLayout from "./AuthLayout";
import { loadStripe } from "@stripe/stripe-js";
import Orders from "./Pages/Orders";





const stripePromise = loadStripe('pk_test_51OQD4iFealxv0C5f8rVCTkLRE5NjC94Qh9RrAVXCcB6J0QSpJuGvNGQi2bmXdpue07zWJYtjDt6pJeYQZN5MC12800bhvvxXwO');



const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <ScrollRestoration />
      <Outlet /> 
      {children}
      <Footer />
    </div>
  );
};

function App() {

  const [stripe, setStripe] = useState(null);

  const initializeStripe = async () => {
    try {
      console.log("About to initialize Stripe");
      const stripeInstance = await loadStripe(stripePromise); 
      setStripe(stripeInstance);
      console.log("Stripe initialized successfully:", stripeInstance);
    } catch (error) {
      console.error("Error initializing Stripe:", error);
    }
  };
  

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} loader={ProductsData} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Orders />} />
          <Route
            path="/checkout"
            element={<Checkout stripePromise={stripePromise} />}
          />
        </Route>
        <Route
          path="/signin"
          element={<AuthLayout><Signin /></AuthLayout>}
        />
        <Route
          path="/registration"
          element={<AuthLayout><Registration /></AuthLayout>}
        />
      </>
    )
  );

  return (
    <div className="font-bodyFont bg-gray-100">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;

