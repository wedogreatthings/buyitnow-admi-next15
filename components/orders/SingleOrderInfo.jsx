import React from "react";

const SingleOrderInfo = ({ order, deliveryPrice }) => {
    return (
      <>
        <header className="lg:flex justify-between mb-4">
          <div className="mb-4 lg:mb-0">
            <p className="font-semibold">
              <span>Order ID: {order?._id} </span>
              {order?.paymentStatus === 'paid' ? (
                <span className="text-green-500">
                  • {order?.paymentStatus?.toUpperCase()}
                </span>
              ) : (
                <span className="text-red-500">
                  • {order?.paymentStatus?.toUpperCase()}
                </span>
              )}{' '}
              {order?.shippingInfo !== undefined &&
                (order?.orderStatus == 'Processing' ? (
                  <span className="text-red-500">
                    • {order?.orderStatus.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-green-500">
                    • {order?.orderStatus.toUpperCase()}
                  </span>
                ))}
            </p>
            <p className="text-gray-500">{order?.createAt?.substring(0, 10)} </p>
          </div>
        </header>
        <div className="grid md:grid-cols-4 gap-1">
          <div>
            <p className="text-gray-400 mb-1">Person</p>
            <ul className="text-gray-600">
              <li>{order?.user?.name}</li>
              <li>Phone: {order?.shippingInfo?.phoneNo}</li>
              <li>Email: {order?.user?.email}</li>
            </ul>
          </div>
          {order?.shippingInfo !== undefined && (
            <div>
              <p className="text-gray-400 mb-1">Delivery address</p>
              <ul className="text-gray-600">
                <li>{order?.shippingInfo?.street}</li>
                <li>
                  {order?.shippingInfo?.city}, {order?.shippingInfo?.state},{' '}
                  {order?.shippingInfo?.zipCode}
                </li>
                <li>{order?.shippingInfo?.country}</li>
              </ul>
            </div>
          )}
          <div>
            <p className="text-gray-400 mb-1">Amount Paid</p>
            <ul className="text-gray-600">
              <li>
                <span className="font-bold">Total Price:</span> $
                {order?.shippingInfo === undefined
                  ? order?.paymentInfo?.amountPaid.toFixed(2)
                  : (order?.paymentInfo?.amountPaid - deliveryPrice).toFixed(2)}
              </li>
              <li>
                <span className="font-bold">Delivery Price:</span> $
                {order?.shippingInfo === undefined ? 0 : deliveryPrice}
              </li>
              <li>
                <span className="font-bold">Total paid:</span> $
                {order?.paymentInfo?.amountPaid.toFixed(2)}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Payment</p>
            <ul className="text-gray-600">
              <li>
                <span className="font-bold">Mode:</span>{' '}
                {order?.paymentInfo?.typePayment}
              </li>
              <li>
                <span className="font-bold">Sender:</span>{' '}
                {order?.paymentInfo?.paymentAccountName}
              </li>
              <li>
                <span className="font-bold">Number:</span>{' '}
                {order?.paymentInfo?.paymentAccountNumber}
              </li>
            </ul>
          </div>
        </div>
  
        <hr className="my-4" />
  
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {order?.orderItems?.map((item) => (
            <figure className="flex flex-row mb-4" key={item?._id}>
              <div>
                <div className="block w-20 h-20 rounded-sm border border-gray-200 overflow-hidden p-3">
                  <img
                    src={item?.image}
                    height="60"
                    width="60"
                    alt={item?.name}
                  />
                </div>
              </div>
              <figcaption className="ml-3">
                <p>{item?.name.substring(0, 35)}</p>
                <p className="text-sm italic">Single: ${item?.price}</p>
                <p className="mt-1 font-semibold">
                  {item?.quantity}x = ${item?.price * item?.quantity}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </>
    );
  };
  
  export default SingleOrderInfo;