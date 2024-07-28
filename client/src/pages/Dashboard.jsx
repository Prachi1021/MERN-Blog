import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'  // to get infor which tab we are in
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {   //each tym we visit this page we get the tab
    const urlParams = new URLSearchParams(location.search); //to get parameters
    const tabFromUrl = urlParams.get('tab');
    
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* DashSidebar */}
        <DashSidebar/>
      </div>

      { tab === 'profile' && <DashProfile/>}
      {/* DashProfile */}

      {tab === 'posts' && <DashPosts/>}

      { tab === 'users' && <DashUsers/>}

      {tab === 'comments' && <DashComments/>}
    </div>
  )
}
