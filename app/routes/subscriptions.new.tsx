import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createSubscription } from "~/models/subscription.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const currency = formData.get("currency") || "USD";
  const billingCycle = formData.get("billingCycle");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "Name is required", price: null, billingCycle: null } },
      { status: 400 }
    );
  }

  if (typeof price !== "string" || isNaN(Number(price)) || Number(price) <= 0) {
    return json(
      { errors: { name: null, price: "Price must be a positive number", billingCycle: null } },
      { status: 400 }
    );
  }

  if (typeof billingCycle !== "string" || !["MONTHLY", "QUARTERLY", "YEARLY"].includes(billingCycle)) {
    return json(
      { errors: { name: null, price: null, billingCycle: "Billing cycle is required" } },
      { status: 400 }
    );
  }

  // Calculate next billing date based on billing cycle
  const now = new Date();
  let nextBillingDate: Date;
  
  switch (billingCycle) {
    case "MONTHLY":
      nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      break;
    case "QUARTERLY":
      nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
      break;
    case "YEARLY":
      nextBillingDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      break;
    default:
      nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  const subscription = await createSubscription({
    name,
    description: typeof description === "string" ? description : undefined,
    price: Number(price),
    currency: typeof currency === "string" ? currency : "USD",
    billingCycle: billingCycle as "MONTHLY" | "QUARTERLY" | "YEARLY",
    userId,
    nextBillingDate,
  });

  return redirect(`/subscriptions/${subscription.id}`);
};

export default function NewSubscriptionPage() {
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const billingCycleRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.price) {
      priceRef.current?.focus();
    } else if (actionData?.errors?.billingCycle) {
      billingCycleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Add New Subscription</h1>
            </div>

            <Form method="post" className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Name
                </label>
                <div className="mt-1">
                  <input
                    ref={nameRef}
                    id="name"
                    name="name"
                    type="text"
                    autoFocus={true}
                    required
                    placeholder="e.g., Netflix, Spotify, GitHub"
                    aria-invalid={actionData?.errors?.name ? true : undefined}
                    aria-describedby="name-error"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {actionData?.errors?.name ? (
                    <div className="pt-1 text-red-700" id="name-error">
                      {actionData.errors.name}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description (optional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Brief description of the service..."
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <div className="mt-1">
                    <input
                      ref={priceRef}
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="9.99"
                      aria-invalid={actionData?.errors?.price ? true : undefined}
                      aria-describedby="price-error"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {actionData?.errors?.price ? (
                      <div className="pt-1 text-red-700" id="price-error">
                        {actionData.errors.price}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Currency
                  </label>
                  <div className="mt-1">
                    <select
                      id="currency"
                      name="currency"
                      defaultValue="USD"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="billingCycle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Billing Cycle
                </label>
                <div className="mt-1">
                  <select
                    ref={billingCycleRef}
                    id="billingCycle"
                    name="billingCycle"
                    required
                    aria-invalid={actionData?.errors?.billingCycle ? true : undefined}
                    aria-describedby="billingCycle-error"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select billing cycle...</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly (3 months)</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                  {actionData?.errors?.billingCycle ? (
                    <div className="pt-1 text-red-700" id="billingCycle-error">
                      {actionData.errors.billingCycle}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <a
                  href="/subscriptions"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Subscription
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}