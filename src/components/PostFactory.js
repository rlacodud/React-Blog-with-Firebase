import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { database, storage } from "../fbase";
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { useNavigate } from "react-router-dom";

const PostFactory = ({userObj}) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [attachment, setAttachment] = useState("");
  const [isCategory, setIsCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryObj, setCategoryObj] = useState('');
  const [selected, setSelected] = useState('all');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if(title === '' || contents === '') {
      return;
    }

    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const Posting = {
      title: title,
      contents: contents,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
      category: selected
    }
    await addDoc(collection(database, 'posts'), Posting);
    setTitle('');
    setContents('');

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

      navigate(`/posts/${postArray[0].id}`);
      });
  }
  
  const onChange = (e) => {
    const {target: {value, name}} = e;
    if(name === 'title'){
      setTitle(value);
    } else if(name === 'contents') {
      setContents(value);
    } else if(name === 'category') {
      setCategoryName(value);
    }
  }

  const onFileChange = (e) => {
    const {target: { files }} = e;
    const theFile = files[0];
    // 브라우저 API
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {currentTarget: { result }} = finishedEvent;
      setAttachment(result);
    };
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }
  };
  const onClearAttachment = () => setAttachment("");

  const categoryCreate = async(e) => {
    e.preventDefault();
    const category = {
      category: categoryName,
      createdAt: Date.now(),
    }
    await addDoc(collection(database, 'category'), category);
    setIsCategory(false);
  }

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
      <select name="category" value={selected} onChange={handleSelect}>
        <option value="all">All</option>
        {categoryObj && categoryObj.map((category) => {
          return (
            <option key={category.id} value={category.category}>{category.category}</option>
          )
        })} 
      </select>
        <div>
          <input name='title' value={title} onChange={onChange} type="text" placeholder="제목을 입력해주세요." required/>
          <input name='contents' value={contents} onChange={onChange} type="text" placeholder="내용을 입력해주세요." required />
          <input type="submit" value="&rarr;"/>
        </div>
        <label htmlFor = "attach-file">
        <span>Add photos</span>
      </label>
      <input id = "attach-file" type = "file" accept = "image/*" onChange = {onFileChange} style = {{opacity: 0,}} />
      {attachment && (
        <div>
          <img src = {attachment} style = {{backgroundImage: attachment}} alt="PostImg" />
          <div onClick = {onClearAttachment}>
            <span>Remove</span>
          </div>
        </div>
      )}
      </form>
      <button name='categoryCreate' onClick={() => {
        setIsCategory(true);
      }}>카테고리 생성</button>
      {isCategory &&
        <form onSubmit={categoryCreate}>
        <input name='category' value={categoryName} onChange={onChange} type="text" placeholder="카테고리를 입력해주세요." required/>
        <input type="submit" value="&rarr;"/>
      </form>
      }
    </>
  )
}

export default PostFactory;