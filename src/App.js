// ********* Import necessary libraries and functions *********
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import { Home } from "./Pages/Home";
import { MyOrder } from "./Pages/MyOrder";
import { Cart } from "./Pages/Cart";
import { SignIn } from "./Pages/SignIn";
import { SignUp } from "./Pages/SignUp";
import { Error } from "./Pages/Error";


// ********* Main App component *********
function App() {



  // ********* Defining the routes and page components *********
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home /> },
        { path: "/myorder", element: <MyOrder /> },
        { 
          path: "/cart", 
          element:  <Cart />
        },
        { 
          path: "/signin", 
          element: <SignIn />
        },
        { 
          path: "/signup", 
          element: <SignUp /> 
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />    
    </>
  );
}

export default App;
