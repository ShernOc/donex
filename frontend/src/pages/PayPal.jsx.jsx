import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useContext } from "react";
import { DonationContext } from "../context/DonationContext";
import { CharityContext } from "../context/CharityContext";

const PayPal = () => {
  const { createDonation } = useContext(DonationContext);
  const { charityId, amount } = useContext(CharityContext)

  // When the amount is zero nothing happens
  if (!amount || amount <= 0) {
    return <p className="text-red-500">Invalid donation amount</p>;
  }

  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount.toString() }, },],
          },);
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log("Payment successful:", details);

            // Send donation details to backend
            await createDonation(charityId, amount, false);
            alert("Donation successful!");
          }
          catch (error) {
            console.error("Error processing donation:", error);
          }
        }}
        onError={(err) => {
          console.error("PayPal payment error:", err);
          alert("Payment failed. Please try again.");
        }}
        onCancel={() => {
          console.log("User canceled the PayPal transaction.");
          alert("Donation canceled.");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPal;
