import React from 'react'
import {Button, FileInput, Select, TextInput} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className='min-h-screen p-3  max-w-3xl mx-auto'>
        <h1 className='my-7 text-3xl font-semibold text-center '>Create a Post</h1>
        <form className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 sm:flex-row justify-between' >
            <TextInput type='text' placeholder='Title' required id='title' className='flex-1'/>
            <Select>
              <option value='uncategorized'>Select a category</option>
              <option value='java'>Java</option>
              <option value='reactjs'>React.js</option>
              <option value='nodejs'>Node.js</option>
            </Select>
          </div>

          <div className='flex  items-center justify-between gap-4 border-teal-500 border-dashed border-2 p-3'>
            <FileInput type='file' accept='image/*'/>
            <Button gradientDuoTone='greenToBlue' outline size='sm'>Upload Image</Button>
          </div>

        <ReactQuill theme="snow" placeholder='Write something...' className='h-72 mb-12' required/>
        <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
        </form>
    </div>
  )
}
