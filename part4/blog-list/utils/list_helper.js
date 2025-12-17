const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, currentBlog) => acc + currentBlog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  return blogs.reduce((mostLiked, current) => {
    return current.likes > mostLiked.likes ? current : mostLiked;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const blogCounts = _.countBy(blogs, 'author');

  const topAuthor = _.maxBy(
    Object.keys(blogCounts, (author) => blogCounts[author])
  );

  return {
    author: topAuthor,
    blogs: blogCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const groupedByAuthor = _.groupBy(blogs, 'author');

  const likesPerAuthor = _.map(groupedByAuthor, (authorBlogs, author) => {
    return {
      author: author,
      likes: _.sumBy(authorBlogs, 'likes'),
    };
  });

  return _.maxBy(likesPerAuthor, 'likes');
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
