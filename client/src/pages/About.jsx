import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen items-center justify-center flex'>
      <div className='max-w-2xl mx-auto text-center p-3'>
        <h1 className='my-7 font-semibold text-3xl text-center'>About Prachi's Blog</h1>

        <div className='text-gray-500 flex flex-col gap-6 text-md'>
          <p>
            Welcome to Prachi's Blog! This blog was created by Prachi Suryawanshi as a personal project to share her thoughts and ideas with the
            world. Prachi is a passionate developer who loves to write about
            technology, coding, and everything in between.
          </p>

          <p>
            On this blog, you'll find weekly articles and tutorials on topics
            such as web development, software engineering, and programming
            languages. Prachi is always learning and exploring new
            technologies, so be sure to check back often for new content!
          </p>

          <p>
            We encourage you to leave comments on our posts and engage with
            other readers. You can like other people's comments and reply to
            them as well. We believe that a community of learners can help
            each other grow and improve.
          </p>
        </div>

      </div>
    </div>
  )
}
