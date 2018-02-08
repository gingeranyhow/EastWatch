
let getbucket = (uid) => {
  // Assign 20% of users (assuming random Ids dist) to bucket 2
  if (uid && Math.floor(uid % 5) === 4) {
    return 2;
  } else {
    return 1;
  }
};

module.exports = getbucket;