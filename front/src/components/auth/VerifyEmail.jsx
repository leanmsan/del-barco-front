import axios from 'axios'
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

export function VerifyEmail() {
    const [otp, setOtp]=useState("")
    const navigate=useNavigate()

    const handleOtpSubmit = async(e)=>{
            e.preventDefault()
            if (otp) {
                const res = await axios.post('http://localhost:8000/api/verify-email/', {'otp':otp})
                //const resp = res.data
                if (res.status === 200) {
                    navigate('/login')
                }
                
            }
            
    }
  return (
    <div>
        <div className='form-container'>
            <form action="" style={{width:"30%"}} onSubmit={handleOtpSubmit}>
               <div className='form-group'>
                 <label htmlFor="">Enter your Otp code:</label>
                 <input type="text"
                  className='email-form'  
                  name="otp"
                  value={otp}
                  onChange={(e)=>setOtp(e.target.value)} 
                   />
               </div>
               <button type='submit' className='vbtn'>Send</button>
            </form>
        </div>
    </div>
  )
}
