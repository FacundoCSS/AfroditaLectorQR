import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { AiOutlineUser, AiOutlineDelete } from 'react-icons/ai'
import { useUsers } from '../context/UsersContext'

const UserCard = ({application, setShownAccepted, shownAccepteds}) => {

  const { deleteRequest, acceptRequest, undoReject, deleteRejected } = useUsers()

  const handleDelete= (id, name)=>{
    toast(t=>(
        <div>
            <p className='text-white'>¿Seguro que quieres eliminar a <strong>{name}</strong> ?</p>
            <div>
                <button 
                className='bg-red-500 hover:bg-red-400 px-3 py-2 rounded-sm text-sm mx-2 text-white'
                onClick={()=> {
                  if(application.imageURL){
                    deleteRequest(application.name, application.imageURL, application.number, application.dni, application.id, true, true)
                } else{
                  deleteRequest(application.name, application.imageURL, application.number, application.dni, application.id, false, true)
                }
                    toast.dismiss(t.id)
                }}
                >
                    Eliminar
                </button>
                <button className='bg-slate-400 hover:bg-slate-500 px-3 py-2 rounded-sm mx-2 text-white'
                onClick={()=> toast.dismiss(t.id)}
                >
                    Cancelar
                </button>
            </div>
        </div>
    ), {
        style:{
            background: "#202020"
        }
    })
  }


  const navigate = useNavigate() 
  return (
    <div 
    onClick={()=>{
      navigate(application.id)
    }}
    className='flex flex-col items-center my-4 p-4 bg-white rounded-2xl text-xl font-bold shadow-xl shadow-black/40 cursor-pointer hover:shadow-black/60 transition-all'
    >
      {
      application?.accepted ?
      <div className='text-center w-full font-bold text-2xl py-3'>
        Aceptado ✅
      </div>
      :
      application?.rejected 
      ?
      <div className='text-center w-full font-bold text-2xl py-3'>
        Rechazado ❌
      </div>
      :
      <div className='text-center w-full font-bold text-2xl py-3'>
        En espera ⏳
      </div>
      }

      {
        application?.imageURL 
        ? <img className='object-cover w-full max-w-[250px] h-[250px]' src={ application.imageURL } alt={ application.name }/> 
        : <div className='w-full h-[250px] flex bg-white'><AiOutlineUser className='h-[200px] w-[200px] text-neutral-900 m-auto'/></div>
      }
      <div className='my-1'>{application.name}</div>
      <div className='my-1'>📱{application.number}</div>
      <div className='my-1'>🆔{application.dni}</div>
      {

      application?.accepted

      ?

      <div className='flex my-2 w-full justify-around text-white'>
        <div 
        onClick={(e)=>{
          e.stopPropagation()
          handleDelete(application.id, application.name)
        }}
        className='flex bg-red-500 rounded-2xl p-3 shadow-md shadow-black/40 hover:shadow-black/60 hover:bg-red-600 transition-all'>
          <AiOutlineDelete className='m-auto w-6 h-6'/>
        </div>
      </div>

      :

      application?.rejected
      
      ?
      <div className='flex my-2 w-full justify-around text-white items-center'>
        <button 
        onClick={(e)=>{
          e.stopPropagation();
          undoReject(application.name, application.number, application.imageURL, application.id, application.dni)

          let acceptedApplication = application;
          acceptedApplication.accepted = true;
          acceptedApplication.rejected = false;
          setShownAccepted(shownAccepteds.filter(accepted => accepted.id === application.id ? acceptedApplication : accepted))
        }}
        className='py-2 px-4 text-white bg-lime-500 rounded-xl mx-2'>
            Aceptar
        </button>
        <button 
        onClick={(e)=>{
          e.stopPropagation();
          deleteRejected(application.id, application.dni)
          setShownAccepted(shownAccepteds.filter(accepted => accepted.id !== application.id && accepted))
        }}
        className='py-2 px-4 text-white bg-red-500 rounded-xl mx-2'>
            Eliminar
        </button>
      </div>
    
    :
    
    <div className='flex my-2 w-full justify-around text-white items-center'>
      <button 
      onClick={(e)=>{
        e.stopPropagation();
        acceptRequest(application.id);
        let acceptedApplication = application;
        acceptedApplication.accepted = true;
        setShownAccepted(shownAccepteds.filter(accepted => accepted.id === application.id ? acceptedApplication : accepted))

      }}
      className='py-2 px-4 text-white bg-lime-500 rounded-xl mx-2'>
          Aceptar
      </button>
      <button 
      onClick={(e)=>{
          e.stopPropagation()
          setShownAccepted()
          if(application.imageURL){
              deleteRequest(application.name, application.imageURL, application.number, application.dni, application.id, true, false)
          } else{
              deleteRequest(application.dni, null, application.number, application.id, false, false)
          }
      }}
      className='py-2 px-4 text-white bg-red-500 rounded-xl mx-2'>
          Rechazar
      </button>
    </div>

      }
    </div>
  )
}

export default UserCard