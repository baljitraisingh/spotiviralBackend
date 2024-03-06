const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51IpqnXEhDFzZqzWxhGO9vlehG0gUfdXnK188GsI9OlnI0ugDTo04yAqjOSayV69cEUpiYMNpIyFlL8QxXzJi6vZq00GGtlpWhJ";
const STRIPE_SECRET_KEY =
  "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";
  const { MONGO_URI } = process.env;
import stripePackage from "stripe";
const stripe = stripePackage(STRIPE_SECRET_KEY);
import { emailsender } from "../Utility/MailSend.js";
import { TeamMessage } from "../Utility/TeamMessage.js";
import { ClientMessage } from "../Utility/ClientMessage.js";
import { createUser } from "./User.js";
const payment = async (req, res) => {
  console.log(req.body);

  //  res.send(req.body)

  const lineItems = req.body.order_detail.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.order_name + " : " + item.order_package,
          // images:[item.imgdata],
          description:
            req.body.song_details
              .map((song, index) => " (" + (index + 1) + ") " + song.name + " ")
              .join(":") || "song url",
        },
        unit_amount: Math.max(item.price * 100, 50),
      },
      quantity:
        item.order_name == "spotify-plays" ? req.body.song_details.length : 1,
    };
  });
  try {
    //  console.log(STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/sucess",
      cancel_url: "http://localhost:3000/cancel",
    });
    req.body.strip_id = session.id;
    await createUser(req.body);
    //  let messge=ClientMessage(req.body.song_name,req.body.total_price,req.body.order_detail)
    //  emailsender(req.body.client_email,messge,"Order Confirmation: Spotify Promotion")
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
  }
};

const success = async (req, res) => {
  try {
    res.send("success");
  } catch (error) {
    console.log(error.message);
  }
};

const failure = async (req, res) => {
  try {
    res.send("failure");
  } catch (error) {
    console.log(error.message);
  }
};

const payment_old = async (req, res) => {
  console.log(req.body);

  //  res.send(req.body)

  const lineItems = req.body.order_detail.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name:
            req.body.song_name +
            "  --> " +
            item.order_name +
            " : " +
            item.order_package,
          // images:[item.imgdata],
          description: req.body.song_url || "song url",
        },
        unit_amount: Math.max(item.price * 100, 50),
      },
      quantity: 1,
    };
  });
  try {
    //  console.log(STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/sucess",
      cancel_url: "http://localhost:3000/cancel",
    });

    await createUser(req.body);
    //  let messge=ClientMessage(req.body.song_name,req.body.total_price,req.body.order_detail)
    //  emailsender(req.body.client_email,messge,"Order Confirmation: Spotify Promotion")

    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
  }
};
export { payment, success, failure };
