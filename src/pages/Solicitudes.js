import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import RequestCard from '../components/RequestCard'
import { useUsers } from '../context/UsersContext'

const Solicitudes = () => {

    const {requests, getRequests, loadNextRequests} = useUsers()

    useEffect(()=>{
        getRequests()
    }, [])

  return (
    <div className='w-full min-h-[100vh] bg-lime-300'>
        <NavBar/>
        
        <div className='text-3xl font-extrabold p-4 text-center'>
            📝 Solicitudes
        </div>
        <div className='text-xl font-semibold p-4 text-center'>
            Ultimas 20 solicitudes
        </div>
        {
            requests &&
            requests.map((request)=>(
              <RequestCard request={request} />
            ))
          }
        <div
        onClick={loadNextRequests}
        className='m-auto w-64 bg-white rounded-2xl font-semibold p-4 text-center'>
          Cargar siguientes 20 solicitudes
        </div>
    </div>
  )
}

export default Solicitudes