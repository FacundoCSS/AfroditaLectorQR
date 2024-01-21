import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useUsers } from "../context/UsersContext"
import NavBar from '../components/NavBar';
import UserCard from '../components/UserCard';
import QRCodeScanner from '../components/QRCodeScanner';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [filter, setFilter] = useState('all');
  const [shownAccepteds, setShownAccepted] = useState([]);
  const [dniSearch, setDniSearch] = useState()
  const [nameSearch, setNameSearch] = useState()
  const [inputType, setInputType] = useState('name')

  const { accepteds, searchQr, searchByName } = useUsers();

  const navigate = useNavigate()

  const changeShown = (changedFilter) => {
    if (changedFilter === 'all') {
      setShownAccepted(accepteds);
    } else if (changedFilter === 'sent') {
      setShownAccepted(accepteds.filter((user) => user.sent === true));
    } else if (changedFilter === 'unSent') {
      setShownAccepted(accepteds.filter((user) => user.sent === false));
    }
  };
  
  const handleSearchName = async ()=>{
    if(nameSearch.length > 2) {
      const res = await searchByName(nameSearch); 
      if ( res.length > 0){
        setShownAccepted(res)
      }
      else{
        toast(t=>(
          <div className='flex text-white'>
              <div className='w-[80%]'>
                  <div className='font-semibold text-[15px] text-white text-xl'>No se encontraron usuarios con el nombre "{nameSearch}"</div>
              </div>
          </div>
      ), {
          style:{
              background: "#171717",
          }
      })
      }
    }
  }

  const handleSearch = async ()=>{
    const res = await searchQr(dniSearch)
    if( res.length > 0){
      if (res[0].accepted === true){
        navigate(res[0].id)
      }
      else{
        toast(t=>(
          <div className='flex text-white'>
              <div className='w-[80%]'>
                  <div className='font-semibold text-[15px] text-white text-xl'>La solicitud aun no ha sido aceptada </div>
              </div>
          </div>
      ), {
          style:{
              background: "#171717",
          }
      })
      }
    }
    else{
      toast(t=>(
        <div className='flex text-white'>
            <div className='w-[80%]'>
                <div className='font-semibold text-[15px] text-white text-xl'>Esta persona todavia no completó el formulario o fué rechazada</div>
            </div>
        </div>
    ), {
        style:{
            background: "#171717",
        }
    })
    }
  }

  useEffect(() => {
    changeShown(filter);
  }, [filter, accepteds]);

  return (
    <div className='bg-lime-300 min-h-[100vh]'>
      <NavBar />
      <div className='flex flex-col items-center'>
        <QRCodeScanner />

        <div className='flex items-center justify-around py-4 font-bold text-white'>
          <button
            className={`${
              filter === 'all' ? 'bg-sky-500' : 'bg-lime-500'
            } p-4 rounded-xl mx-2`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={`${
              filter === 'sent' ? 'bg-sky-500' : 'bg-lime-500'
            } p-4 rounded-xl mx-2`}
            onClick={() => setFilter('sent')}
          >
            Enviados
          </button>
          <button
            className={`${
              filter === 'unSent' ? 'bg-sky-500' : 'bg-lime-500'
            } p-4 rounded-xl mx-2`}
            onClick={() => setFilter('unSent')}
          >
            Sin enviar
          </button>
        </div>

        <div className='flex items-center font-semibold'>
        Buscar clientes por  
            {
              inputType === 'name'
              ? 
              <button 
              onClick={()=>setInputType('dni')}
              className='p-1 bg-sky-500 text-white rounded-lg mx-2'
              >
                Nombre
              </button>
              :
              <button 
              onClick={()=>setInputType('name')}
              className='p-1 bg-red-500 text-white rounded-lg mx-2'
              >
                Numero de Documento
              </button>
            }
        </div>
        <div className='flex flex-col w-[80%] border border-lime-300 my-4 rounded-md overflow-hidden'>
        {
              inputType === 'name'
              ? 
              <input
                id='namesearch'
                className="outline-none focus:outline-none w-full p-2 text-black placeholder-gray-500"
                placeholder='Ingresa el Nombre'
                onChange={(e)=>{
                  setNameSearch(e.target.value)
                }}
              />
              :
              <input
                id='dnisearch'
                type='number'
                className="outline-none focus:outline-none w-full p-2 text-black placeholder-gray-500"
                placeholder='Ingresa el DNI'
                onChange={(e)=>{
                  setDniSearch(e.target.value)
                }}
              />
            }
          <button 
            className='bg-lime-500 text-white font-semibold py-2 hover:bg-lime-600 transition-all'
            onClick={()=>{
              if(inputType == 'name'){
                handleSearchName()
              }
              else{
                handleSearch()
              }
            }}
          >
            Buscar 🔍
          </button>
        </div>

        <div className='flex flex-col items-center mt-4 w-full'>
          {shownAccepteds && shownAccepteds.length > 0 ? (
            shownAccepteds.map((accepted) => (
              <UserCard key={accepted.id} application={accepted}  setShownAccepted={setShownAccepted} shownAccepteds={shownAccepteds}/>
            ))
          ) : (
            <p></p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;
