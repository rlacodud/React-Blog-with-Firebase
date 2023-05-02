import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../fbase";
import moment from "moment/moment";
import './Home.css';

// 글목록, 글 쓰기, 카테고리, 관리자 페이지
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categoryObj, setCategoryObj] = useState('');
  const [selected, setSelected] = useState('all');
  const [filterPost, setFilterPost] = useState([]);

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

      setFilterPost(postArray);
    });

    const categoryData = query(
      collection(database, "category"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(categoryData, (snapshot) => {
      const categoryArray = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setCategoryObj(categoryArray);
    });
  }, []);

  const handleSelect = (e) => {
    setSelected(e.target.value);
    setFilterPost([]);

    for (var i = 0; i < posts.length; i++) {
      if (posts[i].category === e.target.value) {
        let filtered = [];
        filtered.push(posts[i]);
        setFilterPost(filtered);
      }
    }

    if (e.target.value === 'all') {
      setFilterPost([...posts]);
    }
  };

  return (
    <div className="wrap">
      <select name="category" value={selected} onChange={handleSelect}>
        <option value="all">All</option>
        {categoryObj && categoryObj.map((category) => {
          return (
            <option key={category.id} value={category.category}>{category.category}</option>
          )
        })}
      </select>
      <ul className="postList">
        {filterPost && filterPost.map((post) => {
          return (
            <li>
              <Link key={post.id} to={`/posts/${post.id}`}>
                <div className={`image-box ${post.attachmentUrl ? '' : 'color'}`}>
                  {post.attachmentUrl && (
                    <img src={post.attachmentUrl} alt="PostImg" />
                  )}
                </div>
                <div className="text-container">
                  <h2>{post.title}</h2>
                  <div className="text-info">
                    <span>{post.category}</span>
                    <span className="date">{moment(post.createdAt).format('YYYY년MM월DD일')}</span>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home;