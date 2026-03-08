import type { Subscription, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Subscription } from "@prisma/client";

export type BillingCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";
export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";

export function getSubscription({
  id,
  userId,
}: Pick<Subscription, "id"> & {
  userId: User["id"];
}) {
  return prisma.subscription.findFirst({
    where: { id, userId },
  });
}

export function getSubscriptionListItems({ userId }: { userId: User["id"] }) {
  return prisma.subscription.findMany({
    where: { userId },
    select: { 
      id: true, 
      name: true, 
      price: true, 
      currency: true, 
      billingCycle: true, 
      status: true, 
      nextBillingDate: true,
      description: true 
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createSubscription({
  name,
  description,
  price,
  currency = "USD",
  billingCycle,
  status = "ACTIVE",
  userId,
  nextBillingDate,
}: Pick<Subscription, "name" | "description" | "price" | "currency" | "nextBillingDate"> & {
  billingCycle: BillingCycle;
  status?: SubscriptionStatus;
  userId: User["id"];
}) {
  return prisma.subscription.create({
    data: {
      name,
      description,
      price,
      currency,
      billingCycle,
      status,
      nextBillingDate,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteSubscription({
  id,
  userId,
}: Pick<Subscription, "id"> & { userId: User["id"] }) {
  return prisma.subscription.deleteMany({
    where: { id, userId },
  });
}

export function updateSubscription({
  id,
  userId,
  name,
  description,
  price,
  currency,
  billingCycle,
  status,
  nextBillingDate,
}: Pick<Subscription, "id" | "name" | "description" | "price" | "currency" | "nextBillingDate"> & {
  userId: User["id"];
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
}) {
  return prisma.subscription.updateMany({
    where: { id, userId },
    data: {
      name,
      description,
      price,
      currency,
      billingCycle,
      status,
      nextBillingDate,
    },
  });
}

export function getSubscriptionStats({ userId }: { userId: User["id"] }) {
  return Promise.all([
    prisma.subscription.count({
      where: { userId, status: "ACTIVE" },
    }),
    prisma.subscription.aggregate({
      where: { userId, status: "ACTIVE" },
      _sum: {
        price: true,
      },
    }),
    prisma.subscription.findMany({
      where: { 
        userId, 
        status: "ACTIVE",
        nextBillingDate: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
      select: { 
        id: true, 
        name: true, 
        price: true, 
        nextBillingDate: true 
      },
    }),
  ]).then(([count, total, upcoming]) => ({
    totalActive: count,
    totalCost: total._sum.price || 0,
    upcomingPayments: upcoming,
  }));
}