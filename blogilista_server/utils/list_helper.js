const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let sum = 0;
  for (let i = 0; i < blogs.length; i++) {
    sum += blogs[i].likes;
  }

  return sum;
};

const favoriteBlog = (blogs) => {
  let favorite = null;
  for (let i = 0; i < blogs.length; i++) {
    if (favorite != null) {
      if (favorite.likes <= blogs[i].likes) {
        favorite = blogs[i];
      }
    } else {
      favorite = blogs[i];
    }
  }
  return favorite;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
