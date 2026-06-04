import axios from "axios"
import OpenAI from "openai"  // ✅ add this
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import imagekit from "../config/imageKit.js"

// ✅ initialize the client (Gemini via OpenAI-compatible SDK)
const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// text-based AI chat message controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
        if(req.user.credits < 1) {
            return res.json({success: false, message: "You don't have enough credits to use this feature!"})
        }
        const {chatId, prompt} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: 'user', content: prompt, timestamp: Date.now(), isImage: false})

        const {choices} = await openai.chat.completions.create({
            model: "gemini-2.5-flash",  // ✅ also corrected model name
            messages: [{ role: "user", content: prompt }],
        });

        const reply = {...choices[0].message, timestamp: Date.now(), isImage: false}  // ✅ .message not .messages
        res.json({success: true, reply})
        chat.messages.push(reply);
        await chat.save()

        await User.updateOne({_id: userId}, {$inc : {credits: -1}})
    } catch (error) {
        res.json({success: false, messages: error.message})
    }
}

// image based message controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if(req.user.credits < 2) {
            return res.json({success: false, message: "You don't have enough credits to use this feature!"})
        }
        const {prompt, chatId, isPublished} = req.body

        const chat = await Chat.findOne({userId, _id: chatId})
        chat.messages.push({role: 'user', content: prompt, timestamp: Date.now(), isImage: true})
        
        const encodedPrompt = encodeURIComponent(prompt);

        // ✅ no newline/spaces inside the template literal
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        const aiIMageResponse = await axios.get(generatedImageUrl, {responseType: "arraybuffer"})

        // ✅ added the missing comma after ;base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiIMageResponse.data, "binary").toString('base64')}`

        const uploadResponse = await imagekit.files.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: 'merngpt'
        })

        const reply = {role:'assistant', content: uploadResponse.url, timestamp: Date.now(), isImage: true, isPublished}
        res.json({success: true, reply})

        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc : {credits: -2}})

    } catch (error) {
        res.json({success: false, message: error.message})      
    }
}