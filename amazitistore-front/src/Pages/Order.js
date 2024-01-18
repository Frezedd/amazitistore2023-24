import React, { useEffect, useState } from "react";

const Order = ({ order }) => {
  const [totalPrice, setTotalPrice] = useState(undefined);
  const { created, id, items } = order || {};

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  useEffect(() => {
    if (items) {
      const total = calculateTotal(items);
      setTotalPrice(total);
    }
  }, [items]);

  if (!order || !items || !created || !items) {
    return <p>No order data available</p>;
  }

  const orderTotal = totalPrice || calculateTotal(items);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
<div className="w-full bg-gray-100 p-4">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
    <div className="bg-white p-4 col-span-1 md:col-span-2 lg:col-span-6">
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className="mb-2 text-sm md:text-sm lg:text-base">
            <div className="border-b-2 p-4 flex items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <h2 className="text-xs md:text-sm lg:text-xl font-titleFont">{item.title}</h2>
            </div>
          </div>
        ))
      ) : (
        <p className="text-lg">No items in the order.</p>
      )}

      <div className="mt-4">
        <p className="text-xs md:text-sm lg:text-base pb-2">Ordered date: {formatDate(created)}</p>
        <p className="text-xs md:text-sm lg:text-base">Order ID: {id}</p>
        <h2 className="text-sm md:text-base lg:text-lg font-bold mt-4">Order Total: {`$${orderTotal.toFixed(2)}`}</h2>
      </div>
    </div>

    <div className="col-span-1 md:col-span-2 lg:col-span-1">
    </div>
  </div>
</div>



  );
};

export default Order;


