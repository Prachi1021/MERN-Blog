import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
    const { postSlug } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();

                if (!res.ok) {
                    setLoading(false);
                    setError(true);
                    return;
                }
                if (res.ok) {
                    setPost(data.posts[0]); //give first indx as this will return set of posts from getpostsn route
                    setError(false);
                    setLoading(false);
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchPost();
    }, [postSlug]);

    useEffect(()=>{
        try {
            const fetchRecentPosts = async () =>{
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json();

                if(res.ok){
                    setRecentPosts(data.posts)//as we are getting 3 things from data(posts, numberof posts, lastmonthpost) and we only want posts
                }

            }
            fetchRecentPosts();
        } catch (error) {
            console.log(error.message);
        }
        
    },[]);

    if (loading) return (
        <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
        </div>
    );
    return (
        <main className='p-3 flex flex-col min-h-screen max-w-6xl mx-auto'>
            <h1 className='text-3xl mx-auto p-3 mt-10 font-serif text-center max-w-2xl lg:text-4xl'>{post && post.title}</h1>

            <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
                <Button pill color='gray' size='xs'>{post && post.category}</Button>
            </Link>

            <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 w-full max-h-[600px] object-cover' />

            <div className='flex justify-between p-3 border-b border-slate-500 w-full max-w-2xl text-sm mx-auto'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>

            <div className='max-w-2xl w-full p-3 mx-auto post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}>
            </div>

            <div className='mx-auto w-full max-w-4xl'>
                <CallToAction />
            </div>

            <CommentSection postId ={post._id}/>

            <div className='flex flex-col mb-5 justify-center items-center'>
                <h1 className='mt-5 text-xl'>Recent Articles</h1>

                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                    {
                        recentPosts &&
                        recentPosts.map((post) => <PostCard key={post._id} post= {post}/>)
                    }

                </div>
            </div>

        </main>
    )
}
