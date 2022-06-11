import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './Components/Home'
import { Login } from './Components/Login'
import { Signup } from './Components/Signup'
import { NotFound } from './Components/NotFound'
import { AddProducts } from './Components/AddProducts'
import { Cart } from './Components/Cart'
import ForgotPwd from './Components/ForgotPswd'
import { MHome } from './MainComponents/MHome'
import { Wallet } from './WalletComponents/Wallet'
import { Profile } from './Profile/Profile'
import { BookBus } from './BusComponent/BookBus'
import { PayBills } from './PayBills/PayBills'
import { AddCard } from './WalletComponents/AddCard'
import { AddBA } from './WalletComponents/AddBA'
import AddMoneyToWallet from './WalletComponents/AddMoneyToWallet'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MHome />} />
        <Route path="home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-products" element={<AddProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/forgot-password" element={<ForgotPwd />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/addmoney" element={<AddMoneyToWallet />} />
        <Route path="/add-card" element={<AddCard />} />
        <Route path="/add-ba" element={<AddBA />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Book-Bus" element={<BookBus />} />
        <Route path="/Pay-Bills" element={<PayBills />} />
        <Route component={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App