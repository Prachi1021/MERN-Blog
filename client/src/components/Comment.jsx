import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

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

    const handleEdit = () => {      //as we have to chnge only this comment that's why here 
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'

                    },
                    body: JSON.stringify({
                        content: editedContent
                    })
                }
            );

            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }

        } catch (error) {
            console.log(error.message)
        }
    }

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

                {isEditing ? (
                    <>
                        <Textarea
                            className='mb-2'
                            onChange={(e) => setEditedContent(e.target.value)}
                            value={editedContent} />

                        <div className='flex gap-2 justify-end text-xs'>
                            <Button size='sm'
                                type='button'
                                gradientDuoTone='purpleToBlue'
                                onClick={handleSave}>
                                Save</Button>

                            <Button size='sm'
                                type='button'
                                gradientDuoTone='purpleToBlue' outline
                                onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </>

                ) : (
                    <>
                        <p className='pb-2 text-gray-500'>{comment.content}</p>

                        <div className='flex gap-2 text-xs items-center pt-2 border-t max-w-fit dark:border-t-gray-700'>
                            <button type='button' onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
                                <FaThumbsUp className='text-sm' />
                            </button>

                            <p className='text-gray-400'>
                                {
                                    comment.numberOfLikes > 0 &&
                                    comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')
                                }
                            </p>

                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) &&
                                <>
                                    <button
                                        onClick={handleEdit} type='button' className='hover:text-blue-500 text-gray-400'>
                                        Edit
                                    </button>
                                    <button
                                        onClick={()=>onDelete(comment._id)} type='button' className='hover:text-red-500 text-gray-400'>
                                        Delete
                                    </button>

                                </>
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
