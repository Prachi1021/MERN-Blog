import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp }  from 'react-icons/fa'
import { useSelector } from 'react-redux';

export default function Comment({ comment, onLike }) {
    const [user, setUser] = useState({});
    const {currentUser} = useSelector((state)=>state.user);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment]);
    return (
        <div className='flex  border-b p-4 text-sm dark:border-gray-600'>

            <div className='flex-shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>

            <div className='flex-1'>
                <div className='flex mb-1 items-center'>
                    <span className='font-bold text-xs mr-1 truncate'>{user ? `@${user.username}` : "anonymous user"}</span>

                    <span className='text-xs text-gray-500'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>

                <p className='pb-2 text-gray-500'>{comment.content}</p>

                <div className='flex gap-2 text-xs items-center pt-2 border-t max-w-fit dark:border-t-gray-700'>
                    <button type='button' onClick={()=>onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
                        <FaThumbsUp className='text-sm'/>
                    </button>

                    <p className='text-gray-400'>
                        {
                        comment.numberOfLikes >0 && 
                        comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')
                        }
                    </p>
                </div>
            </div>

        </div>
    )
}
