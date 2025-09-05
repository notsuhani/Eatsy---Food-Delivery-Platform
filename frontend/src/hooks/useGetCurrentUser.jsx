import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { severUrl } from '../App'

function useGetCurrentUser() {
  const dispatch = useDispatch()
  useEffect(()=>{
    const fetchuser = async () => {
        try {
            const result = await axios.get(`${severUrl}/api/user/current`,
                {withCredentials: true})
                dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    fetchuser()
  }, [])
}

export default useGetCurrentUser