import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import  {emailsender} from './Utility/MailSend.js'
import {apiRoute} from './Router/PaymentRoutes.js'
import {TeamMessage} from './Utility/TeamMessage.js'
import {ClientMessage} from './Utility/ClientMessage.js'
import { FreePromoMessage } from './Utility/FreePromoMessage.js'
import {connectToMongoDB} from "./Models/db.js"
import { getUser,deleteUser } from './Controller/User.js'
// import { connection } from "./Models/db.js"
const app = express();
app.use(express.json());
// Enable CORS for all routes
app.use(cors());
app.use('/api',apiRoute)
// Define your routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/sendmail', async (req, res) => {
 try {
  //console.log(req.body)
  const {strip_id,email } = req.body;
 let userData=await getUser(strip_id)
 //console.log("userData ",userData)
 if(userData)
 {

   const message1=ClientMessage(userData.email,userData.UserData.song_details,userData.UserData.order_detail)
   await emailsender(userData.email,message1)
    const message2=TeamMessage(userData.email,userData.UserData.song_details,userData.UserData.order_detail)
    await emailsender("spotiviral@gmail.com",message2,"Customer Order Details - Spotify Promotion")
   deleteUser(strip_id)

 }

  res.send(req.body)
  //const result = await emailsender(email, msg);
  // if (result) {
  //   res.json({ message: 'Email sent successfully!' });
  // } else {
  //   res.status(500).json({ message: 'Failed to send email.' });
  // }
 } catch (error) {
  console.log(error)
  res.status(500).json({ message: 'Failed to send email.' });

 }
});

app.post('/contact', async (req, res) => {
  try {
   //console.log(req.body)
   const { email, msg } = req.body;
   const result = await emailsender("spotiviral@gmail.com", msg, "Contact Form Submission");
   if (result) {
     res.json({ message: 'Email sent successfully!' ,success:true});
   } else {
     res.status(500).json({ message: 'Failed to send email.' ,success:false});
   }
  } catch (error) {
   console.log(error)
   res.status(500).json({ message: 'Failed to send email.' });
 
  }
 })


app.post('/freepromotion', async (req, res) => {
  try {
   console.log(req.body)
   const { email, name, howDidYouFindUs,spotifyTrackLink,amountOfPlays} = req.body;
   const message=FreePromoMessage(email, name, howDidYouFindUs,spotifyTrackLink,amountOfPlays)
   const result = await emailsender("spotiviral@gmail.com", message, "Free Promotion");
   if (result) {
     res.json({ message: 'Email sent successfully!' });
   } else {
     res.status(500).json({ message: 'Failed to send email.' });
   }
  } catch (error) {
   console.log(error)
   res.status(500).json({ message: 'Failed to send email.' });
 
  }
 })
// Start the server
const PORT = process.env.PORT || 4000;
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});