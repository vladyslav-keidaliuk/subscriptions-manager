import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  deleteSubscription,
  getSubscription,
  updateSubscription,
} from "~/models/subscription.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.subscriptionId, "subscriptionId not found");

  const subscription = await getSubscription({ userId, id: params.subscriptionId });
  if (!subscription) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ subscription });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.subscriptionId, "subscriptionId not found");

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deleteSubscription({ userId, id: params.subscriptionId });
    return redirect("/subscriptions");
  }

  if (intent === "update") {
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const currency = formData.get("currency");
    const billingCycle = formData.get("billingCycle");
    const status = formData.get("status");

    if (typeof name !== "string" || name.length === 0) {
      return json(
        { errors: { name: "Name is required" } },
        { status: 400 }
      );
    }

    if (typeof price !== "string" || isNaN(Number(price)) || Number(price) <= 0) {
      return json(
        { errors: { price: "Price must be a positive number" } },
        { status: 400 }
      );
    }

    // Calculate new next billing date if billing cycle changed
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

    await updateSubscription({
      id: params.subscriptionId,
      userId,
      name,
      description: typeof description === "string" ? description : null,
      price: Number(price),
      currency: typeof currency === "string" ? currency : "USD",
      billingCycle: billingCycle as "MONTHLY" | "QUARTERLY" | "YEARLY",
      status: status as "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED",
      nextBillingDate: status === "ACTIVE" ? nextBillingDate : null,
    });

    return json({ success: true });
  }

  return json({ error: "Invalid intent" }, { status: 400 });
};

export default function SubscriptionDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {data.subscription.name}
              </h1>
            </div>

            <Form method="post" className="space-y-6">
              <input type="hidden" name="intent" value="update" />

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={data.subscription.name}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={data.subscription.description || ""}
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
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={data.subscription.price}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
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
                      defaultValue={data.subscription.currency}
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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="billingCycle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Billing Cycle
                  </label>
                  <div className="mt-1">
                    <select
                      id="billingCycle"
                      name="billingCycle"
                      defaultValue={data.subscription.billingCycle}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly (3 months)</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="status"
                      name="status"
                      defaultValue={data.subscription.status}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="EXPIRED">Expired</option>
                    </select>
                  </div>
                </div>
              </div>

              {data.subscription.nextBillingDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Next Billing Date
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(data.subscription.nextBillingDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Form method="post" onSubmit={(e) => {
                  if (!confirm("Are you sure you want to delete this subscription?")) {
                    e.preventDefault();
                  }
                }}>
                  <input type="hidden" name="intent" value="delete" />
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete Subscription
                  </button>
                </Form>

                <div className="space-x-3">
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
                    Update Subscription
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Subscription not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}