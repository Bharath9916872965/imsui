import withRouter from "common/with-router";
import LiceseImg from 'assets/images/licenseExpired.png'
import { Box} from "@mui/material";
import { Helmet } from "react-helmet";
import './licenseExp.css'

const LicenseExp = (props)=>{

    const returnToLogin = () => {
        props.router.navigate('/login')
    }

    return (
        <Box className="mainRow">
           <Helmet>
             <title>License Expired</title>
            </Helmet>
            <div style={{background : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',height : '100vh',display : 'flex',justifyContent : 'center',alignItems : 'center'}}>
               <div class="card-custom">
                <img alt="License Expired" src={LiceseImg}></img>
                <h1>License is Expired..!</h1>
                <p>Hi there, your license period is over.</p>
                <p>Please Contact <strong>Team Vedant Tech Solutions</strong>.</p>
                <button  onClick={returnToLogin} className="back-to-home"  >Return to Login</button>
            </div>

            </div>
        </Box>
    )
}
export default withRouter(LicenseExp);