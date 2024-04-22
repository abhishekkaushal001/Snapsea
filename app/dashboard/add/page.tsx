import React from "react";
import AddFriend from "./AddFriend";
import UserList from "./UserList";

const AddFriendPage = () => {
  return (
    <main className="w-full p-5 md:p-10">
      <h1 className="text-3xl md:text-5xl text-gray-900 font-bold mb-8">
        Add a friend
      </h1>

      <AddFriend />

      <UserList />
    </main>
  );
};

export default AddFriendPage;
