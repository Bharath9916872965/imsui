import { useState } from "react";
import "./Login.css"
import { login } from "../../services/auth.service";
import withRouter from "../../common/with-router";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';

const Login=(props)=>{
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


    const handleLoginSubmit = async (values)  =>{
        setMessage("");
        setLoading(true);
        const username = values.username;
        const password = values.password;
        console.log('Username:', username);
        console.log('Password:', password);
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
              console.log('sdfsdfsdfsf----')
              console.log('error.response----', error.response)
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

    return(<div>

<div className="container-login" id="container-login">
    

            <div className="form-container sign-in">
                
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLoginSubmit}
                >
                    {({ errors, touched, handleChange }) => (
                        <Form className="login">
                            <div className="form-group">
                                <Field
                                    name="username"
                                    type="text"
                                    onChange={handleChange}
                                    className={
                                        "form-control" +
                                        (errors.username && touched.username
                                            ? " is-invalid"
                                            : "")
                                    }
                                    placeholder="Username"
                                />
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            <div className="form-group">
                                <Field
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    className={
                                        "form-control" +
                                        (errors.password && touched.password
                                            ? " is-invalid"
                                            : "")
                                    }
                                    placeholder="Password"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="d-flex justify-content-center">
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

                        </Form>
                    )}
                </Formik>
                    {/* {message && (
                      <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                          {message}
                        </div>
                      </div>
                    )} */}
            </div>
        <div className="toggle-container">
            <div className="toggle">
                <div className="toggle-panel toggle-left">
                    <h1>Welcome Back!</h1>
                    <p>Enter your personal details to use all of site features</p>
                    <button className="hidden" id="login">Sign In</button>
                </div>
                <div className="toggle-panel toggle-right">
                    <h1>ISO Monitoring <br /> System</h1>
                    <p>Register with your personal details</p>
                
                </div>
            </div>
        </div>
    </div>
    
    </div>)
}
export default withRouter(Login);