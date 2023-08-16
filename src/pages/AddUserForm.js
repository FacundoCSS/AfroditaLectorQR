import { useState } from 'react'

import { AiOutlineUserAdd, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { useUsers } from '../context/UsersContext'
import { Link, useNavigate } from 'react-router-dom'

const AddUserForm = ({initialValues}) => {

  const {navigate} = useNavigate()

  const {addUser, updateUser} = useUsers()

    const [value, setValue] = useState( 
    initialValues 
    ? {
      name: initialValues.name, 
      dni: initialValues.dni, 
      imageFile: null
    }
    : {
      name: null, 
      dni: null, 
      imageFile: null
    })
    const [state, setState] = useState()
    const [isLoading, setIsLoading] = useState(false)
  
  const readFile = (file)=>{
    const reader = new FileReader()
    reader.readAsDataURL(file)
    return reader.addEventListener("load", e=>{
        let newImg = `<img src='${e.currentTarget.result}' class='object-cover h-32 w-32 rounded-full' alt="avatar"></img>`
        document.querySelector(".resultado").innerHTML=newImg
  })
  }
  const handleSubmit  = async (e)=>{
    e.preventDefault();
    try {
      if(!initialValues){
        setIsLoading(true)
        await addUser(value);
        navigate('/')
      }
      else{
        setIsLoading(true)
        await updateUser(value, initialValues.id);
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  return (
    <div className='bg-lime-300 w-full h-[100vh]'>
      <div className='bg-neutral-900 h-[10vh] w-full text-3xl px-[20px] text-white font-semibold flex items-center'>
        <Link to='/' className='flex items-center justify-center'>
          <BiArrowBack/>
        </Link>
      </div>
      <form className='w-full  flex flex-col items-center font-semibold text-lg' onSubmit={handleSubmit}>
        <h2 className='text-3xl font-bold my-4'>
          Añade una persona
        </h2>
        <label 
        htmlFor="file-1"
        className='p-[15px] bg-neutral-200 rounded-full text-neutral-500 hover:bg-neutral-300 hover:text-neutral-700 cursor-pointer'
        >
        {
            state
            ?<div className='resultado'></div>  
            :
            initialValues?.imageURL
            ?<img src={initialValues.imageURL} class='object-cover h-32 w-32 rounded-full' alt="avatar"></img>
            : <AiOutlineUserAdd className='h-32 w-32'/>
        }
        
        </label> 
        
        <input 
        type="file" 
        name="imageFile" 
        className='absolute invisible'
        id="file-1"
        onChange={e => {
          readFile(e.target.files[0])
          setState(true)
          setValue({...value, imageFile: e.target.files[0]})
        }}
        />

        <label htmlFor="name" className='mt-4 text-xl font-bold'>Nombre</label>
        <input
        id='name'
        required
        defaultValue={initialValues ? initialValues.name: ""}
        className="p-4 shadow-md shadow-black/60 rounded-2xl mt-1 outline-none focus:outline-none w-[70%] focus:w-[80%] transition-all"
        placeholder='Facundo Cordoba'
        onChange={(e) => setValue({ ...value, name: e.target.value })}
        />

        <label htmlFor="dni" className='mt-4 text-xl font-bold'>Documento</label>
        <input
        id='dni'
        type='number'
        required
        defaultValue={initialValues ? initialValues.dni: ""}
        className="p-4 shadow-md shadow-black/60 rounded-2xl mt-1 outline-none focus:outline-none w-[70%] focus:w-[80%] transition-all"
        placeholder='45123123'
        onChange={(e) => setValue({ ...value, dni: e.target.value })}
        />
        
        <button type='submit' className='mt-6 py-4 px-6 bg-lime-500 hover:bg-lime-600 shadow-md shadow-black/60 transition-all rounded-3xl'>
          {
            isLoading 
            ? <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto'/>
            : 'Guardar'
          }
        </button>
      </form>
    </div>
  )
}

export default AddUserForm