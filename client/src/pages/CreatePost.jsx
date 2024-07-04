import React, { useState } from 'react'
import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUploadImage = async () => {
    try {
      if(!file){
        setImageUploadError('Please select an image');
        return;
      }

      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-'+  file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) =>{
          const progress = 
          (snapshot.bytesTransferred/ snapshot.totalBytes)*100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) =>{
          setImageUploadError('Image Upload failed');
          setImageUploadProgress(null);
        },
        () =>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({...formData, image: downloadURL});
          });
        }
      );

    } catch (error) {
      setImageUploadError('Image Upload failed')
      setImageUploadProgress(null);
      console.log(error);
    }
  }
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
            <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
            <Button gradientDuoTone='greenToBlue' outline size='sm' onClick={handleUploadImage} disabled={imageUploadProgress}>
             {
              imageUploadProgress ?
              (
                <div className='w-16 h-16'>
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>

                </div>
              ) : 
              ( 'Upload Image')
             }

            </Button>
          </div>

          {imageUploadError && (<Alert color='failure'>{imageUploadError}</Alert>)}
          {formData.image && (
            <img src={formData.image} alt='upload' className='w-44 h-44 object-cover'/>
          )}

        <ReactQuill theme="snow" placeholder='Write something...' className='h-72 mb-12' required/>
        <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
        </form>
    </div>
  )
}
