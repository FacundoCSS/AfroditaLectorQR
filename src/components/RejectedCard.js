import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { useUsers } from '../context/UsersContext'

const RejectedCard = ({rejected}) => {

  const {undoReject, deleteRejected} = useUsers()

  return (
    <div className='bg-white w-[90%] m-auto rounded-2xl my-4 p-2 font-semibold'>
        <div className='flex items-center '>
            {
            rejected?.imageURL 
            ? <img className='object-cover w-full max-w-[100px] h-[150px] rounded-xl' src={ rejected.imageURL } alt={ rejected.name }/> 
            : <div className='w-[100px] h-[100px] flex bg-white rounded-xl'><AiOutlineUser className='h-[100px] w-[100px] text-neutral-900 m-auto'/></div>
            }
            <div>
                <div className='px-2 text-xl'>
                    {rejected.name}
                </div>
                <div className='px-2'>
                📱{rejected.number}
                </div>
                <div className='px-2'>
                🆔{rejected.dni}
                </div>
            </div>
        </div>
        <div className='pt-3 pb-1 flex items-center justify-around'>
            <button 
            onClick={()=>{undoReject(rejected.name, rejected.number, rejected.imageURL, rejected.id, rejected.dni)}}
            className='py-2 px-4 text-white bg-lime-500 rounded-xl'>
                Aceptar
            </button>
            <button 
            onClick={()=>{
              deleteRejected(rejected.id, rejected.dni)
            }}
            className='py-2 px-4 text-white bg-red-500 rounded-xl'>
                Eliminar
            </button>
        </div>
    </div>
  )
}

export default RejectedCard