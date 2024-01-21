import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AuthProvider from "./context/AuthContext";
import UsersProvider from "./context/UsersContext";
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Signin from './pages/Signin';
import User from './pages/User';
import SendRequest from './pages/SendRequest';
import Success from './pages/Success';
import Solicitudes from './pages/Solicitudes';
import Rejecteds from './pages/Rejecteds';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <UsersProvider>
          <Routes>
           <Route 
            path="/"
            element={
            <PrivateRoute>
              <Home/>
            </PrivateRoute>}
            />
            <Route
            path="/signin"
            element={<Signin/>}
            />
            <Route
            path='/:id'
            element={
            <PrivateRoute>
              <User/>
            </PrivateRoute>}
            />
            <Route
            path='/enviar-solicitud'
            element={
              <SendRequest/>}
            />
            <Route
            path='/request-success'
            element={
              <Success/>}
            />
            <Route
            path='/solicitudes'
            element={
            <PrivateRoute>
              <Solicitudes/>
            </PrivateRoute>}
            />
            <Route
            path='/rechazados'
            element={
            <PrivateRoute>
              <Rejecteds/>
            </PrivateRoute>}
            />
          </Routes>
          <Toaster/>
        </UsersProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
