import React from "react";
import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {

  return(
    <footer>
      <ul>
        <li className="admin">관리자 페이지</li>
        <li className="create">
          <Link to='/createpost'>글쓰기</Link>
        </li>
      </ul>
    </footer>
  )
}

export default Footer;