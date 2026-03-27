import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  essential: {
    name: 'BioVoice Essential',
    amount: 65000, // €650.00 in cents
    description: '3 LinkedIn posts/week, monthly strategy call',
  },
  professional: {
    name: 'BioVoice Professional',
    amount: 110000, // €1,100.00 in cents
    description: '5 LinkedIn posts/week, bi-weekly calls, analytics',
  },
  executive: {
    name: 'BioVoice Executive',
    amount: 165000, // €1,650.00 in cents
    description: '5 posts/week + articles, weekly calls, full strategy',
  },
};

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { tier } = await req.json();
    const plan = PRICE_MAP[tier];

    if (!plan) {
      return new Response(JSON.stringify({ error: 'Invalid tier' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/post-generator?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${origin}/#packages`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
