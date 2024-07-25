import React, { useEffect, useState } from 'react'
import moment from 'moment'

export default function Comment({ comment }) {
    const [user, setUser] = useState({});

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
            </div>

        </div>
    )
}
