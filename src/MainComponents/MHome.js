import React, { useState, useEffect } from 'react'
import { auth, fs } from '../Config/Config'
import { Link, useNavigate } from 'react-router-dom'
import { MNavbar } from './MNavbar'
import './Mhome.css'

export const MHome = () => {
    // getting current user 
    const history = useNavigate()
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
    return (
        <div className='Home'>
            <MNavbar user={user} />
            <br></br>
            <div>
                <h1><center><b>Welcome To Pay Karo!</b></center></h1>

                <center><h5>India's Most-loved Payment App</h5></center>
                <br /><br />
                <center><h2><b>Our Mission</b></h2></center>
                <br />
                <h1><center>We will bring</center></h1>
                <h1><center>Half-a-Billion Indians</center></h1>
                <h1><center>to the Mainstream Economy.</center></h1>
                <br /><br />
                <div className='head'>Pay Karo! started the Digital Revolution in India.

                    And we went on to become India’s leading Payments App. Today, more than 20 Million merchants and businesses are powered by Pay Karo! to Accept Payments digitally.

                    This is because more than 300 million Indians use Pay Karo! to Pay at their stores. And that’s not all, Pay Karo! App is used to Pay bills, do Recharges, Send money to friends and family, Book movies amd travel tickets.

                    With innovations to Financial services and product</div>
                <br /><br />
                <center><h2>Our Services</h2></center>
                <br />
                <div className='Container'>
                    <div className='head'><h4><center><Link className='heading' to="/wallet">Wallet!</Link></center></h4>Pay Karo! wallet is a secure and RBI-approved digital/mobile wallet that you can use for multiple purposes. It is like digital cash that you can utilize for any kind of consumer payment. You can add money to the Pay Karo! wallet through UPI, internet banking, or credit/debit cards. Also, you can send money from a Pay Karo! wallet to a bank account or another person’s Pay Karo! wallet.Access your Wallet</div>

                    <div className='head'><h4><center><Link className='heading' to="home">Cart!</Link></center></h4>For shoppers, the shopping cart is where to place and review products before paying. Customers can manage all of the things they want to buy beforehand; make specific changes in quantity, sizes, colors; carry out checkout process, and reconsider whether those things worth buying or not within their budget. Check your Cart</div>

                    <div className='head'><h4><center><Link className='heading' to="/Book-Bus">Bus Tickets!</Link></center></h4>India's largest company for bus ticket booking in India, we offers an easy-to-use online platform, thousands of bus operators to choose from, and plenty of offers on bus booking to make road journeys super-convenient for travelers. A leading platform to book bus tickets, we have driven the country’s bus booking journey over the past 15+ years through thousands of bus operators and routes. Striving to reach new heights when it comes to online bus booking in India Book tickets Now!</div>

                    <div className='head'><h4><center><Link className='heading' to="/Pay-Bills">Pay Bills!</Link></center></h4>Your electricity bill payment gets easier with Freecharge!. Trusted by over 27 million users, Freecharge is your one-stop shop for online recharges and bill payments! There are many online bill payment facilities provided by Freecharge. Some of these include, scheduling payments on time, save the customer information for transaction in the future, and other different paying alternatives. Pay your Bills</div>
                </div>
            </div>
        </div>
    )
}
