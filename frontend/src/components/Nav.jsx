import React, { useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios'; 
import { setUserData } from '../redux/userSlice';
import { FaPlus } from 'react-icons/fa';
import {TbReceipt, TbReceipt2} from 'react-icons/tb'

function Nav() {
  const { userData, city } = useSelector(state => state.user)
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const dispatch = useDispatch()
  const serverUrl = "http://localhost:8000"; 

  const handleLogOut = async () => {
   try {
    const result = await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials: true}) 
    dispatch(setUserData(null))
    setShowInfo(false)
   } catch (error) {
    console.log(error)
   } 
  }
  
  return (
    <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible'>
      {/* Mobile Search */}
      {showSearch && userData?.role == "user" && (
        <div className='w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] z-50 p-4 md:hidden'>
          <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
            <FaLocationDot size={25} className='text-[#ff4d2d]' />
            <div className='w-[80%] truncate text-gray-600 '>
              {city || 'Noida'}
            </div>
          </div>
          <div className='w-[70%] flex items-center gap-[10px]'>
            <input 
              type="text" 
              placeholder="Search your delicious food..." 
              className='px-[10px] text-gray-700 outline-0 w-full'
            />
            <RxCross2 
              size={20} 
              className='text-[#ff4d2d] cursor-pointer' 
              onClick={() => setShowSearch(false)} 
            />
          </div>
        </div>
      )}

      <h1 className='text-3xl font-bold text-[#ff4d2d]'>Eatsy</h1>
      
      {/* Desktop Search */}
      {userData?.role == "user" && (
        <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex'>
          <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
            <FaLocationDot size={25} className='text-[#ff4d2d]' />
            <div className='w-[80%] truncate text-gray-600 '>
              {city || 'Noida'}
            </div>
          </div>
          <div className='w-[70%] flex items-center gap-[10px] px-[10px]'>
            <IoIosSearch size={20} className='text-[#ff4d2d]' />
            <input 
              type="text" 
              placeholder="Search your delicious food..." 
              className='px-[10px] text-gray-700 outline-0 w-full'
            />
          </div>
        </div>
      )}
      
      {/* Right side icons */}
      <div className='flex items-center gap-4'>
        {/* Mobile search toggle */}
        {userData?.role == "user" && (
          showSearch ? (
            <RxCross2 
              size={25} 
              className='text-[#ff4d2d] md:hidden cursor-pointer' 
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoIosSearch 
              size={25} 
              className='text-[#ff4d2d] md:hidden cursor-pointer' 
              onClick={() => setShowSearch(true)} 
            />
          )
        )}

        {userData?.role == "owner" ?  <>
        <button className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]'>
          <FaPlus size={20}/>
          <span>Add Food Items</span>
        </button>
        <button className='md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]'>

        </button>
        <div className='hidden md:flex items-center gap-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium '>
          <TbReceipt2 size={20}/>
          <span>My Orders</span>
          <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>0</span>
        </div>
        </> : (
          <>
          <div className='relative cursor-pointer'>
            <FiShoppingCart size={25} className='text-[#ff4d2d]' />
            <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d] text-sm font-bold'>0</span>
          </div>
        
        {/* Orders */}
          <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium'>
            My Orders
          </button>
          </>
        )}
        
        
        {/* User avatar */}
        <div 
          className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer' 
          onClick={() => setShowInfo(prev => !prev)}
        >
          {userData?.fullName?.slice(0, 1) || 'U'}
        </div>
        
        {/* User info dropdown */}
        {showInfo && (
          <div className='fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-4 flex flex-col gap-3 z-[9999]'>
            <div className='text-[17px] font-semibold'>{userData?.fullName || 'User'}</div>
            {userData?.role == "user" && (
              <div className='md:hidden font-semibold cursor-pointer text-[#ff4d2d]'>
                My Orders
              </div>
            )}
            <div 
              className='text-[#ff4d2d] font-semibold cursor-pointer'
              onClick={handleLogOut}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;