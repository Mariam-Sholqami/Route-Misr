

import { Outlet , ScrollRestoration  } from 'react-router-dom'
import Navbar from '../Components/Navbar/Navbar'

function Layout() {
  return (
    <>
    <ScrollRestoration />
    <div >
      <Navbar/>
      <main >
        <Outlet />
      </main>
      
    </div>
  
    </>
    
)}

export default Layout
