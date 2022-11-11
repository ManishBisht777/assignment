import React, { useState, useEffect } from "react";
import {
  fetchUsersList,
  getUserListContribution,
  sortUser,
} from "./utils/utils";
import "./app.css";
import User from "./components/User";

const types = [
  {
    background: "57e389",
    value: "name",
  },
  {
    background: "ed333b",
    value: "contribution",
  },
  {
    background: "f8e45c",
    value: "repo",
  },
  {
    background: "c061cb",
    value: "followers",
  },
];

const App = () => {
  const [input, setInput] = useState("");
  const [users, setUser] = useState([
    {
      contribution: 0,
      followers: 35,
      github: "https://github.com/manish",
      id: 16161,
      image: "https://avatars.githubusercontent.com/u/16161?v=4",
      name: "manish",
      repo: 14,
    },
  ]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [time, setTime] = useState(Date.now());
  const [error, setError] = useState(false);

  // re renders the whole app after 1 second
  // workaround for long api calls result
  // in late data fetch hence component not rerendering
  // To be optimised
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // fetches usersList
  const getUser = async () => {
    const response = await fetchUsersList(input);
    setUser(response);
  };

  // get contribution within interval
  const handleInterval = async () => {
    const currdate = new Date(Date.now()).toISOString();
    if (!fromDate) {
      setError(true);
      return;
    }
    if (toDate > currdate || fromDate > currdate || fromDate > toDate) {
      setError(true);
    } else {
      setError(false);
    }
    setUser(await getUserListContribution(users, fromDate, toDate));
  };

  // sort list based on the query params
  const handleSort = (sortQuery) => {
    if (!users) return;

    setUser(sortUser(sortQuery, users));
  };

  return (
    <main className=" min-w-full min-h-full flex flex-col text-white capitalize ">
      <p className="hidden">{Date(time)}</p>
      <div className="flex justify-center items-center pt-10 gap-5 flex-col">
        <div className="flex  gap-3">
          <input
            className="bg-[#3d3846] py-2 px-4 rounded-lg w-[60vw]"
            type="text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search Username"
          />
          <button
            className="bg-[#2ec27e] py-2 px-4 rounded-sm"
            onClick={() => getUser()}
          >
            search
          </button>
        </div>

        <div className=" flex gap-4 flex-col lg:flex-row">
          <div className="flex gap-2">
            <div className="flex flex-col lg:flex-row gap-3 items-center">
              <span>Start date</span>
              <input
                type="date"
                placeholder="From"
                className="md:text-lg text-white lg:text-xl border rounded-sm p-1 md:p-3 bg-transparent"
                onChange={(e) => {
                  if (!e.target.value) return;
                  setFromDate(new Date(e.target.value).toISOString());
                }}
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-3 items-center">
              <span>end date</span>
              <input
                type="date"
                placeholder="to"
                className="md:text-lg text-white lg:text-xl border rounded-sm p-1 md:p-3 bg-transparent"
                onChange={(e) => {
                  if (!e.target.value) return;
                  setToDate(new Date(e.target.value).toISOString());
                }}
              />
            </div>
          </div>
          <button
            className="bg-[#e0e0e0] p-3 rounded-lg text-black"
            onClick={() => handleInterval()}
          >
            View Contribution
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-10  p-5 w-full bg-red-400">
          Please enter valid interval
        </div>
      )}

      <div className="p-2 lg:p-10  flex overflow-scroll md:grid md:overflow-hidden md:grid-cols-5 gap-2 mt-10 mx-2 rounded-lg text-black">
        <p className="text-center padding bg-[#62a0ea]">Image</p>

        {types.map((type) => {
          return (
            <button
              key={type.value}
              className="padding bg-[#2ec27e] border hover:border hover:border-white hover:bg-transparent hover:text-white capitalize"
              value={type.value}
              onClick={(e) => handleSort(e.target.value)}
            >
              {type.value}
            </button>
          );
        })}
      </div>

      <div className="px-2 lg:px-10 py-3 mx-2 overflow-scroll ">
        {users && users.map((user) => <User key={user.github} user={user} />)}
      </div>
    </main>
  );
};

export default App;
