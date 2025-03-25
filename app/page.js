"use client";
import { useState, useEffect } from "react";

const Page = () => {
  const [user, setUser] = useState([]);
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentID, setCurrentID] = useState(null);

  const userDataURL = "https://jsonplaceholder.typicode.com/users";
  const postDataURL = "https://jsonplaceholder.typicode.com/posts";
  const commentDataURL = "https://jsonplaceholder.typicode.com/comments";

  const getData = async (url, hook) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      await hook(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData(userDataURL, setUser);
    getData(postDataURL, setPost);
  }, []);
  return (
    <div>
      <div>
        <h1 className="text-center text-[35px]">Posts</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {post.map((post) =>
            user
              .filter((u) => u.id === post.userId)
              .map((u) => (
                <Post
                  key={post.id}
                  post={post}
                  user={u}
                  props={{
                    setSelectedPost,
                    getData,
                    commentDataURL,
                    setCurrentID,
                  }}
                />
              ))
          )}
        </div>
        <PostComment
          props={{
            selectedPost,
            setSelectedPost,
            currentID,
            postDataURL,
            userDataURL,
          }}
        />
      </div>
    </div>
  );
};

const Post = ({ post, user, props }) => {
  const { setSelectedPost, getData, commentDataURL, setCurrentID } = props;

  const openPost = () => {
    getData(commentDataURL + `?postId=${post.id}`, setSelectedPost);
    setCurrentID(post.id);
  };
  return (
    <div
      className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4"
      onClick={openPost}
    >
      <h3 className="text-black-600 cursor-pointer w-max">
        {user.name} <i className="text-gray-500">@{user.username}</i>
      </h3>
      <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
      <p className="text-gray-600">{post.body}</p>
    </div>
  );
};

const PostComment = ({ props }) => {
  const { selectedPost, setSelectedPost, currentID, postDataURL, userDataURL } =
    props;
  const [data, setData] = useState([]);
  const [name, setName] = useState([]);

  useEffect(() => {
    if (!currentID) return;
    const getData = async () => {
      try {
        const response = await fetch(`${postDataURL}?id=${currentID}`);
        const jsonData = await response.json();
        setData(jsonData[0]);
      } catch (error) {
        console.error("Ошибка при загрузке данных getData:", error);
      }
    };
    getData();
  }, [currentID]);

  useEffect(() => {
    if (!data) return;
    const getName = async () => {
      try {
        const response = await fetch(`${userDataURL}?id=${data.userId}`);
        const jsonData = await response.json();

        console.log(jsonData);
        setName(jsonData[0]);
      } catch (error) {
        console.error("Ошибка при загрузке данных getName:", error);
      }
    };
    getName();
  }, [data]);

  if (!selectedPost) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center flex-col bg-black bg-opacity-50 "
      onClick={() => setSelectedPost(null)}
    >
      <h2 className="text-center text-[35px] text-white">Comments</h2>
      <div className="flex items-center justify-center gap-5">
        <div
          className="bg-white max-w-md p-6 rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4">
            <h3 className="text-black-600 cursor-pointer w-max">
              {name.name} <i className="text-gray-500">@{name.username}</i>
            </h3>
            <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
            <p className="text-gray-600">{data.body}</p>
          </div>
        </div>

        <div
          className="max-w-md max-h-[80vh] bg-white shadow-lg rounded-2xl p-6 space-y-4 overflow-y-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedPost.map((el, i) => (
            <div key={i} className="border-b border-black break-words">
              <h3 className="text-black-600 cursor-pointer w-max">
                {el.name}
                <br />
                <i className="text-gray-500">{el.email}</i>
              </h3>
              <p className="text-gray-600">{el.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
