import { Button, TextInput } from 'flowbite-react';
import React from 'react'
import { useSelector } from 'react-redux'

export default function DashProfile() {
  const { currentUser } = useSelector(state => state.user);

  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-7  font-semibold text-3xl text-center'>Profile</h1>
      <form className='flex flex-col gap-4 '>
        <div className='w-32 h-32  shadow-md self-center overflow-hidden cursor-pointer rounded-full'>
          <img src={currentUser.profilePicture} alt='user'
            className='rounded-full w-full h-full self-center border-8 border-[lightgray] object-cover' />
          {/* if any img is not square inshape */}
        </div>

        <TextInput type='username' placeholder='username' id='username'
          defaultValue={currentUser.username}
        />

        <TextInput type='email' placeholder='email' id='email'
          defaultValue={currentUser.email}
        />

        <TextInput type='password' placeholder='password'
        />

        <Button gradientDuoTone='purpleToBlue' outline>Update</Button>
      </form>

      <div className='text-red-500 justify-between flex mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
