import { useState, createContext, useContext } from "react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    query,
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

    const [users, setUsers] = useState([])

    const getUser = (id) => {
       try {
        const data = getDoc(doc(db, "users", id))
        return data
       } catch (error) {
         console.log(error)
       }
    };

    const getUsers = async () => {
    try {
        const documents = []
        const q = query(collection(db, "users"))
        const data = await getDocs(q)
        await data.forEach((doc) => {
            const documentData = doc.data()
            documentData.id = doc.id
            documents.push(documentData)
          })
        setUsers(documents)
    } catch (error) {
        console.log(error)
    }};

    const addUser = async ({name, surname, imageFile, dni}) => {
        try {
            const docRef = await addDoc(collection(db, "users"), { name, dni, created_at: new Date(), imageURL: null });            
            if(imageFile){
                const storageRef = ref(storage, docRef.id)
                await uploadBytes(storageRef, imageFile)
                const imageURL = await getDownloadURL(storageRef)
                await updateDoc(docRef, {"imageURL": imageURL});
                // setProducts(products.map((product) => product.id === id ? documentData : product));
                
            }
            getDoc(doc(db, "users", docRef.id)).then((doc)=>{
                const documentData =  doc.data()
                documentData.id = docRef.id
                setUsers([...users, documentData])
            });
            return true;
           
            
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const deleteUser = async (id) => {
        try {
            await deleteDoc(doc(db, "users", id))
            const storageRef = ref(storage, id)
            setUsers(users.filter((user)=> user.id !== id));
            await deleteObject(storageRef)
        } catch (error) {
            console.log(error)
        }
    }
    

    const updateUser = async ({name, surname, imageFile, dni}, id) => {
        let imageURL;
        if(imageFile){
            const storageRef = ref(storage, id)
            await uploadBytes(storageRef, imageFile)
            imageURL = await getDownloadURL(storageRef)
            await updateDoc(doc(db, "users", id), {name, surname, imageURL, dni});
        } 
        else {
            await updateDoc(doc(db, "users", id), {name, surname, imageURL, dni});
        }
        getDoc(doc(db, "users", id)).then((doc)=>{
            const documentData =  doc.data()
            documentData.id = id
            setUsers(users.map((user) => user.id === id ? documentData : user));
        });
    }

    return (
        <context.Provider value={{
            users,
            getUser,
            getUsers,
            addUser,
            deleteUser,
            updateUser,
        }}>
            {children}
        </context.Provider>
    );

}

export default UsersProvider