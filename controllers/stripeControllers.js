const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeController = async (req, res) => {
  console.log(req.body);
  const { shipping_fee, totalAmount, purchase } = req.body;

  const calculateOrderAmount = () => {
    return totalAmount + shipping_fee
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: 'zar'
  });

  res.json({
    clientSecret: paymentIntent.client_secret
  });
};

module.exports = stripeController;