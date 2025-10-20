import express from 'express';
import { messageController } from '../controllers/Message.js';

const router = express.Router();

router.post('/send-message', messageController.sendMessage);

export default router;
