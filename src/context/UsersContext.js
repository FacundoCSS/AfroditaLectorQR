import { useState, createContext, useContext} from "react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    setDoc,
    startAfter,
  } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";


const context = createContext()

export const useUsers = ()=>{
    const newContext = useContext(context);
    if (!newContext) throw new Error("There is no Users provider");
    return newContext;
};

  
const UsersProvider = ({children})=>{

    const [requests, setRequests] = useState([])
    const [accepteds, setAccepteds] = useState([])
    const [rejecteds, setRejecteds] = useState([])

    const searchByName = async (partialName) => {
        try {
            const documents = [];
            const q = query(collection(db, "applications"), where('name', '>=', partialName), where('name', '<=', partialName + '\uf8ff'));
            const data = await getDocs(q);
            data.forEach((doc) => {
              const documentData = doc.data();
              documentData.id = doc.id;
              documents.push(documentData);
            });

            await documents.sort((a, b) => {
                if (a.accepted === b.accepted) {
                  return 0;
                } else if (a.accepted) {
                  return 1;
                } else {
                  return -1;
                }
              });

            const qRejecteds = query(collection(db, "rejectedsInfo"), where('name', '>=', partialName), where('name', '<=', partialName + '\uf8ff'));
            const dataRejecteds = await getDocs(qRejecteds);
            dataRejecteds.forEach((doc) => {
              const documentData = doc.data();
              documentData.id = doc.id;
              documentData.rejected = true;
              documents.push(documentData);
            });

            return documents;
        } catch (error) {
          console.error(error);
        }
      };

      const searchRejected = async (dni) =>{

        try {
            const documents = []
            const q = query(collection(db, "rejecteds"), where("dni", "==", dni))
            const data = await getDocs(q)
            data.forEach((doc) => {
                const documentData = doc.data()
                documentData.id = doc.id
                documents.push(documentData)
              })
            return documents
        } catch (error) {
            console.log(error)
        }};

    const searchQr = async (dni) =>{

        try {
            const documents = []
            const q = query(collection(db, "applications"), where("dni", "==", dni))
            const data = await getDocs(q)
            data.forEach((doc) => {
                const documentData = doc.data()
                documentData.id = doc.id
                documents.push(documentData)
              })
            return documents
        } catch (error) {
            console.log(error)
        }};

    const getAccepted = async  (id) => {
       try {
        const data = await getDoc(doc(db, "applications", id))
        return data
       } catch (error) {
         console.log(error)
       }
    };

    const getRequests =  async () => {
        try {
            const documents = []
            const q = query(collection(db, "applications"), where("accepted", "==", false), orderBy("created_at", "desc"), limit(20))
            const data = await getDocs(q)
            data.forEach((doc) => {
                const documentData = doc.data()
                documentData.id = doc.id
                documents.push(documentData)
              })
            setRequests(documents)
        } catch (error) {
            console.log(error)
        }};

    const loadNextRequests = async () => {

        const lastVisibleSnap = await getDoc(doc(db, "applications", requests[ requests.length - 1 ].id))

        try {
            const documents = []
            const q = query(collection(db, "applications"), where("accepted", "==", false), orderBy("created_at", "desc"), startAfter( lastVisibleSnap ), limit(20))
            const data = await getDocs(q)
            data.forEach((doc) => {
                const documentData = doc.data()
                documentData.id = doc.id
                documents.push(documentData)
              })     
            setRequests((request) => [...request, ...documents])
        } catch (error) {
            console.log(error)
        }
    };
    

        const getAccepteds =  async () => {
            try {
                const documents = []
                const q = query(collection(db, "applications"), where("accepted", "==", true))
                const data = await getDocs(q)
                data.forEach((doc) => {
                    const documentData = doc.data()
                    documentData.id = doc.id
                    documents.push(documentData)
                  })
                console.log(documents.length)
                setAccepteds(documents)
            } catch (error) {
                console.log(error)
            }};

        const addRequest = async ({name, imageFile, number, dni}) => {
        try {
            const docRef = await addDoc(collection(db, "applications"), { name, number, dni, created_at: new Date(), imageURL: null, accepted: false, sent: false });      

            if(imageFile) {
                const storageRef = ref(storage, docRef.id);
                await uploadBytes(storageRef, imageFile);
                const imageURL = await getDownloadURL(storageRef);
                await updateDoc(docRef, { "imageURL": imageURL });
            }

            return true;
           
            
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const acceptRequest = async (id) => {
        await updateDoc(doc(db, "applications", id), {accepted: true});
        setRequests(requests.filter((user)=> user.id !== id));
    }

    const deleteRequest = async (name, imageURL, number, dni, id, image, accepted) => {
        try {
            await deleteDoc(doc(db, "applications", id))
            if(accepted){
                setAccepteds(accepteds.filter((user)=> user.id !== id));
                if(image){
                    const storageRef = ref(storage, id)
                    await deleteObject(storageRef)
                }
            }else{
                if(imageURL){
                    await setDoc(doc(db, "rejectedsInfo", id), { name, number, dni, imageURL });  
                }
                else{
                    await setDoc(doc(db, "rejectedsInfo", id), { name, number, dni });  
                }
                await setDoc(doc(db, "rejecteds", id), {dni});      
                setRequests(requests.filter((user)=> user.id !== id));
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getRejectedsInfo = async () => {
        try {
            const documents = []
            const q = query(collection(db, "rejectedsInfo"))
            const data = await getDocs(q)
            data.forEach((doc) => {
                const documentData = doc.data()
                documentData.id = doc.id
                documents.push(documentData)
              })
            setRejecteds(documents)
        } catch (error) {
            console.log(error)
        }};
        
    const undoReject = async (name, number, imageURL, id, dni) => {
        try {
            await deleteDoc(doc(db, "rejectedsInfo", id))
            await deleteDoc(doc(db, "rejecteds", id))
            await setDoc(doc(db, "applications", id), {  name, number, dni, created_at: new Date(), imageURL, accepted: true, sent: false });  
            setRejecteds(rejecteds.filter((rejected)=> rejected.id !== id));
            
        } catch (error) {
            console.log(error)
        }
    }

    const deleteRejected = async (id) => {
        try {
            await deleteDoc(doc(db, "rejectedsInfo", id))
            await deleteDoc(doc(db, "rejecteds", id))
            setRejecteds(rejecteds.filter((rejected)=> rejected.id !== id));
        } catch (error) {
            console.log(error)
        }
    }

    const checkRequest = async (id) => {
        await updateDoc(doc(db, "applications", id), {sent: true});
        setRequests(requests.filter((user)=> user.id !== id));
    }

    const unCheckRequest = async (id) => {
        await updateDoc(doc(db, "applications", id), {sent: false});
        setRequests(requests.filter((user)=> user.id !== id));
    }

    return (
        <context.Provider value={{
          accepteds,
          requests,
          getAccepted,
          getRequests,
          loadNextRequests,
          getAccepteds,
          addRequest,
          acceptRequest,
          deleteRequest,
          getRejectedsInfo,
          rejecteds,
          undoReject,
          deleteRejected,
          checkRequest,
          unCheckRequest,
          searchQr,
          searchByName,
          searchRejected
        }}>
            {children}
        </context.Provider>
    );

}

export default UsersProvider