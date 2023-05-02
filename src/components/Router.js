import React, { useEffect, useState } from 'react'
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from '../routes/Home';
import Auth from '../routes/Auth';
import Posts from '../routes/Posts';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../fbase';
import Header from './Header';
import Footer from './Footer';
import PostFactory from './PostFactory';

const AppRouter = ({isLoggedIn, userObj}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postData = query(
    collection(database, "posts"),
    orderBy("createdAt", "desc")
    );
    onSnapshot(postData, (snapshot) => {
    const postArray = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
    }));
    setPosts(postArray);
    });
    }, []);

  return (
    <Router>
      {isLoggedIn && <Header userObj = {userObj}/>}
      <Routes>
        {isLoggedIn ?
        <>
          <Route exact path = "/" element={<Home userObj={userObj}/>}></Route>
          <Route exact path ='/posts/:post_id' element={<Posts posts={posts} userObj={userObj}/>} />
          <Route exact path ='/createpost' element={<PostFactory userObj={userObj}/>} />
        </>
          :
          <Route exact path="/" element={<Auth />}></Route>
      }
      </Routes>
      {isLoggedIn && <Footer userObj = {userObj}/>}
    </Router>
  )
}

export default AppRouter;