import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { database, storage } from "../fbase";
import './Posts.css'

const Posts = ({ posts, userObj }) => {
  const navigate = useNavigate();
  const { post_id } = useParams();
  let postList;
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].id === post_id) {
      postList = posts[i];
    }
  }
  const [isOwner, setIsOwner] = useState(postList.creatorId === userObj.uid);
  const [edit, setEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(postList.title);
  const [newContents, setNewContents] = useState(postList.contents);
  const [comments, setComments] = useState('');

  const onDelete = () => {
    const yes = window.confirm('삭제하시겠습니까?');
    if (yes) {
      deleteDoc(doc(database, 'posts', postList.id));
      if (postList.attachmentUrl !== "") {
        deleteObject(ref(storage, postList.attachmentUrl));
      }
      navigate('/');
    }
  }

  const toggleEditing = () => setEdit((prev) => !prev);

  const onChange = (e) => {
    const { target: { value, name } } = e;
    if (name === 'title') {
      setNewTitle(value);
    } else if (name === 'contents') {
      setNewContents(value);
    } else if (name === 'comment') {
      setComments(value);
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    updateDoc(doc(database, 'posts', postList.id), { title: newTitle, contents: newContents });
    setEdit(false);
  }

  const onSubmitComment = async (e) => {
    e.preventDefault();
    if (comments === '') {
      return;
    }

    const Comment = {
      comment: comments,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    }
    await addDoc(collection(postList, `comment`), Comment);
    setComments('');

    // const commentData = query(
    //   collection(database, `${postList}/comment`),
    //   orderBy("createdAt", "desc")
    // );
    // onSnapshot(commentData, (snapshot) => {
    //   const commentArray = snapshot.docs.map((document) => ({
    //     id: document.id,
    //     ...document.data(),
    //   }));
    //   setComments(commentArray);

    // });
  }

  // 댓글을 달면 해당 게시물에 댓글 컬렉션 생성
  // 하위 도큐먼트 요소로는 작성자명, 댓글, 작성 시간

  return (
    <div className="wrap">
      {edit ? (
        <>
          <form onSubmit={onSubmit}>
            <input name="title" onChange={onChange} value={newTitle} required placeholder="제목을 수정해주세요" autoFocus />
            <input name="contents" onChange={onChange} value={newContents} required placeholder="내용을 수정해주세요" autoFocus />
            <input type='submit' value='update chat' />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      )
        : (
          <>
            <h1 className="postTitle">{postList.title}</h1>
            {isOwner && (
              <div>
                <span onClick={onDelete}>
                  Delete
                </span>
                <span onClick={toggleEditing}>
                  Edit
                </span>
              </div>
            )}
            <h6>{postList.contents}</h6>
            {postList.attachmentUrl && (
              <img src={postList.attachmentUrl} width="50px" height="50px" alt="PostImg" />
            )}
            <div>
              <form onSubmit={onSubmitComment}>
                <input name="comment" type='text' onChange={onChange} value={comments} placeholder="댓글을 작성해주세요" />
                <input type='submit' value='submit' />
              </form>
            </div>
          </>
        )
      }
    </div>
  )
}

export default Posts;