import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = (props) => {

  const ele = props.message.content;
  const time = moment(props.message.timestamp).fromNow();
  useEffect(() => {
    Prism.highlightAll();
  }, [ele])

  return (
    <div>
      {props.message.role === 'user' ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 
          dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
            <p>{ele}</p>
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{time}</span>
          </div>
          <img src={assets.user_icon} alt="user" className='w-8 rounded-full'/>
        </div>
      ) : 
      (
        <div className='inline-flex flex-col gap-2 p-2 px-4 bg-primary/20 
          dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl my-4'>
          {props.message.isImage ? (
            <img src={ele} alt='img' className='w-full max-w-md mt-2 rounded-md'/>
          ) : (
            <div className='text-sm dark:text-primary reset-tw'>
              <Markdown>{ele}</Markdown>
            </div>
          )}
          <span>{time}</span>
        </div>
      )}
    </div>
  )
}

export default Message