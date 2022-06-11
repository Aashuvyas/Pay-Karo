import React, { useState, useEffect } from 'react'
import { auth, fs } from '../Config/Config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MNavbar } from '../MainComponents/MNavbar'

export const AddBA = () => {

    const history = useNavigate();

    function GetUserUid() {
        const [uid, setUid] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    setUid(user.uid);
                }
            })
        }, [])
        return uid;
    }

    const uid = GetUserUid();

    // getting current user function
    function GetCurrentUser() {
        const [user, setUser] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    fs.collection('users').doc(user.uid).get().then(snapshot => {
                        setUser(snapshot.data().FullName);
                    })
                }
                else {
                    setUser(null);
                }
            })
        }, [])
        return user;
    }

    const user = GetCurrentUser();

    const [acountNumber, setacountNumber] = useState('');
    const [nameofAccount, setnameofAccount] = useState('');
    const [ifscCode, setifscCode] = useState('');
    const [namount, setAmount] = useState(0);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleAddBankAccount = (e) => {
        e.preventDefault();
        const user = auth.currentUser
        if (!user) return
        fs.collection(`${user.uid}-bankaccount`).get().then((collection) => {
            const arr = [...collection.docs]
            if (arr.some(doc => doc.data().AcountNumber === acountNumber)) {
                toast.error("Bank account already linked")
                setErrorMsg("Try again.")
            }
            else {
                fs.collection(`${user.uid}-bankaccount`).doc(`${acountNumber}`).set({
                    AcountNumber: acountNumber,
                    NameofAccountHolder: nameofAccount,
                    IFSC: ifscCode,
                    Amount: namount
                }).then(() => {
                    toast.success("Added Successfully")
                    setSuccessMsg('You will now automatically get redirected to Wallet');
                    setacountNumber('');
                    setnameofAccount('');
                    setifscCode('');
                    setAmount(0);
                    setErrorMsg('');
                    setTimeout(() => {
                        setSuccessMsg('');
                        setErrorMsg('');
                        history('/wallet');
                    }, 3000)
                }).catch(e => {
                    toast.error(e.message)
                    setErrorMsg(e.message)
                })
            }
        }).catch(e => {
            toast.error(e.message)
            setErrorMsg(e.message)
        })
    }

    return (
        <>
            <MNavbar user={user} />
            <div className='container'>
                <br></br>
                <br></br>
                <h1>Add bank account</h1>
                <hr></hr>
                {successMsg && <>
                    <div className='success-msg'>{successMsg}</div>
                    <br></br>
                </>}
                <form className='form-group' autoComplete="off" onSubmit={handleAddBankAccount}>
                    <label>Enter initial balance</label>
                    <input type="number" className='form-control' required
                        onChange={(e) => setAmount(e.target.value)} value={namount}></input>
                    <br></br>
                    <label>Account Number</label>
                    <input type="text" className='form-control' required
                        onChange={(e) => setacountNumber(e.target.value)} value={acountNumber}></input>
                    <br></br>
                    <label>Name of the Account Holder</label>
                    <input type="text" className='form-control' required
                        onChange={(e) => setnameofAccount(e.target.value)} value={nameofAccount}></input>
                    <br></br>
                    <label>IFSC Code</label>
                    <input type="number" className='form-control' required
                        onChange={(e) => setifscCode(e.target.value)} value={ifscCode}></input>
                    <br></br>
                    <div className='btn-box'>
                        <button type="submit" className='btn btn-success btn-md'>Add Bank Account</button>
                    </div>
                </form>
                {errorMsg && <>
                    <br></br>
                    <div className='error-msg'>{errorMsg}</div>
                </>}
            </div>
        </>
    )
}
