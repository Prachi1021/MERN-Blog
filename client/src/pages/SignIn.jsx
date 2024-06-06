import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function SignIn() {

  //for seeing any change in the input section of username, email, password
  // const handleChange = (e) =>{
  //   console.log(e.target.value);
  // }

  const [formData, setFormData] = useState({});//empty obj

  // const [errorMessage, setErrorMessage] = useState(null); //any type of error
  // const [loading, setLoading] = useState(false); //loading effect due to low network connectivity

  const {loading, error: errorMessage} = useSelector(state => state.user);

  const dispatch = useDispatch(); //to dispatch signinstart,success,failure

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); //formData will give username as well when we will chng email in the obj , id will track chng of which part is changed
  }

  // console.log(formData);

  const handleSubmit = async (e) => { // async used as submitting to database takes time so we use await
    e.preventDefault(); //avoids refreshing of page as we click on SignIn button

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill out all the fields'));
    }

    //for submitting data
    try {
      dispatch(signInStart());

      const res = await fetch('api/auth/signin', {         //fetch to fetch data
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, //get headers in the json form
        body: JSON.stringify(formData), //to convert json into string data format
      });

      const data = await res.json(); //convert to data 

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      // setLoading(false);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/')
      }



    } catch (error) {
      dispatch(signInFailure(error.message));
      // setErrorMessage(error.message); //client side error
      // setLoading(false);

    }

  }



  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>

        {/* left */}
        <div className='flex-1'>
          <Link
            to='/'
            className='text-4xl font-bold dark:text-white'
          >
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Prachi's
            </span>
            Blog
          </Link>

          <p className='mt-5 text-sm'>
            This is a demo project. You can sign-in using your email and password or with google.
          </p>

        </div>

        {/* right */}
        <div className='flex-1'>

          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@company.com' id='email' //to get info for submitting the form
                onChange={handleChange} />
            </div>

            <div>
              <Label value='Your Password' />
              <TextInput type='password' placeholder='********' id='password' //to get info for submitting the form
                onChange={handleChange} />
            </div>

            <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>  //more than 1 html elements in () so add <>
                ) : 'Sign In'
              }
            </Button>

          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
          </div>

          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }

        </div>

      </div>
    </div>
  )
}

