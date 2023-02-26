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
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  };
};

const mostBlogs = (blogs) => {
  let authorBlogs = null;
  for (let i = 0; i < blogs.length; i++) {
    const allBlogs = blogs.filter(res => res.author.indexOf(blogs[i].author) !== -1);
    if (authorBlogs == null) {
      authorBlogs = allBlogs;
    } else if (allBlogs.length >= authorBlogs.length) {
      authorBlogs = allBlogs;
    }
  }
  const returnBlogs = {
    author: authorBlogs[0].author,
    blogs: authorBlogs.length
  };
  return returnBlogs;
};

const mostLikes = (blogs) => {
  let authorBlogs = null;
  for (let i = 0; i < blogs.length; i++) {
    const allBlogs = blogs.filter(res => res.author.indexOf(blogs[i].author) !== -1);
    if (authorBlogs == null) {
      authorBlogs = allBlogs;
    } else if (totalLikes(allBlogs) > totalLikes(authorBlogs)) {
      authorBlogs = allBlogs;
    }
  }
  const returnBlogs = {
    author: authorBlogs[0].author,
    likes: totalLikes(authorBlogs)
  };
  return returnBlogs;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
