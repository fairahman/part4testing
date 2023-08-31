const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return  blogs.length ? blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0) : 0
}

const favoriteBlog = (blogs) => {
  const reducer = (mostLiked, currentblog) => {
    return mostLiked.likes > currentblog.likes ? mostLiked : currentblog
  }

  const mostLiked = blogs.length ? blogs.reduce(reducer, {}) : null
  return !mostLiked ? 'there are no blogs to evaluate' :
    {
      title: mostLiked.title,
      author: mostLiked.author,
      likes: mostLiked.likes
    }
}

const mostBlogs = (blogs) => {
  if (!blogs.length) return 'no blogs to evaluate'
  const blogsCountPerAuthor = {}
  blogs.forEach(blog => {
    blogsCountPerAuthor[`${blog.author}`] ?
      blogsCountPerAuthor[`${blog.author}`] +=1 : blogsCountPerAuthor[`${blog.author}`] = 1

  })

  let mostBlogs = 0
  let authorWhoWroteTheBlogs = ''
  Object.keys(blogsCountPerAuthor).forEach(author => {
    if (blogsCountPerAuthor[author] > mostBlogs) {
      mostBlogs = blogsCountPerAuthor[author]
      authorWhoWroteTheBlogs = author
    }
  })
  return { author: authorWhoWroteTheBlogs, blogs: mostBlogs }
}

const mostLikes = (blogs) => {
  const likesMap = {}
  let likes = 0
  let author = ''
  blogs.length ? blogs.forEach(blog => {
    likesMap[`${blog.author}`] ? likesMap[`${blog.author}`] += blog.likes : likesMap[`${blog.author}`] = blog.likes
    if (likesMap[`${blog.author}`] > likes) {
      likes = likesMap[`${blog.author}`]
      author = blog.author
    }
  }) : null

  return blogs.length ? { author: author, likes: likes } : 'no blogs to evaluate'
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
