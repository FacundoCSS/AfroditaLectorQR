import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AuthProvider from "./context/AuthContext";
import UsersProvider from "./context/UsersContext";
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Signin from './pages/Signin';
import AddUserForm from './pages/AddUserForm';
import User from './pages/User';

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
            path="/add"
            element={<AddUserForm/>}
            />
            <Route
            path='/:id'
            element={<User/>}
            />
          </Routes>
          <Toaster/>
        </UsersProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
