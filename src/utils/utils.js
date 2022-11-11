// get contribution data from api using @username
// params - username
async function getContributions(username) {
  const headers = {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
  };

  const body = {
    query: `query {
              user(login: "${username}") {
                name
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                  }
                }
              }
            }`,
  };

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response.json();
  return data.data.user.contributionsCollection.contributionCalendar
    .totalContributions;
}

async function getContributionInInterval(from, to, username) {
  const headers = {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
  };

  const body = {
    query: `{
        user(login: "${username}") {
          contributionsCollection(from: "${from}", to: "${to}") {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }`,
  };

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response.json();
  return data.data.user.contributionsCollection.contributionCalendar
    .totalContributions;
}

// get userdata from github api using uername and combine it with contribution of user and return it

// params username
// return an object containing user data

export const getUser = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: process.env.REACT_APP_GITHUB_TOKEN,
      },
    });

    const contribution = await getContributions(username);

    const data = await response.json();
    return {
      followers: data.followers,
      repo: data.public_repos,
      contribution: contribution,
      id: data.id,
      name: data.login,
      image: data.avatar_url,
      github: `https://github.com/${data.login}`,
    };
  } catch (error) {
    console.log("user not found");
    return error;
  }
};

// get a list of users based on the queryname
// return array ofobject containing user data

export const fetchUsersList = async (queryname) => {
  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${queryname}&in:user&per_page=20`,
      {
        headers: {
          Authorization: process.env.REACT_APP_GITHUB_TOKEN,
        },
      }
    );

    let data = await response.json();

    let userList = [];
    data.items.forEach(async (user) => {
      const userdata = await getUser(user.login);
      userList.push(userdata);
    });

    return userList;
  } catch (error) {
    console.log("user not found");
    return error;
  }
};

// sort list of users based on query
//  takes 2 parameter query and userList

export const sortUser = (queryname, unSortedData) => {
  if (queryname === "repo") {
    function compare(curr, next) {
      if (curr.repo < next.repo) {
        return 1;
      }
      if (curr.repo > next.repo) {
        return -1;
      }
      return 0;
    }

    return unSortedData.sort(compare);
  } else if (queryname === "followers") {
    function compare(curr, next) {
      if (curr.followers < next.followers) {
        return 1;
      }
      if (curr.followers > next.followers) {
        return -1;
      }
      return 0;
    }
    return unSortedData.sort(compare);
  } else if (queryname === "name") {
    function compare(curr, next) {
      if (curr.name < next.name) {
        return 1;
      }
      if (curr.name > next.name) {
        return -1;
      }
      return 0;
    }
    return unSortedData.sort(compare);
  } else if (queryname === "contribution") {
    function compare(curr, next) {
      if (curr.contribution < next.contribution) {
        return 1;
      }
      if (curr.contribution > next.contribution) {
        return -1;
      }
      return 0;
    }
    return unSortedData.sort(compare);
  }
};

export const getUserListContribution = async (users, fromDate, toDate) => {
  if (!toDate) toDate = new Date(Date.now()).toISOString();

  users.map(async (user, index) => {
    const contribution = await getContributionInInterval(
      fromDate,
      toDate,
      user.name
    );

    users[index] = { ...user, contribution: contribution };
  });

  return users;
};
