import React from 'react'

export const ChangePassword = () => {

    return (
        <div>
            {successMsg && <>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
            <h1>Old Password</h1>
            <input type="password" className='oldpwd' onChange={(e) => setEmail(e.target.value)} />
            {errorMsg && <>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>
            </>}
        </div>
    )
}
