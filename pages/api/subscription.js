import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, paymentMethod } = req.body;

      let customer;
      const searchCustomerByEamil = await stripe.customers.list({
        email,
      });

      if (searchCustomerByEamil.data.length > 0) {
        customer = searchCustomerByEamil.data[0];
      } else {
        customer = await stripe.customers.create({
          email,
          name,
          payment_method: paymentMethod,
          invoice_settings: { default_payment_method: paymentMethod },
        });
      }

      const product = await stripe.products.create({
        name: '月額商品',
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              unit_amount: 1000,
              currency: 'jpy',
              product: product.id,
              recurring: {
                interval: 'month',
              },
            },
          },
        ],
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });
      console.log(subscription);
      res.status(200).json({
        subscriptionId: subscription.id,
        clientSecret:
          subscription.latest_invoice.payment_intent.client_secret,
        subscription,
        message: 'Subscription Successful!',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    }
    // const subscription = await stripe.subscriptions.create({
    //   items: [
    //     {
    //       price: 'price_1Mh6mgK4Uglogcq550qJn8Yv',
    //       quantity: 1,
    //     },
    //   ],
    //   payment_settings: {
    //     save_default_payment_method: 'on_subscription',
    //   },
    //   payment_behavior: 'default_incomplete',
    //   expand: ['latest_invoice.payment_intent'],
    // });
  }
}
