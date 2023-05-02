import PostFactory from "../components/PostFactory";

const CreatePost = ({userObj}) => {

  return (
    <div className="wrap">
      <PostFactory userObj={userObj}/>
    </div>
  )
}

export default CreatePost;