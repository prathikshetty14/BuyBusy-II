import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/signIn&Up.module.css";

import { useDispatch } from "react-redux";
import { createUserThunk } from "../Redux/Reducers/authReducer";

// SignUp component
export function SignUp(){

    const dispatch = useDispatch()

    // Refs for name, email, and password input fields
    const nameRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();

    // Access the navigation function
    const navigate=useNavigate();


    // Handle the form submission
    function handleSubmit(e){
        e.preventDefault();

        const data={
            name:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value
        }

        // Access the createUser thunk from the auth reducer
        dispatch(createUserThunk(data))

        // Navigate to the sign-in page after registration
        navigate("/signin");
    }
    
    return(
        <>
            {/* Sign Up Container  */}
            <div className={styles.container}>
                <div className={styles.inputForm}>

                    {/* Heading */}
                    <h1>Sign Up Page</h1>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Name */}
                        <input type="text" 
                            placeholder="Enter Name" 
                            required
                            ref={nameRef} />

                        {/* Email */}
                        <input type="email" 
                            placeholder="Enter Email"
                            required 
                            ref={emailRef}/>

                        {/* Password */}
                        <input type="password" 
                            placeholder="Enter Password"
                            required
                            ref={passwordRef} />
                        {/* Submit Button */}
                        <button className={styles.theButton} role="button">Sign Up</button>
                    </form>
                    <br />
                    <span>Already Have an Account? &nbsp;</span>

                    {/* Sign In Link */}
                    <NavLink to="/signin">
                    Sign In
                    </NavLink>
                </div>
            </div>
        </>
    );
}