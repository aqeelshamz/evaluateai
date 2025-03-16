"use client";

import { appURL, primaryColor, serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCreditCard, FiShoppingBag } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { FiDollarSign, FiFileText, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

export default function Page() {
  const [shopItems, setShopItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const getShopItems = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/shop`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setShopItems(response.data.shopItems);
        setPaymentMethod(response.data.paymentMethod);
      })
      .catch((error) => {
        toast.error("Failed to get shop items");
      });
  }

  useEffect(() => {
    getShopItems();
  }, [])

  const [stripeClientSecret, setStripeClientSecret] = useState("");
  const buyShopItem = async (shopItemId: string) => {
    const config = {
      method: "POST",
      url: `${serverURL}/shop/create-order`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        itemId: shopItemId
      },
    };

    axios(config)
      .then((response) => {
        console.log(response.data);
        if (paymentMethod === "stripe") {
          setStripeClientSecret(response.data.clientSecret);
          (document.getElementById('stripe_payment_modal') as any).showModal()
        }
        else if (paymentMethod === "razorpay") {
          handlePayment({ ...response.data, theme: { color: primaryColor } });
        }
      })
      .catch((err) => {
        toast.error("Failed to purchase shop item");
        console.log(err);
      });
  };

  const { error, isLoading, Razorpay } = useRazorpay();
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();


    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
      e.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      setIsLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${appURL}/shop/success`,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message as any);
      } else {
        setMessage("An unexpected error occurred." as any);
      }

      setIsLoading(false);
    };

    const paymentElementOptions: any = {
      layout: "accordion",
    };

    return (
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button className="btn btn-primary mt-4" disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    );
  }

  const handlePayment = (data: any) => {
    const options: RazorpayOrderOptions = {
      key: "rzp_test_lFtAUAI3UzLg4f",
      amount: data.amount * 100,
      currency: "INR",
      name: data.name,
      description: data.description,
      order_id: data.order_id,
      handler: (response: any) => {
        console.log(response);

        const config = {
          method: "POST",
          url: `${serverURL}/shop/razorpay/verify-order`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          data: {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
        };

        axios(config).then((response) => {
          toast.success("Payment successfull!");
          window.location.href = "/shop/purchases";
        }).catch((err) => {
          toast.error("Something went wrong!");
        })
      },
      theme: {
        color: data.theme.color,
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div className="flex flex-col h-full">
      <p className="flex items-center text-2xl font-semibold"><FiShoppingBag className="mr-2" /> Shop Items</p>
      <div className="flex pb-5 w-[80vw] h-full flex-wrap gap-4 mt-4">
        {
          shopItems?.map((shopItem: any, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index / 10, duration: 0.4 }}
              key={index}
              className="cursor-pointer max-h-100 min-w-64 p-5 flex flex-col justify-between rounded-lg border-2 border-gray-300 font-semibold hover:border-gray-400 duration-100"
              onClick={() => buyShopItem(shopItem?._id)}
            >
              <div className="flex flex-col space-y-2">
                <h2 className="font-bold">{shopItem?.title}</h2>
                <p className="font-normal">{shopItem?.description}</p>
                <div className="badge badge-outline badge-primary badge-lg"><FiDollarSign /> {shopItem?.price}</div>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <div className="tooltip tooltip-bottom" data-tip="Evaluator Limit">
                  <div className="badge badge-soft badge-primary"><RiRobot2Line /> {shopItem?.evaluatorLimit}</div>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Evaluation Limit">
                  <div className="badge badge-soft badge-primary"><FiFileText /> {shopItem?.evaluationLimit}</div>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Classes Limit">
                  <div className="badge badge-soft badge-primary"><FiUsers /> {shopItem?.classesLimit}</div>
                </div>
              </div>
            </motion.div>
          ))
        }
      </div>
      {/* Stripe Payment Modal */}
      <dialog id="stripe_payment_modal" className="modal">
        <div className="modal-box">
          {stripeClientSecret && <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance: { theme: 'flat' } }}>
            <PaymentForm />
          </Elements>}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div >
  );
}
