import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { useUsers } from '../context/UsersContext'

const RequestCard = ({request}) => {
 
  const {acceptRequest, deleteRequest} = useUsers()

  return (
    <div className='bg-white w-[90%] m-auto rounded-2xl my-4 p-2 font-semibold'>
        <div className='flex items-center '>
            {
            request?.imageURL 
            ? <img className='object-cover w-full max-w-[100px] h-[150px] rounded-xl' src={ request.imageURL } alt={ request.name }/> 
            : <div className='w-[100px] h-[100px] flex bg-white rounded-xl'><AiOutlineUser className='h-[100px] w-[100px] text-neutral-900 m-auto'/></div>
            }
            <div>
                <div className='px-2 text-xl'>
                    {request.name}
                </div>
                <div className='px-2'>
                📱{request.number}
                </div>
                <div className='px-2'>
                🆔{request.dni}
                </div>
            </div>
        </div>
        <div className='pt-3 pb-1 flex items-center justify-around'>
            <button 
            onClick={()=>{acceptRequest(request.id)}}
            className='py-2 px-4 text-white bg-lime-500 rounded-xl'>
                Aceptar
            </button>
            <button 
            onClick={()=>{
                if(request.imageURL){
                    deleteRequest(request.name, request.imageURL, request.number, request.dni, request.id, true, false)
                } else{
                    deleteRequest(request.name, request.dni, null, request.number, request.id, false, false)
                }
            }}
            className='py-2 px-4 text-white bg-red-500 rounded-xl'>
                Rechazar
            </button>
        </div>
    </div>
  )
}

export default RequestCard