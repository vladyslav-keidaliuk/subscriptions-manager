import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getSubscriptionListItems } from "~/models/subscription.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const subscriptionListItems = await getSubscriptionListItems({ userId });
  return json({ subscriptionListItems });
};

export default function SubscriptionsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
            <div className="space-x-2">
              <Link
                to="/subscriptions/new"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Subscription
              </Link>
              <Link
                to="/"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {data.subscriptionListItems.length === 0 ? (
                <li className="px-6 py-4">
                  <div className="text-center">
                    <p className="text-gray-500">No subscriptions found.</p>
                    <Link
                      to="/subscriptions/new"
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      Add your first subscription
                    </Link>
                  </div>
                </li>
              ) : (
                data.subscriptionListItems.map((subscription) => (
                  <li key={subscription.id}>
                    <Link
                      to={subscription.id}
                      className="block hover:bg-gray-50 px-6 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center">
                            <p className="text-lg font-medium text-gray-900 truncate">
                              {subscription.name}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                subscription.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : subscription.status === "PAUSED"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {subscription.status}
                            </span>
                          </div>
                          {subscription.description && (
                            <p className="text-sm text-gray-500 truncate">
                              {subscription.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            {subscription.currency} ${subscription.price} / {subscription.billingCycle.toLowerCase()}
                            {subscription.nextBillingDate && (
                              <span className="ml-2">
                                • Next payment: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">
                              ${subscription.price}
                            </p>
                            <p className="text-sm text-gray-500">
                              {subscription.billingCycle.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}