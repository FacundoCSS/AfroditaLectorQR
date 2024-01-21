import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import RejectedCard from '../components/RejectedCard'
import { useUsers } from '../context/UsersContext'

const Rejecteds = () => {
  
  const {rejecteds, getRejectedsInfo} = useUsers()

  useEffect(()=>{
      getRejectedsInfo()
  }, [])

  return (
    <div className='w-full min-h-[100vh] bg-lime-300'>
        <NavBar/>
        
        <div className='text-3xl font-extrabold p-4 text-center'>
            ❌ Rechazados
        </div>
        {
            rejecteds &&
            rejecteds.map((rejected)=>(
              <RejectedCard rejected={rejected} />
            ))
          }
    </div>
  )
}

export default Rejecteds