import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    const fetchPosts = async ()=>{
      const res = await fetch('/api/post/getposts');
      const data = await res.json();
      setPosts(data.posts);
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <div className=" flex flex-col px-3 p-28 mx-auto max-w-6xl gap-6">
        <h1 className='text-3xl lg:text-6xl font-bold'>Welcome to my Blog</h1>

        <p className='text-xs sm:text-sm text-gray-500'>Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and  programming languages.</p>

        <Link to='/search' className='text-xs sm:text-sm font-bold hover:underline text-teal-500'>
        View all posts
        </Link>
      </div>

      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction/>
      </div>

      <div className='max-w-6xl ms-auto p-3 gap-8 py-7 flex flex-col'>
        {posts && posts.length>0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='font-bold text-3xl text-center'>Recent Posts</h2>

            <div className='flex flex-wrap gap-4'>
              {posts.map((post)=>(
                <PostCard post={post} key={post._id}/>
              ))}
            </div>

            <Link to='/search' className='text-teal-500 hover:underline font-semibold text-lg text-center'>
            View all Posts
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
