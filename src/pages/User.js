import { useEffect, useState, useRef } from 'react';
import { useParams,  Link } from 'react-router-dom';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';


import { useUsers } from '../context/UsersContext';

import { AiOutlineUser, AiOutlineDownload, AiOutlineLoading3Quarters} from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import { FaWhatsapp } from "react-icons/fa";

const User = () => {

  const [imageURL, setImageURL] = useState('')
  const [userData, setUserData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef(null);

    const {id} = useParams()
    const {getAccepted} = useUsers(id)

    const callData = async()=>{
      const data = await getAccepted(id)
      const documentData = data.data()
      setUserData(documentData)
    }

    const generateImage = () => {
      if (containerRef.current) {
        html2canvas(containerRef.current).then((canvas) => {
          canvas.toBlob((blob) => {
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${userData.name}.png`;
    
            // Simular un clic en el enlace para iniciar la descarga
            a.click();
    
            // Liberar el objeto URL creado después de un tiempo
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 100);
          }, 'image/png');
        });
      }
    };
    
    

    useEffect(()=>{
      callData()
         
      setTimeout(() => {
        setIsLoading(false)
      }, 1500);

      QRCode.toDataURL(id)
      .then(url => {
        setImageURL(url)
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
      userData
       ?
        <div className='flex flex-col items-center p-4 text-xl font-semibold'>
          <div className='p-2 bg-white text-center'>
            {
              userData?.imageURL 
              ? <img className='object-cover w-full max-w-[250px] h-[250px]' src={ userData.imageURL } alt={ userData.name }/> 
              : <div className='w-full h-[250px] flex bg-white'><AiOutlineUser className='h-[200px] w-[200px] text-neutral-900 m-auto'/></div>
            }
            <div className='my-1'>{userData.name}</div>
            <div className='my-1'>📱{userData.number}</div> 
            <div className='my-1'>🆔{userData.dni}</div> 
            </div>
                
          <div className='flex items-center justify-around'>
            <button 
            onClick={generateImage} 
            className='bg-lime-500 text-white p-4 text-3xl rounded-2xl mx-8'>
              <AiOutlineDownload/>
            </button>
            <a
            href={`https://api.whatsapp.com/send?phone=54${userData.number}`}
            className='bg-lime-500 text-white my-4 p-4 text-3xl rounded-2xl mx-8'
            >
              <FaWhatsapp/>
            </a>
          </div>
            <div className="flex flex-col items-center my-4 p-4 text-xl font-bold bg-white" ref={containerRef}>
              <div className='my-3'>{userData.name}</div>
              {
                imageURL &&
                <img src={imageURL}/>
              }
          </div>   
        </div>  
        :
        <div className='w-full flex items-center justify-center'>
          <div className='font-bold text-2xl bg-white my-8 rounded-2xl p-6 shadow-lg shadow-black/40'>
          {
          isLoading
          ? <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto'/>
          : 'Persona no encontrada'
          }
          </div>
        </div>
        }
      </div>
  )
}

export default User