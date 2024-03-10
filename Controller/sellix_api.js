const { MONGO_URI } = process.env;
import axios from 'axios'; 
import { emailsender } from "../Utility/MailSend.js";
import { TeamMessage } from "../Utility/TeamMessage.js";
import { ClientMessage } from "../Utility/ClientMessage.js";
import { createUser } from "./User.js";

const SELLIX_API_KEY = '9vMcsqJ3OphwZsWD4QIJHsNnIeFolyMO5v6TkAHwP9ytADiRS3BM3EjnCToAu8nf'; 

const payment = async (req, res) => {
  console.log(req.body);

  const orderData = {
    email: req.body.client_email, 
    gateway: "sellix", 
    return_url: "http://localhost:3000/success", 
    webhook_url: "http://yourdomain.com/webhook", 
    currency: "USD", 
    discount_codes: [], 
    notes: "Order details", 
    items: req.body.order_detail.map((item) => {
      return {
        id: item.id, 
        quantity: item.order_name === "spotify-plays" ? req.body.song_details.length : 1, 
      };
    }),
  };

  try {
    // Create order using Sellix API
    const response = await axios.post('https://dev.sellix.io/v1/orders', orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SELLIX_API_KEY}`
      }
    });

    await createUser(req.body);
    res.json({ id: response.data.data.order_id }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const success = async (req, res) => {
  try {
    res.send("success");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const failure = async (req, res) => {
  try {
    res.send("failure");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { payment, success, failure };