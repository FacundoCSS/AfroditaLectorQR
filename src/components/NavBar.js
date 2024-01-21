import {useState} from 'react'
import { useAuth } from "../context/AuthContext";
import {AiOutlineMenu, AiOutlineClose} from 'react-icons/ai'
import { Link } from 'react-router-dom';

const NavBar = () => {

  const { logout } = useAuth();

  const [isOpenNavBar, setIsOpenNavbar] = useState(false)


  return (
    <div className='transition-all'>
      <div 
      className={
        isOpenNavBar
        ?'fixed h-[100vh] w-full bg-neutral-900 z-20 text-white text-3xl transition-all'
        :'fixed h-[100vh] w-[0px] bg-neutral-900 z-20 transition-all'
      }
      >
        <div className={
          isOpenNavBar
          ?'w-full h-[100vh] text-white text-3xl flex flex-col transition-all delay-150'
          :'w-full h-[100vh] invisible'
        }>
          <div className='h-[10vh] w-full flex items-center justify-end px-[20px] font-semibold'>
            <AiOutlineClose className=' transition-all duration-0 cursor-pointer' onClick={()=>{setIsOpenNavbar(false)}}/>
          </div>

          <Link
          to='/'
          className='block p-2 w-52 m-4 border-2 border-lime-500 hover:bg-lime-500 rounded font-bold text-center'
          >
            Aceptados
          </Link>
          <Link
          to='/solicitudes'
          className='block p-2 w-52 m-4 border-2 border-yellow-400 hover:bg-yellow-400 rounded font-bold text-center'
          >
            Solicitudes
          </Link>

          <Link
          to='/rechazados'
          className='block p-2 w-52 m-4 border-2 border-red-400 hover:bg-red-400 rounded font-bold text-center'
          >
            Rechazados
          </Link>

          <button 
          onClick={()=>{logout()}}
          className='block p-2 w-52 m-4 border border-white text-white rounded hover:bg-white hover:text-black font-semibold'
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className='bg-neutral-900 h-[10vh] w-full text-3xl px-[20px] text-white font-semibold flex items-center'>
      <AiOutlineMenu
      className='absolute cursor-pointer z-10 select-none'
      onClick={()=>{setIsOpenNavbar(true)}}
      />
      </div>
      
    </div>
  )
}

export default NavBar