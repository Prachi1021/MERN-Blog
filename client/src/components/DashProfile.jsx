import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom';


export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  //once we choose a file we will save this file in a piece of state 
  const [imageFile, setImageFile] = useState(null);

  //convert the image file to url
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);  // to be sure img is completly uploaded
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // to show if update is success or not
  const [updateUserError, setUpdateUserError] = useState(null); //to show if any update error
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  //use ref to go to take image as input
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));  //convert img file to url that browser has and only I could see
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match / b / { bucket } / o {
    //     match / { allPaths=**} {
    //   allow read;
    //   allow write: if
    //   request.resource.size < 2 * 1024 * 1024 &&
    //         request.resource.contentType.matches('image/.*');
    //     }
    //   }
    // }

    setImageFileUploading(true);
    setImageFileUploadError(null); // to show no error while reuploading a correct img
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0)); //rounding 
      },
      (error) => {
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);  //if wrong img then dont show 0% progress
        setImageFile(null);  //if wrong img is uploaded then prev img appears as default
        setImageFileUrl(null); // same as above
        setImageFileUploading(false);
      },
      () => {
        //get feedback
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL }); //set the new profile pic in the piece of state
          setImageFileUploading(false);
        })
      },
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }) //target id pr value set krna
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to updload")
      return;
    }
    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
      else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () =>{
    setShowModal(false);
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();

      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }
      else{
        dispatch(deleteUserSuccess(data));
      }
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();

      if(!res.ok){
        console.log(data.message);
      }
      else{
        dispatch(signoutSuccess());

      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-7  font-semibold text-3xl text-center'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />

        <div className=' relative w-32 h-32  shadow-md self-center overflow-hidden cursor-pointer rounded-full' onClick={() => filePickerRef.current.click()}>

          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`,
                },
              }} />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt='user'
            className={`rounded-full w-full h-full self-center border-8 border-[lightgray] object-cover 
            ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
          {/* if any img is not square inshape */}
        </div>

        {imageFileUploadError && <Alert color='failure' >{imageFileUploadError}</Alert>}

        <TextInput type='username' placeholder='username' id='username'
          defaultValue={currentUser.username} onChange={handleChange}
        />

        <TextInput type='email' placeholder='email' id='email'
          defaultValue={currentUser.email} onChange={handleChange}
        />

        <TextInput type='password' placeholder='password' onChange={handleChange}
        />

        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
          {loading ? 'Loading...' : 'Update'}
        </Button>
        
        {/* only for admin */}
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>Create a Post</Button>
          </Link>
        )}
      </form>

      <div className='text-red-500 justify-between flex mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
      </div>

      {updateUserSuccess && <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>}
      {updateUserError && <Alert color='failure' className='mt-5'>{updateUserError}</Alert>}
      {error && <Alert color='failure' className='mt-5'>{error}</Alert>}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-5' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>

            <div className='flex gap-4 justify-center'>
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>

              <Button color='gray' onClick={()=> setShowModal(false)}>No, cancel</Button>
            </div>

          </div>
        </Modal.Body>

      </Modal>
    </div>
  );
}
