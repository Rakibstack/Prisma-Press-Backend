import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import console from "console";

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
  console.log("webhook Called");
  
  const endpointSecret = config.stripe_webhook_secret as string;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );
  switch (event.type) {
    case "checkout.session.completed":
      console.log("checkout.session.completed event received");
      const session: Stripe.Checkout.Session = event.data.object;
      console.log(session);
      
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
        throw new Error("Webhook Failed");
      }

      const stripeSubscription =
        await stripe.subscriptions.retrieve(stripeSubscriptionId);

      const currentPeriodEnd =
        stripeSubscription.items.data[0]?.current_period_end;

      break;
    case "customer.subscription.updated":
      break;
    case "customer.subscription.deleted":
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
      break;
  }
};

export const subscriptionService = {
  createCheckoutSession,
  handleWebhook,
};
