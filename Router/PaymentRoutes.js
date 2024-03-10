import express  from 'express'
const apiRoute = express.Router();

import bodyParser from 'body-parser'
apiRoute.use(bodyParser.json());
apiRoute.use(bodyParser.urlencoded({ extended:false }));




// import {payment,success,failure} from '../Controller/PaymentController.js';

import {payment,success,failure} from '../Controller/sellix_api.js';

apiRoute.post('/payment', payment);
apiRoute.get('/success', success);
apiRoute.get('/failure', failure);

export {apiRoute};