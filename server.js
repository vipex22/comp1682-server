const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const port = process.env.PORT;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send(`Hello this is Port ${port}`);
});

app.post("/paywithstripe", async (req, res) => {
  const { token, amount, userPhoneNumber, userAddress, products } =
    req.body;

  try {
    const charge = await Stripe.charges.create({
      source: token.id,
      amount: amount,
      currency: "usd",
      description: `${userAddress}, ${userPhoneNumber}, ${products}`,
    });
    res.status(200).send("Payment successful");
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Payment failed");
  }
});

app.listen(port, () => {
  console.log(`server is running on Port ${port}`);
});
