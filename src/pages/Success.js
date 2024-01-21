import React from 'react'

const Success = () => {
  return (
    <div className='bg-lime-300 w-full min-h-[100vh] pt-8'>
        <div className='bg-white w-[90vw] m-auto rounded-xl py-6'>
            <div className='bg-lime-500 w-[90%] m-auto rounded-xl text-white text-3xl font-extrabold p-4 text-center'>
            🎉 Solicitud Realizada con exito
            </div>
            <div className='w-[80%] m-auto text-2xl font-semibold pt-4 flex flex-col items-center'>
                <div className='my-3 w-full'>
                    📱 Vuelve dentro de poco al link al que ingresaste para obtener tu codigo QR
                </div>
                <div className='my-3 w-full'>
                    📸 Mantente atento a nuestras redes para conocer la implementación. 
                </div>
                <div className='my-3 w-full'>
                    💃🕺 ¡Gracias y nos vemos en la pista de baile!
                </div>

                <div className='mt-8 w-full'>
                    Ya puedes cerrar esta pestaña si lo deseas!
                </div>
            </div>
        </div>
    </div>
  )
}

export default Success