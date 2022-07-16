import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
const abhaContoller = require('../controllers/abhaController')

const router = Router();

router.get('/', (req, res) => {
  return res.json("ABHA");
});

router.post('/address/generateOTP', abhaContoller.generateOTP)

router.post('/address/validateOTP', abhaContoller.validateAddressOtp)

router.post('/address/registrationDetails', abhaContoller.addressRegistrationDetails)

router.post('/address/createPhrAddress', abhaContoller.addressCreatePhr)



export default router;
