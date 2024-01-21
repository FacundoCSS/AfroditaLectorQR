import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'
import { useAuth } from "../context/AuthContext";

import image from './cataleya2.jpeg'

import {VscError} from 'react-icons/vsc'

const Signin = () => {

  const { login, resetPassword } = useAuth();
  const [user, setUser] = useState({
      email: "",
      password: "",
    });

    const navigate = useNavigate();
  
    const handleError= (message)=>{
      toast(t=>(
          <div className='flex text-white'>
              <div className='w-[20%] h-full flex items-center'>
                  <VscError className='text-white w-8 h-8'/>
              </div>
              <div className='w-[80%]'>
                  <div className='font-smibold text-[20px]'>Error</div>
                  <div className='font-smibold text-[15px] text-neutral-300'>{message}</div>
              </div>
          </div>
      ), {
          style:{
              background: "#990000",
          }
      })
  }

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await login(user.email, user.password);
        navigate("/");
      } catch (error) {
        if(error.message == 'Firebase: Error (auth/wrong-password).') handleError('Contraseña incorrecta')
        else if (error.message == 'Firebase: Error (auth/user-not-found).') handleError('Email incorrecto')
        else handleError(error.message);
      }
    };

  
    const handleResetPassword = async (e) => {
      e.preventDefault();
      if (!user.email) return handleError("Escribe un mail para encontrar la contraseña");
      try {
        await resetPassword(user.email);
        handleError('Te hemos enviado un mail. Revisa tu bandeja de entrada')
      } catch (error) {
        handleError(error.message);
      }
    };
  
    return (
      <div className="bg-lime-600 w-full min-h-[100vh] flex flex-col items-center justify-center text-black py-4">
          <form
            onSubmit={handleSubmit}
            className="w-[90%] max-w-[600px]  shadow-lg shadow-black/50 rounded-2xl px-8 py-6 text-xl bg-white flex flex-col items-center"
          >
            <img 
            src={image} 
            className="w-32 "
            />
            <div className="w-full">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-neutral-900 text-2xl font-bold mb-2"
                >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full shadow appearance-none border rounded p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="tuemail@compania.tld"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-neutral-900 text-2xl font-bold mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full shadow appearance-none border rounded p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="*************"
              />
            </div>
    
            <div className="flex items-center justify-between w-full">
              <button className="bg-lime-600 shadow-lg shadow-black/40 hover:shadow-black/60 transition-all my-3 text-neutral-900 font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline" type="submit">
                Inicia sesión
              </button>
              <a
                className="inline-block align-baseline font-bold ml-4 text-blue-500 hover:text-blue-800"
                href="#!"
                onClick={handleResetPassword}
              >
                Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </form>
      </div>
    );
}

export default Signin