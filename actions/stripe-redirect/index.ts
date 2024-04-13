'use server';

import { auth, currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { StripeRedirect } from '@/actions/stripe-redirect/schema';
import { ReturnType } from '@/actions/stripe-redirect/types';

import { createSafeAction, ReturnTypeEnum } from '@/lib/create-safe-action';
import db from '@/lib/db';
import { route } from '@/lib/route';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

const handler = async (): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();
  if (!userId || !orgId || !user) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Unauthorized',
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url = '';

  try {
    const orgSubscription = await db.orgSubscription.findUnique({
      where: { orgId },
    });
    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: 'EUR',
              product_data: {
                name: 'Taskify Pro',
                description: 'Unlimited boards for your organization',
              },
              unit_amount: 2000,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });
      url = stripeSession.url || '';
    }
  } catch (err) {
    return {
      type: ReturnTypeEnum.GENERALE_ERROR,
      error: 'Something went wrong',
    };
  }

  revalidatePath(
    route('/organization/[organizationId]', {
      params: { organizationId: orgId },
    })
  );
  return {
    type: ReturnTypeEnum.RESULT,
    data: url,
  };
};

const stripeRedirect = createSafeAction(StripeRedirect, handler);

export default stripeRedirect;
