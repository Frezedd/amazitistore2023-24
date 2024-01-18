import React from "react";
import ReactDOM from "react-dom/client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={"loading"} persistor={persistor}>
        <App />
    </PersistGate>
  </Provider>
);



// index.js
// import React from "react";
// import ReactDOM from "react-dom/client";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import firebaseConfig from "./firebase.config";
// import { store, persistor } from "./redux/store";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import "./index.css";
// import App from "./App";



// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <Provider store={store}>
//     <PersistGate loading={"loading"} persistor={persistor}>
//         <App />
//     </PersistGate>
//   </Provider>
// );

