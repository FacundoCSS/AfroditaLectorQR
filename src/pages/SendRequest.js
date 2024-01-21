import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useUsers } from '../context/UsersContext';

import { AiOutlineDownload,  AiOutlineUserAdd, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { VscError } from 'react-icons/vsc'

import image from './cataleya2.jpeg'


const SendRequest = () => {
    
  const [value, setValue] = useState( 
    {
      name: null, 
      imageFile: null,
      number: null,
      dni: null
  })
  const [state, setState] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [openInfo,setIsOpenInfo] = useState(true)
  const [dniSearch, setDniSearch] = useState()
  const [imageURL, setImageURL] = useState('')
  const [userData, setUserData] = useState()
  
  const containerRef = useRef(null);

  const {addRequest, checkRequest, searchQr, searchRejected} = useUsers()

  const navigate = useNavigate()

  const readFile = (file)=>{
    const reader = new FileReader()
    reader.readAsDataURL(file)
    return reader.addEventListener("load", e=>{
        let newImg = `<img src='${e.currentTarget.result}' class='object-cover h-32 w-32 rounded-full' alt="avatar"></img>`
        document.querySelector(".resultado").innerHTML=newImg
  })
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
  

  function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            let newWidth = img.width;
            let newHeight = img.height;

            if (img.width > maxWidth) {
                newWidth = maxWidth;
                newHeight = (img.height * maxWidth) / img.width;
            }
            if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = (img.width * maxHeight) / img.height;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            canvas.toBlob((blob) => {
              callback(blob); // Devuelve el archivo blob resultante
            }, "image/jpeg");
        };
    };
    reader.readAsDataURL(file);
}

  const handleSearch = async ()=>{
    const res = await searchQr(dniSearch)
    if( res.length > 0){
      if (res[0].accepted === true){
      setUserData(res[0])
      QRCode.toDataURL(res[0].id)
      .then(url => {
        setImageURL(url)
      })
      .catch(err => {
        console.error(err)
      })
      }
      else{
        setImageURL(null)
        toast(t=>(
          <div className='flex text-white'>
              <div className='w-[80%]'>
                  <div className='font-semibold text-[15px] text-white text-xl'>Tu solicitud aun no ha sido aceptada ⏳</div>
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
            <div className='w-[20%] h-full flex items-center'>
                <VscError className='text-white w-8 h-8'/>
            </div>
            <div className='w-[80%]'>
                <div className='font-semibold text-[15px] text-white text-xl'>Todavia no completaste el formulario</div>
            </div>
        </div>
    ), {
        style:{
            background: "#550000",
        }
    })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.imageFile) {
      toast(t=>(
        <div className='flex text-white'>
            <div className='w-[20%] h-full flex items-center'>
                <VscError className='text-white w-8 h-8'/>
            </div>
            <div className='w-[80%]'>
                <div className='font-semibold text-[15px] text-white text-xl'>Debes agregar una imagen de ti</div>
            </div>
        </div>
    ), {
        style:{
            background: "#990000",
        }
    })
    } else {
      try {
        setIsLoading(true);
  
        const existingRequest = await searchQr(value.dni);
  
        const isRejected = await searchRejected(value.dni);
  
        if ( existingRequest.length > 0 ) {
          toast.error('Ya has completado el formulario, espera a que tu solicitud sea aceptada');
          setIsLoading(false);

        } 
        else if ( isRejected.length > 0 ) {
          toast.error('Ya has completado el formulario, espera a que tu solicitud sea aceptada');
          setIsLoading(false);
        } 
        else {
          
          resizeImage(value.imageFile, 640, 640, async (resizedBlob) => {
            const res = await addRequest({
              name: value.name,
              number: value.number,
              dni: value.dni,
              imageFile: resizedBlob,
            });
  
            if (res) {
              navigate('/request-success');
            }
          });
        }
      } catch (error) {
        setIsLoading(false);
        toast.error('Error');
        console.log(error);
        // Manejo de errores
      }
    }
  };
  
  return (
  <div className='w-full min-h-[100vh] transition-all'>
    <div 
      className={
        openInfo 
        ?'bg-lime-500 min-h-[100vh] w-full transition-all py-8 '
        :'bg-lime-500 absolute min-h-[100vh] w-[0px] z-20 transition-all'
      }
      >
      <div
      className={
        openInfo 
        ?'bg-white min-h-[100vh] w-[90vw] text-3xl m-auto rounded-xl py-6 px-6 transition-all'
        :'hidden transition-all delay-150'
      }>
        <div className={
          openInfo
          ?'delay-150'
          :''
        }>
    <div className='text-3xl font-extrabold text-center py-8'>
  Únete al Sistema de Acceso de Cataleya
</div>
<img 
  src={image} 
  className="w-32 m-auto"
  alt="Logo de Cataleya"
/>

<div className='mx-auto text-xl flex flex-col items-center py-8'>
  <p className='my-4 text-center'>
    ¡Bienvenido a Cataleya! Estamos emocionados de ofrecerte una experiencia de acceso más rápido y seguro a nuestro establecimiento.
  </p>

  <div className='my-6 w-full font-bold text-center'>
    ¿Ya completaste el formulario? Espera 12 horas e ingresa tu número de documento para obtener el códgio Qr:
    <div className='flex flex-col w-full border border-lime-300 my-4 rounded-md overflow-hidden'>
      <input
        id='dnisearch'
        type='number'
        className="outline-none focus:outline-none w-full p-2 text-black placeholder-gray-500"
        placeholder='Ingresa tu DNI'
        onChange={(e)=>{
          setDniSearch(e.target.value)
        }}
      />
      <button 
        className='bg-lime-500 text-white font-semibold py-2 hover:bg-lime-600 transition-all'
        onClick={()=>{
          handleSearch()
        }}
      >
        Buscar 🔍
      </button>
    </div>
    
    {imageURL && (
      <div className='w-full flex flex-col items-center'>
        <div className="flex flex-col items-center my-4 p-4 text-xl font-bold bg-white rounded-md shadow-md" ref={containerRef}>
          <div className='my-3'>{userData.name}</div>
          <img src={imageURL} alt="Foto del usuario"/>
        </div> 
        <button 
          onClick={()=>{
           checkRequest(userData.id)
          generateImage()
          }}
          className='bg-lime-500 text-white p-4 text-3xl rounded-2xl m-auto'
        >
          <AiOutlineDownload/>
        </button>
      </div>
    )}  
  </div>

  <p className='my-4 text-center'>
    En caso contrario completa el formulario a continuación para ser parte de nuestro sistema de acceso mediante códigos QR personalizados. 📱💨
  </p>

  <div className='w-full text-2xl font-bold py-4'>
    Instrucciones:
    <ol className='text-xl'>
      <li className='py-2'>📝 Ingresa tus datos en el formulario.</li>
      <li className='py-2'>📲 Vuelve aquí luego de un tiempo para revisar si tu solicitud ha sido aprobada y obtener tu código QR.</li>
      <li className='py-2'>🎉 Úsalo para acceder rápidamente a Cataleya y disfrutar.</li>
    </ol>
  </div>

  <div className='my-3 w-full text-center'>
    <div>
      Nota: Tu privacidad es importante para nosotros. Tus datos serán tratados con confidencialidad y solo se utilizarán para la gestión del acceso a Cataleya. 🔐
    </div>
  </div>

  <button 
    type='submit' 
    className='mt-6 py-4 px-6 bg-lime-500 hover:bg-lime-600 font-extrabold text-2xl text-white tracking-wider shadow-md rounded-3xl'
    onClick={() => setIsOpenInfo(false)}
  >
    Continuar
  </button>
</div>


        </div>
      </div>
    </div>
    <div 
      className={
        openInfo 
        ?'hidden'
        :'transition-all delay-150 min-h-[100vh] w-full flex bg-lime-300 '
      }>
      <form className='w-full m-auto flex flex-col items-center font-semibold text-lg pb-4' onSubmit={handleSubmit}>
        <h2 className='text-[2.5rem] font-extrabold my-8'>
          Enviar solicitud
        </h2>
        
        <div className='bg-white w-[80vw] my-4 py-6 rounded-xl flex flex-col  items-center'>
          <label className='mt-4 text-2xl font-bold'>🤳 Una imagen de ti</label>
          <label 
          htmlFor="file-1"
          className='p-[15px] bg-neutral-200 rounded-full text-neutral-500 hover:bg-neutral-300 hover:text-neutral-700 cursor-pointer'
          >
          {
              state
              ?<div className='resultado'></div>  
              :<AiOutlineUserAdd className='h-32 w-32'/>
          }
          
          </label> 
          
          <input 
          type="file" 
          name="imageFile" 
          className='absolute invisible'
          id="file-1"
          accept="image/*"
          onChange={e => {
            readFile(e.target.files[0])
            setState(true)
            setValue({...value, imageFile: e.target.files[0]})
          }}
          />
        </div>

        <div className='bg-white py-6 my-4 w-[80vw] rounded-xl flex flex-col  items-center'>
          <label htmlFor="name" className='text-xl font-bold'>Nombre y Apellido</label>
          <input
          id='name'
          required
          className="p-4 shadow-md shadow-black/60 rounded-2xl mt-1 outline-none focus:outline-none w-[85%] focus:w-[90%] transition-all"
          placeholder='Nombre Apellido'
          onChange={(e) => setValue({ ...value, name: e.target.value })}
          />

          <label htmlFor="number" className='mt-4 text-xl font-bold'>Numero de telefono</label>
          <input
          id='number'
          type='number'
          required
          className="p-4 shadow-md shadow-black/60 rounded-2xl mt-1 outline-none focus:outline-none w-[85%] focus:w-[90%] transition-all"
          placeholder='1234567891'
          onChange={(e) => setValue({ ...value, number: e.target.value })}
          />
          
          <label htmlFor="dni" className='mt-4 text-xl font-bold'>Numero de documento</label>
          <input
          id='dni'
          type='number'
          required
          className="p-4 shadow-md shadow-black/60 rounded-2xl mt-1 outline-none focus:outline-none w-[85%] focus:w-[90%] transition-all"
          placeholder='12345678'
          onChange={(e) => setValue({ ...value, dni: e.target.value })}
          />

        </div>
        {
          isLoading
          ?
          <button 
          onClick={(e)=>{
            e.preventDefault()
          }}
          className='mt-6 py-4 px-6 bg-lime-500 hover:bg-lime-600 font-extrabold text-4xl text-white tracking-wider shadow-md shadow-black/60 transition-all rounded-3xl'>
              <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto'/>
          </button>
          :
          <button 
          type='submit' 
          className='mt-6 py-4 px-6 bg-lime-500 hover:bg-lime-600 font-extrabold text-4xl text-white tracking-wider shadow-md shadow-black/60 transition-all rounded-3xl'>
            Enviar
          </button>
        }
      </form>
    </div>
  </div>
)}

export default SendRequest