const PRICE_MAP = {
  essential: {
    amount: '350.00',
    description: 'BioVoice Essential - 3 LinkedIn posts/week, monthly strategy call',
  },
  professional: {
    amount: '600.00',
    description: 'BioVoice Professional - 5 LinkedIn posts/week, bi-weekly calls, analytics',
  },
  executive: {
    amount: '900.00',
    description: 'BioVoice Executive - 5 posts/week + articles, weekly calls, full strategy',
  },
};

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const base = process.env.PAYPAL_BASE_URL || 'https://api-m.paypal.com';

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

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

    const accessToken = await getPayPalAccessToken();
    const base = process.env.PAYPAL_BASE_URL || 'https://api-m.paypal.com';

    const response = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: plan.amount,
            },
            description: plan.description,
          },
        ],
      }),
    });

    const order = await response.json();

    return new Response(JSON.stringify({ orderId: order.id }), {
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
