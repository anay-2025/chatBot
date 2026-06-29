import React, { useEffect, useState, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import Message from './Message';
import toast from 'react-hot-toast';

const ChatBox = () => {
  const containerRef = useRef(null);

  const {selectedChat, theme, user, axios, token, setUser} = useAppContext();
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();  
      if(!user) return toast('Login to send message to AI')
      setLoading(true)
    const promptCopy = prompt
    setPrompt('');
    setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), 
      isImage: false }])
    const {data} = await axios.post(`/api/message/${mode}`, {chatId: selectedChat._id, 
      prompt, isPublished}, {headers: {Authorization: token}})

    if(data.success) {
      setMessages(prev => [...prev, data.reply])
      // decrese credits
      if(mode === 'image') {
        setUser(prev => ({...prev, credits: prev.credits - 2}))
      }
      else {
        setUser(prev => ({...prev, credits: prev.credits - 1}))
      }
    }
    else {
      toast.error(data.message)
      setPrompt(promptCopy)
    }
    } catch (error) {
      toast.error(error.message)
    }
    finally{
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(() => {
    if(selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  useEffect(() => {
    if(containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })   
    }
  }, [messages])

  return (
    <>
      <div className='flex-1 flex flex-col justify-between m-5 md:m-10 
      xl:mx-38 max-md:mt-14 2xl:pr-40'>

        {/* chat messages */}
        <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
          {messages.length === 0 && (
            <div className='h-full flex flex-col items-center justify-center gap-2
            text-primary'>
              <div className='flex items-center gap-3'>
                <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A456F7] to-[#3D81F6] 
                flex items-center justify-center text-white text-2xl'>
                  ✦
                </div>
                <div>
                  <p className='font-bold text-2xl leading-none bg-gradient-to-r from-[#8B35D6] to-[#2E6FD8] bg-clip-text text-transparent'>MernGPT</p>
                  <p className='text-purple-400 text-base'>Intelligent AI Assistant</p>
                </div>
              </div>
              <p className='text-3xl bg-gradient-to-r from-[#A456F7] via-[#7B5CF6] to-[#3D81F6] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(164,86,247,0.3)]'>Ask Me Anything.</p>
            </div>
          )}

          {messages.map((message, index) => <Message key={index} message={message}/>)}

          {/* loading animation */} 
          {
            loading && <div className='loader flex items-center gap-1.5'>
              <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
              <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
              <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            </div>
          }
        </div>

        {mode === 'image' && (
          <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
            <p className='text-xs'>Publish Generated Image To community</p>
            <input type="checkbox" className='cursor-pointer' checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}/>
          </label>
        )
        }


        {/* prompt input box */}
  <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary
    dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto
    flex gap-4 items-center'>
      <select 
        onChange={(e) => setMode(e.target.value)} 
        value={mode} 
        className='text-sm px-3 py-1 outline-none rounded-full cursor-pointer
        bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-white
        border-none font-medium'
      >
        <option className='bg-purple-900' value="text">Text</option>
        <option className='bg-purple-900' value="image">Image</option>
      </select>
      <input 
        onChange={(e) => setPrompt(e.target.value)} 
        value={prompt} 
        type="text" 
        placeholder='Type Your Prompt Here...' 
        className='flex-1 w-full text-sm outline-none bg-transparent'
      />
      <button>
        <img src={loading ? assets.stop_icon : assets.send_icon} alt="btn" className='w-8 cursor-pointer'/>
      </button>
  </form>
      </div>
    </>
  )
}

export default ChatBox