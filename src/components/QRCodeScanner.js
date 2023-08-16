import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';
import {AiOutlineCamera} from 'react-icons/ai'

function QRCodeScanner() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        if(scanning){
            async function setupCamera() {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                videoRef.current.srcObject = stream;
                return new Promise(resolve => {
                    videoRef.current.onloadedmetadata = () => {
                        resolve(videoRef.current);
                    };
                });
            }
    
            async function scanQRCode() {
                const videoElement = await setupCamera();
                videoElement.play();
    
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
    
                function scan() {
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: 'dontInvert',
                    });
    
                    if (code) {
                        window.location.href = code.data;
                        videoElement.pause();
                        videoElement.srcObject.getTracks().forEach(track => track.stop());
                    } else {
                        requestAnimationFrame(scan); // Continue scanning
                    }
                }
    
                scan();
            }
    
            scanQRCode();
        }

        return () => {
            // Cleanup code, stop camera and tracks if needed
        };
    }, [scanning]);

    const stopScanning = () => {
        setScanning(false);
    };

    return (
        <div className='flex flex-col items-center'>
            <div
            onClick={()=>{setScanning(true)}} 
            className='bg-lime-500 rounded-2xl p-3 inline-block mt-4 font-bold text-3xl text-white shadow-md shadow-black/40 hover:shadow-black/60 transition-all cursor-pointer'>
                <AiOutlineCamera/>
            </div>

            {
            scanning &&
            <div className='flex flex-col items-center'>
                <video ref={videoRef} autoPlay muted playsInline />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <button
                className='bg-white rounded-2xl p-3 inline-block mt-4 font-bold text-3xl text-neutral-900 shadow-md shadow-black/40 hover:shadow-black/60 transition-all cursor-pointer'
                onClick={stopScanning}
                >
                    Dejar de escanear
                </button>
            </div>
            }
        </div>
    );
}

export default QRCodeScanner;
