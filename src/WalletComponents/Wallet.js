import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './wallet.css'
import { auth, fs } from '../Config/Config'
import { Icon } from 'react-icons-kit'
import { creditCard } from 'react-icons-kit/icomoon/creditCard'
import { ic_account_balance_outline } from 'react-icons-kit/md/ic_account_balance_outline'
import { ic_account_balance_wallet_outline } from 'react-icons-kit/md/ic_account_balance_wallet_outline'
import { arrowRight } from 'react-icons-kit/fa/arrowRight'
import DisplayDetails from './DisplayDetails';
import { MNavbar } from '../MainComponents/MNavbar';

export const Wallet = () => {

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

    const [userDoc, setUserDoc] = useState(null)
    auth.onAuthStateChanged(user => {
        fs.collection(`users`).doc(`${user?.uid}`).get().then((doc) => {
            setUserDoc(doc)
        })
    })
    return (
        <>
            <MNavbar user={user} />
            <div className='walletDiv'>
                <div className='cardAmountDiv'><h2> Your wallet balance is <span style={{ fontFamily: 'Arial' }}>&#8377;</span>
                    {userDoc?.data().balance}</h2></div>
                <div>
                    <div className='btn btn-success btn-md addMoney' style={{ display: 'flex', width: '20vw', margin: '5px 10px', justifyContent: 'space-around' }}>
                        <Icon icon={creditCard} flex={1} size={20} />
                        <Link to="/add-card" className='link' style={{ 'color': 'white' }}>Add card</Link>
                        <Icon icon={arrowRight} size={20} />
                    </div>
                    <div className='btn btn-success btn-md addMoney' style={{ display: 'flex', width: '20vw', margin: '5px 10px', justifyContent: 'space-around' }}>
                        <Icon icon={ic_account_balance_outline} size={20} />
                        <Link to="/add-ba" className='link' style={{ 'color': 'white' }}>Add bank account</Link>
                        <Icon icon={arrowRight} size={20} />
                    </div>
                    <div className='btn btn-success btn-md addMoney' style={{ display: 'flex', width: '20vw', margin: '5px 10px', justifyContent: 'space-around' }}>
                        <Icon icon={ic_account_balance_wallet_outline} size={20} />
                        <Link to="/addmoney" className='link' style={{ 'color': 'white' }}>Add money to wallet</Link>
                        <Icon icon={arrowRight} size={20} />
                    </div>
                </div>
            </div>
            <div>
                <DisplayDetails type />
                <DisplayDetails />
            </div>
        </>
    )
}