import { useNavigate } from 'react-router-dom'

import {AiOutlineUser} from 'react-icons/ai'


const UserCard = ({user}) => {

  const navigate = useNavigate() 
  return (
    <div 
    onClick={()=>{
      navigate(user.id)
    }}
    className='flex flex-col items-center my-4 p-4 bg-white rounded-2xl text-xl font-bold shadow-xl shadow-black/40 cursor-pointer hover:shadow-black/60 transition-all'
    >
      {
        user?.imageURL 
        ? <img className='object-cover w-full max-w-[250px] h-[250px]' src={ user.imageURL } alt={ user.name }/> 
        : <div className='w-full h-[250px] flex bg-white'><AiOutlineUser className='h-[200px] w-[200px] text-neutral-900 m-auto'/></div>
      }
      <div className='my-1'>{user.name}</div>
      <div className='my-1'>{user.dni}</div>
    </div>
  )
}

export default UserCard