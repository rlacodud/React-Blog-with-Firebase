import AppRouter from "./Router";
import { useEffect, useState } from "react";
import { auth } from "../fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  
  useEffect(() => {
    // 유저의 정보가 변화할 때
    auth.onAuthStateChanged((user) => {
      // 유저가 로그인했다면
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
        })
        setIsLoggedIn(true);
      } else {
        setUserObj(null);
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])

  return (
    <>
      {init ?
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
        :
        "initializing..."
      }

    </>
  );
}

export default App;