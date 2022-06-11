import React, { useState } from 'react'
import { auth } from '../Config/Config'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function ForgotPswd() {

    const history = useNavigate();

    const [email, setEmail] = useState("")

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const emailInputHandler = async () => {
        if (!email) return
        try {
            const reset = await sendPasswordResetEmail(auth, email)
            //console.log(reset)
            setSuccessMsg('Check your mail for further instructions.');
            setErrorMsg('');
            setTimeout(() => {
                setSuccessMsg('');
                history('/login');
            }, 3000)
        }
        catch (error) {
            setErrorMsg('Invalid mail. Try again.');
        }

    }

    return (
        <div>
            {successMsg && <>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
            <h1>Forgot Password?</h1>
            <input type="email" className='forgotPwdEmail' onChange={(e) => setEmail(e.target.value)} />
            <button onClick={emailInputHandler}>Send reset link</button>
            {errorMsg && <>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>
            </>}
        </div>
    )
}