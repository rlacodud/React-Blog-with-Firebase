import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../fbase";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import './Auth.css';

const Auth = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { target: { name, value } } = e;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        data = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      await updateProfile(auth.currentUser, { displayName: name });

    } catch (error) {
      setError(error.code.replace("auth/", ""))
    }
  }

  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (e) => {
    const { target: { name } } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(auth, provider);
    await updateProfile(auth.currentUser, { displayName: name });
  };

  return (
    <div className="auth-container">
      <h1>Firebase 블로그</h1>
      <form onSubmit={onSubmit}>
        {newAccount ? <input onChange={onChange} name="name" type="text" placeholder="Name" required value={name} /> : ''}
        <input onChange={onChange} name="email" type="email" placeholder="Email" required value={email} />
        <input onChange={onChange} name="password" type="password" placeholder="Password" required value={password} />
        <input type="submit" value={newAccount ? "Create Account" : "Login"} />
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "계정이 있으신가요? 로그인하기" : "처음이신가요? 회원가입하기"}
      </span>
      <p className="error">{error}</p>
      <div>
        <div className="social">
          <p>Continue with</p>
          <button className="authBtn" onClick={onSocialClick} name="google">Google <FontAwesomeIcon icon = {faGoogle}/></button>
          <button className="authBtn" onClick={onSocialClick} name="github">Github <FontAwesomeIcon icon = {faGithub}/></button>
        </div>
      </div>
    </div>
  )
}

export default Auth;