const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return  blogs.length ? blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0) : 0
}

const mostLikedBlog = (blogs) => {
  const reducer = (mostLiked, currentblog) => {
    return mostLiked.likes > currentblog.likes ? mostLiked : currentblog
  }

  const mostLiked = blogs.length ? blogs.reduce(reducer, {}) : null 
  return !mostLiked ? 'there are no blogs' : 
   {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes
  }
}

module.exports = { dummy, totalLikes, mostLikedBlog }
