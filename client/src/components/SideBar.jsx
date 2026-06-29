import React from 'react'
import {useAppContext} from '../context/AppContext'
import { assets } from '../assets/assets';
import { useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

const SideBar = (params) => {

  const {chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, setChats, fetchUsersChats, setToken, token} = useAppContext()
  const [search, setSearch] = useState('');

  const logout = () => {
    localStorage.removeItem('token') 
    setToken(null)
    toast.success('Logged out successfully')
  }

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation()
      const confirm = window.confirm('Are you sure you want to delete this chat ?')
      if(!confirm) return ;
      const {data} = await axios.post('/api/chat/delete', {chatId}, {
        headers: {Authorization: token}
      })
      if(data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUsersChats()
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b
      from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl
      transition-all duration-500 max-md:absolute left-0 z-10 ${!params.menu && `max-md:-translate-x-full`}`}>
        {/* logo */}
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A456F7] to-[#3D81F6] 
          flex items-center justify-center text-white text-xl'>
            ✦
          </div>
          <div>
            <p className='font-bold text-2xl leading-none bg-gradient-to-r from-[#8B35D6] to-[#2E6FD8] bg-clip-text text-transparent'>MernGPT</p>
            <p className='text-purple-400 text-xs'>Intelligent AI Assistant</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button onClick={createNewChat} className='flex justify-center items-center w-full py-2 mt-10 text-white
        bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'>
          <span className='mr-2 text-2xl'>+</span>New Chat
        </button>

        {/* search conversations */}
        <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20
        rounded-md'>
          <img src={assets.search_icon} alt="search" className='w-4 not-dark:invert'/>
          <input type="text" placeholder='Search Conversations' className='text-xs placeholder:text-gray-400 outline-none'
          onChange={(e) => setSearch(e.target.value)} value={search}/>
        </div>

        {/* recent chats */}
        {chats.length > 0 && <p className='mt-4 text-sm'>Recent Chats</p>}
        <div className='flex-1 overflow-y-scroll mt-3 text-xs space-y-3'>
        {
          chats.filter((chat) => {
            const firstMessage = chat.messages[0];

            const text = firstMessage
              ? firstMessage.content
              : chat.name;

            return text
              .toLowerCase()
              .includes(search.toLowerCase());
          }).map((chat) => {
              const firstMessage = chat.messages[0];

              return (
                <div onClick={() => {navigate('/'); setSelectedChat(chat); params.setMenu(false)}}
                  key={chat._id}
                  className='p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group'
                >
                  <div>
                    <p className='truncate w-full'>
                      {firstMessage
                        ? firstMessage.content.slice(0, 32)
                        : chat.name}
                    </p>

                    <p className='text-xm text-gray-500 dark:text-[#B1A6C0]'>
                      {moment(chat.updatedAt).fromNow()}
                    </p>
                  </div>

                  <img onClick={(e) => toast.promise(deleteChat(e, chat._id), {loading: 'Deleting...'})}
                    src={assets.bin_icon}
                    alt="bin"
                    className='hidden group-hover:block w-4 cursor-pointer not-dark:invert'
                  />
                </div>
              );
            })
        }
      </div>

      {/* community images */}
      <div onClick={() => {navigate('/community'); params.setMenu(false)}} className='flex items-center gap-2 p-3 mt-4 border border-gray-300
      dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all'>
        <img src={assets.gallery_icon} alt="gallery" className='w-4 not-dark:invert' />
        <div className='flex flex-col text-sm'>
          <p>Community Images</p>
        </div>
      </div>

      {/* credit purchase option */}
      <div onClick={() => {navigate('/credits'); params.setMenu(false)}} className='flex items-center gap-2 p-3 mt-4 border border-gray-300
      dark:border-white/15 rounded-md cursor-pointer hover:scale-105 transition-all'>
        <img src={assets.diamond_icon} alt="gallery" className='w-4 dark:invert' />
        <div className='flex flex-col w-full'>
          <p className='text-sm'>Credits : {user?.credits}</p>
          <p className='text-xs text-gray-400 '>Purchase Credits To Use Merngpt</p>
        </div>
      </div>

      {/* dark mode toggle */} 
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md'>
        <img
          src={assets.theme_icon}
          alt="theme"
          className='w-4 not-dark:invert'
        />

        <p className='flex-1 text-sm'>{theme === 'dark' ? 'Dark' : 'Light'} Mode</p>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`w-10 h-6 rounded-full transition-all
          ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-400'} cursor-pointer`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform
            ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
      
      {/* user account */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-300
      dark:border-white/15 rounded-md group'>
        <img src={assets.user_icon} alt="user" className='w-7 rounded-full' />
        <p className='flex-1 text-sm dark:text-primary truncate'>
          {user ? user.name : 'Login Your Account'}
        </p>
        {user && <img onClick={logout} src={assets.logout_icon} alt='logout' className='h-5 cursor-pointer
        hidden not-dark:invert group-hover:block'></img>}
      </div>
      
      {/* close menu option for handset device users */}
      <img onClick={() => params.setMenu(false)} src={assets.close_icon} alt="close" className='absolute top-3 right-3 w-5 h-5
      cursor-pointer md:hidden not-dark:invert'/>

    </div>
  )
}

export default SideBar