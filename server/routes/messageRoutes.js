import express from 'express'
import {protect} from '../middlewares/auth.js'
import { textMessageController, imageMessageController, deleteImage } from '../controllers/messageController.js';


console.log("Message router loaded");

const messageRouter = express.Router();

messageRouter.post('/text', protect, textMessageController)
messageRouter.post('/image', protect, imageMessageController)
messageRouter.post('/delete-image', protect, deleteImage)

export default messageRouter;