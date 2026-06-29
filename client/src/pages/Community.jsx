import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Community = () => {
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const {axios, token} = useAppContext()

  const fetchImages = async () => {
    try {
      const {data} = await axios.get('/api/user/published-images', {
        headers: {Authorization: token}
      })
      if(data.success) {
        setImages(data.images)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  useEffect(() => {
    if(token) {
      fetchImages();
    }
  }, [token])

  if(loading) return (<Loading/>);

  return (
    <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full
    overflow-y-scroll'>
      <h2 className='text-xl font-semibold mb-6 text-gray-800
      dark:text-purple-100'>Community Images</h2>
      {images.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-5'>
          {images.map((image, index) => (
            <a key={index} href={image.imageUrl} target='_blank' className='relative group block rounded-lg overflow-hidden
            border border-gray-200 dark:border-purple-700 shadow-sm
            hover:shadow-md transition-shadow duration-300'>
              <img src={image.imageUrl} alt="imgUrl" className='w-full
              h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105
              transition-transform duration-300 ease-in-out'/>
              <p className='absolute bottom-0 right-0 text-xs bg-black/50
              backdrop-blur text-white px-4 py-1 rounded-tl-xl opacity-0
              group-hover:opacity-100 transition duration-300'>Created By {image.userName}</p>
               {image.isOwner && (
                <button onClick={(e) => {
                    e.preventDefault();
                    toast.promise(
                        axios.post('/api/message/delete-image', 
                            { chatId: image.chatId, messageId: image.messageId },
                            { headers: { Authorization: token } }
                        ).then(({ data }) => {
                            if (data.success) setImages(prev => prev.filter((_, i) => i !== index));
                            else throw new Error(data.message);
                        }),
                        { loading: 'Removing...', success: 'Removed!', error: 'Failed to remove' }
                    )
                }} className='absolute bottom-0 left-0 text-xs bg-red-500/80
                backdrop-blur text-white px-4 py-1 rounded-tr-xl opacity-0
                group-hover:opacity-100 transition duration-300'>
                    Delete
                </button>
            )}
            </a>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-600 dark:text-purple-200
        mt-10'>No Images Available.</p>
      )}
      
    </div>
  )
}

export default Community