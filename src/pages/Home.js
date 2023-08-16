import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import { useUsers } from "../context/UsersContext"
import NavBar from '../components/NavBar';
import UserCard from '../components/UserCard';
import QRCodeScanner from '../components/QRCodeScanner';

const Home = () => {

  const [scanning, setScanning] = useState(true);
  const {users, getUsers} = useUsers()

  useEffect(()=>{
    getUsers()
  }, [])

  return (
    <div className='bg-lime-300 min-h-[100vh]'>
      <NavBar/>
      <div className='flex flex-col items-center'>
        <QRCodeScanner/>
        <Link
        to='/add'
        className='bg-lime-500 rounded-2xl p-3 inline-block mt-4 font-bold text-2xl text-white shadow-md shadow-black/40 hover:shadow-black/60 transition-all'
        >
          Añadir usuario
        </Link>
        <div className='flex flex-col items-center mt-4 w-full'>
          {
            users &&
            users.map((user)=>(
              <UserCard user={user} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home