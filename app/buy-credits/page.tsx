"use client";
import { saveCreditToDb } from "@/actions/credit";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useImage } from "@/context/image";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import React from "react";
import toast from "react-hot-toast";

export default function BuyCredits() {
  const [{ isPending }] = usePayPalScriptReducer();
  const [selected, $selected] = React.useState({ credits: 10, price: 5 });

  const { credits, getUserCredits } = useImage();

  const creditOptions = [
    { credits: 10, price: 5 },
    { credits: 20, price: 10 },
    { credits: 50, price: 20 },
  ];

  const handleSuccess = async (details: any) => {
    const amount = parseFloat(details.purchase_units[0].amount.value);
    const credits = parseInt(details.purchase_units[0].custom_id, 10);
    try {
      await saveCreditToDb(amount, credits);
      getUserCredits();
      toast.success(`Successfully purchased ${credits} credits.`);
    } catch (err) {
      console.error("err => ", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleError = (err: any) => {
    console.error("err => ", err);
    toast.error("An error occurred. Please try again.");
  };

  if (isPending) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Buy Credits
          </CardTitle>
          <p className="text-center">
            You currently have{" "}
            <span className="font-bold text-primary">{credits}</span> credits
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 justify-between mb-6">
            {creditOptions.map((option) => (
              <Button
                key={option.credits}
                onClick={() => $selected(option)}
                variant={
                  selected.credits === option.credits ? "default" : "outline"
                }
                className="h-10"
              >
                {option.credits} Credits - ${option.price}
              </Button>
            ))}
          </div>

          <div className="relative z-0">
            <p className="text-sm mb-2">*Sandbox Mode</p>
            <PayPalButtons
              key={selected.credits}
              createOrder={(data, actions: any) => {
                const price = selected.price.toFixed(2);
                const credits = selected.credits.toString();

                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "AUD",
                        value: price,
                      },
                      custom_id: credits,
                    },
                  ],
                });
              }}
              onApprove={async (data, actions: any) => {
                const details = await actions.order.capture();
                handleSuccess(details);
              }}
              onError={handleError}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
