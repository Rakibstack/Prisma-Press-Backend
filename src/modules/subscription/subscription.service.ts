import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import console from "console";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_Url}/Premium?success=true`,
      cancel_url: `${config.app_Url}/payment?success=false`,
      metadata: { userId: user.id },
    });
    return session.url;
  });
  return {
    paymentUrl: transactionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret as string;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );
  switch (event.type) {
    case "checkout.session.completed":
      await completeCheckoutSession(event.data.object);

      break;
    case "customer.subscription.updated":
      handleChangeSubscription(event.data.object);
      break;

    case "customer.subscription.deleted":
      handleChangeSubscription(event.data.object);

      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
      break;
  }
};
const getCurrentPeriodEnd = (payload: Stripe.Subscription) => {
  const currentPeriodEndinMilliseconds =
    payload.items.data[0]?.current_period_end!;

  const currentPeriodEnd = new Date(currentPeriodEndinMilliseconds * 1000);
  return currentPeriodEnd;
};

const completeCheckoutSession = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId as string;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log("Webhook Failed");
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const currentPeriodEnd = getCurrentPeriodEnd(stripeSubscription);

  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};

const handleChangeSubscription = async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;
  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCELED
        : SubscriptionStatus.EXPIRED;

  const currentPeriodEnd = getCurrentPeriodEnd(payload);
  const isSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId,
    },
  });
  if (!isSubscriptionExist) {
    console.log(
      `webhook : no subscription found for subscription id :
       ${stripeSubscriptionId}`,
    );
    return;
  }

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      currentPeriodEnd,
      status,
    },
  });
};

export const subscriptionService = {
  createCheckoutSession,
  handleWebhook,
};
