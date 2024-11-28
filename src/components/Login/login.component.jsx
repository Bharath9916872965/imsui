import { useState } from "react";
import "./loginstyles.css"
import { login } from "../../services/auth.service";
import withRouter from "../../common/with-router";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';


const Login = (props) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        username: "",
        password: "",
    });

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required("Username is required")
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must not exceed 20 characters"),
        password: Yup.string()
            .required("Password is required")
            .min(3, "Password must be at least 3 characters")
            .max(40, "Password must not exceed 40 characters"),
    });


    const handleLoginSubmit = async (values) => {
        setMessage("");
        setLoading(true);
        const username = values.username;
        const password = values.password;
        await login(username, password).then(
            (response) => {
                if (!response.access_token) {
                    setLoading(false);
                    setMessage("Login failed. Please try again.");
                    // logout("L");
                    // props.router.navigate("/login");
                } else {
                    props.router.navigate("/dashboard");
                }
            },
            (error) => {
                let resMessage;
                if (error.response && error.response.status === 401) {
                    resMessage = "Username or password is incorrect";
                } else {
                    resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                }
                setLoading(false);
                setMessage(resMessage);
            }
        );
    }

    return (
 
              <div className="login-container">
              <header>
              <nav>
             <div className="project-div" >
               
                        {/* <img src="../../../public/loginIcon.png" alt="logo"  className="login-icon" /> */}
                        <h3 className="combined">
  <span className="iso-name">
    <span className="iso-letter-red">I</span>
    <span className="iso-letter-red">S</span>
    <span className="iso-letter-red">O</span>&nbsp;

    <span className="iso-letter-white">M</span>
    <span className="iso-letter-white">O</span>
    <span className="iso-letter-white">N</span>
    <span className="iso-letter-white">I</span>
    <span className="iso-letter-white">T</span>
    <span className="iso-letter-white">O</span>
    <span className="iso-letter-white">R</span>
    <span className="iso-letter-white">I</span>
    <span className="iso-letter-white">N</span>
    <span className="iso-letter-white">G</span>&nbsp;


    <span className="iso-letter-white">S</span>
    <span className="iso-letter-white">Y</span>
    <span className="iso-letter-white">S</span>
    <span className="iso-letter-white">T</span>
    <span className="iso-letter-white">E</span>
    <span className="iso-letter-white">M</span>
  </span>
</h3>
                   
                </div>

            
                {/* <div className="links text-center text-right new-menu">
                    <ul>
              
                    </ul>
                </div> */}



                

             <div className="bg-nav-new"></div>

             </nav>
             </header>
             <div className="d-flex justify-content-center align-items-center vh-100 iso-main-div">

 
             
             
              <div className="box">
             
             
              <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLoginSubmit}
                >
                    {({ errors, touched, handleChange }) => (
                        <Form className="login">

                  <div className="form">
                         <h2>Login</h2>
               
                       <div className="inputBox">
                       <Field 
                        type="text" 
                        name="username" 
                        onChange={handleChange}
                        required="required" 
                        className={
                            "form-control" +
                            (errors.username && touched.username
                                ? " is-invalid"
                                : "")
                        }
                       />
                          <span>Username</span>
                          <i></i>
                       </div>
                       <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="invalid-feedback"
                                />



                      <div className="inputBox">
                      <Field 
                        type="password" 
                        name="password" 
                        required="required" 
                        className={
                            "form-control" +
                            (errors.password && touched.password
                                ? " is-invalid"
                                : "")
                        }
                    />
                            <span>Password</span>
                            <i></i>
                       </div>
                       <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="invalid-feedback"
                                />


                <div className="links">
                    <br></br>
                    {/* <a href="">Forgot password?</a> */}
       
                </div>
                <div className="form-group">
                                <button
                                    className="login-button-customized"
                                    disabled={loading}
                                >
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Login&nbsp;&nbsp;</span>
                                </button>
                                <br />
                                {message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {message}
                                        </div>
                                    </div>
                                )}
                            </div>
              </div>


              </Form>
                    )}
                </Formik>



            </div>
        

       
             </div>
   

     <nav className="navbar fixed-bottom navbar-expand-md justify-content-between bottom-navbar-customized">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target=".dual-nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse dual-nav w-100">
            <ul className="navbar-nav w-100" style={{display: "flex",justifyContent: "space-between", alignItems: "center",}}>
              <li className="nav-item" style={{ flexGrow: 1, textAlign: "center" }} >
                <p style={{ margin: 0 }}>
                  Site best viewed at 1360 x 768 resolution in I.E 11+, Mozilla
                  120+, Google Chrome 120+ &emsp;
                  <span style={{ fontWeight: "bold", color: "white", margin: 0 }}>
                  Design &amp; Developed by Vedant Tech Solutions
                </span>
                </p>
   
              </li>
              <li className="nav-item" style={{ textAlign: "right", whiteSpace: "nowrap" }} >
                
              </li>
            </ul>
          </div>
        </div>
      </nav>


              </div>
   
    )
}
export default withRouter(Login);