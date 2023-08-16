import React, { useEffect, useState } from 'react'
import { useParams,  Link } from 'react-router-dom'
import QRCode from 'qrcode'

import { useUsers } from '../context/UsersContext'

import { AiOutlineUser } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'

const User = () => {

  const [imageURL, setImageURL] = useState('')
  const [userData, setUserData] = useState()

    const {id} = useParams()
    const {getUser} = useUsers(id)

    const callData = async()=>{
      const data = await getUser(id)
      const documentData = data.data()
      setUserData(documentData)
    }

    useEffect(()=>{
      callData()
         
      QRCode.toDataURL(id)
      .then(url => {
        setImageURL(url)
        console.log(url)
      })
      .catch(err => {
        console.error(err)
      })

    }, [])

  return (
    <div className='bg-lime-300 min-h-[100vh]'>
      <div className='bg-neutral-900 h-[10vh] w-full text-3xl px-[20px] text-white font-semibold flex items-center'>
        <Link to='/' className='flex items-center justify-center'>
          <BiArrowBack/>
        </Link>
      </div>
    {
      userData &&
        <div className='flex flex-col items-center my-4 p-4 text-xl font-bold'>
          {
            userData?.imageURL 
            ? <img className='object-cover w-full max-w-[250px] h-[250px]' src={ userData.imageURL } alt={ userData.name }/> 
            : <div className='w-full h-[250px] flex bg-white'><AiOutlineUser className='h-[200px] w-[200px] text-neutral-900 m-auto'/></div>
          }
          <div className='my-1'>{userData.name}</div>
          <div className='my-1'>{userData.dni}</div>        
          {
            imageURL &&
            <img src={imageURL}/>
          }
        </div>  
        }
      </div>
  )
}

export default User