import React from 'react'
import { Link } from 'react-router-dom'


export default function PostCard({post}) {
  return (
    <div className='group relative w-full border h-[350px] overflow-hidden sm:w-[340px] rounded-lg border-teal-500 hover:border-2 transition-all'>
        <Link to={ `/post/${post.slug}`}>
        <img src={post.image} alt='post cover' className='h-[220px] object-cover w-full group-hover:h-[180px] transition-all duration-300 z-20' />
        </Link>

        <div className='flex flex-col p-3 gap-2'>
            <p className='font-semibold text-lg line-clamp-2' >{post.title}</p>
            <span className='italic text-sm'>{post.category}</span>
            <Link to={`/post/${post.slug}`}
            className='group-hover:bottom-0 z-10 absolute bottom-[-200px] left-0 right-0  border border-teal-500 text-teal-500 hover:bg-teal-500 py-2 text-center hover:text-white transition-all duration-300 rounded-md !rounded-tl-none m-2'>
            Read article 
            </Link>
        </div>
      
    </div>
  )
}
