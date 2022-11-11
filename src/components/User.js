import React from "react";

const User = ({ user }) => {
  return (
    <a
      className="grid overflow-hidden grid-cols-5  gap-2 center-center my-3 border border-white/10 p-3 items-center rounded"
      href={user.github}
      target="_blank"
      rel="noreferrer"
    >
      <img className=" w-7 h-7 lg:w-10 lg:h-10" src={user.image} alt="" />
      <h2 className="break-all grow">{user.name}</h2>
      <p>{user.contribution ? user.contribution : "0"}</p>
      <p>{user.repo}</p>
      <p>{user.followers}</p>
    </a>
  );
};

export default User;
