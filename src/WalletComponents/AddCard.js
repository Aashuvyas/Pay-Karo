import React, { useState, useEffect } from 'react'
import { auth, fs } from '../Config/Config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MNavbar } from '../MainComponents/MNavbar'

export const AddCard = () => {

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

    const [cardNumber, setCardNumber] = useState('');
    const [expdate, setExpDate] = useState('');
    const [Cvv, setCvv] = useState('');
    const [amount, setAmount] = useState(0);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleAddCard = (e) => {
        e.preventDefault();
        const user = auth.currentUser
        if (!user) return
        fs.collection(`${user.uid}-card`).get().then((collection) => {
            const arr = [...collection.docs]
            if (arr.some(doc => doc.data().CardNumber === cardNumber)) {
                toast.error("Card already linked")
                setErrorMsg("Try again.")
            }
            else {
                fs.collection(`${user.uid}-card`).doc(`${cardNumber}`).set({
                    CardNumber: cardNumber,
                    ExpiryDate: expdate,
                    CVV: Cvv,
                    Amount: amount
                }).then(() => {
                    toast.success(" Card added Successfully")
                    setSuccessMsg('You will now automatically get redirected to Wallet');
                    setCardNumber('');
                    setExpDate('');
                    setCvv('');
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
                <h1>Add Card</h1>
                <hr></hr>
                {successMsg && <>
                    <div className='success-msg'>{successMsg}</div>
                    <br></br>
                </>}
                <form className='form-group' autoComplete="off" onSubmit={e => handleAddCard(e)}>
                    <label>Enter initial amount</label>
                    <input type="number" className='form-control' required
                        onChange={(e) => setAmount(e.target.value)}></input>
                    <br></br>
                    <label>Card Number</label>
                    <input type="text" className='form-control' required
                        onChange={(e) => setCardNumber(e.target.value)}></input>
                    <br></br>
                    <label>Expiry Date</label>
                    <input type="date" className='form-control' required
                        onChange={(e) => setExpDate(e.target.value)}></input>
                    <br></br>
                    <label>CVV number</label>
                    <input type="password" className='form-control' required
                        onChange={(e) => setCvv(e.target.value)}></input>
                    <br></br>
                    <div className='btn-box'>
                        <button type="submit" className='btn btn-success btn-md' >Add Money</button>
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