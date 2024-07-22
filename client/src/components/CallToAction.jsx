import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row border border-teal-500 p-3 items-center justify-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl '>Want to know the interview experiences of your seniors??</h2>

        <p className='text-gray-500 my-2'>Check out this site "Campus-Connect"  with 70+ interview experiences and also have a look at the resources and openings.</p>

        <Button 
        className='rounded-tl-xl rounded-bl-none'
        gradientDuoTone='purpleToPink' >
                  <a href='https://campus-connect-iet.vercel.app/' target='_blank' rel='noopener noreferrer'>Click Here</a>
        </Button>
      </div>

      <div className='p-7 flex-1'>
              <img src='https://blogimage.vantagecircle.com/content/images/2019/04/interview-questions.png'/>
      </div>
    </div>
  )
}
