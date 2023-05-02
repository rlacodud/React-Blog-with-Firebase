import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../fbase";
import './Header.css'

const Header = ({userObj}) => {
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  }
  
  return (
    <ul className="header">
      <li style={{flex: 0.8, textAlign: 'center'}}>
        <Link to='/'>{userObj.displayName}님의 Home</Link>
      </li>
      <li style={{flex: 0.2, textAlign: 'right'}}><button onClick={onLogout}>Logout</button></li>
    </ul>
  )
}

export default Header;