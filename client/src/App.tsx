import { Outlet } from "react-router-dom"
import Decode from "./pages/Decode/Decode"
import Encode from "./pages/Encode/Encode"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Signup from "./pages/Signup/Signup"

function App() {
  return (
    <>
      <Outlet/>
    </>
  )
}

export default App