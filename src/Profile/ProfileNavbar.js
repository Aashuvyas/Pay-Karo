import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../Images/mlogo.png'
import { Icon } from 'react-icons-kit'
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart'
import { androidBus } from 'react-icons-kit/ionicons/androidBus'
import { androidList } from 'react-icons-kit/ionicons/androidList'
import { androidContact } from 'react-icons-kit/ionicons/androidContact'
import { ic_account_balance_wallet_outline } from 'react-icons-kit/md/ic_account_balance_wallet_outline'
import { auth } from '../Config/Config'
import { useNavigate } from 'react-router-dom'

export const ProfileNavbar = () => {

    const history = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            history('/login');
        })
    }

    return (
        <div className='navbar'>
            <div className='leftside'>
                <div className='logo'>
                    <img src={logo} alt="logo" />
                </div>
            </div>
            <div><h3><Link className='heading' to="/">PAY KARO!</Link></h3></div>
            <div className='rightside'>
                <div> <Link className='navlink' to="/wallet"><Icon className='Icon-clr' icon={ic_account_balance_wallet_outline} size={25} /></Link></div>
                <div className='cart-menu-btn'>
                    <Link className='navlink' to="/home">
                        <Icon className='Icon-clr' icon={shoppingCart} size={25} />
                    </Link>
                </div>
                <div> <Link className='navlink' to="/Book-Bus"><Icon className='Icon-clr' icon={androidBus} size={25} /></Link></div>
                <div> <Link className='navlink' to="/Pay-Bills"><Icon className='Icon-clr' icon={androidList} size={25} /></Link></div>
                <div className='btn btn-danger btn-md'
                    onClick={handleLogout}>LOGOUT</div>

            </div>
        </div>

    )
}