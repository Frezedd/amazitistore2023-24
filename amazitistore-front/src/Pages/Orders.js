import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Order from "./Order";
import { allItems } from '../Constants/Items';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.config";

const Orders = () => {
  const user = useSelector((state) => state.amazon.userInfo);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.email) {
        try {
          // Fetch orders from Firestore
          const userDocRef = doc(db, "users", user.email);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const ordersCollectionRef = collection(
              db,
              "users",
              user.email,
              "orders"
            );
            const ordersSnapshot = await getDocs(ordersCollectionRef);

            const fetchedOrders = [];
            ordersSnapshot.forEach((orderDoc) => {
              fetchedOrders.push({ id: orderDoc.id, ...orderDoc.data() });
            });

            setOrders(fetchedOrders);
          } else {
            console.log("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    };

    fetchOrders();
  }, [user?.email]);

  const handlePlaceOrder = async () => {
    try {
      // Save the order data to Firestore
      const orderDocRef = await db
        .collection("users")
        .doc(user?.email)
        .collection("orders")
        .add({
          items: allItems,
        });

      // Include the logic to update savedOrders
      const orderID = doc(db, "users", user?.email);

      await updateDoc(orderID, {
        orders: arrayUnion({
          id: orderDocRef.id,
          title: allItems.title,
          img: allItems.image,
        }),
      });

      console.log("Order saved to Firestore");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
<div className="container mx-auto my-3 p-8 bg-white rounded shadow-xl">
  <h1 className="text-4xl text-blue-900 font-semibold mb-8">Your Orders</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
    {orders.map((order) => (
      <div key={order.id} className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
        <Order order={order} />
      </div>
    ))}
  </div>
</div>
  );
};

export default Orders;

