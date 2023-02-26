const listHelper = require('../utils/list_helper');

describe('favorite blog', () => {
  const listOfBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Kalle Mätitahna',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 1,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go OK Statement Considered Harmful',
      author: 'Siisti Ukko 1',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa78b54a676234d17f8',
      title: 'Go To Statement Considered Ok',
      author: 'Meininki Menninkäinen',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa41b54a676234d17f8',
      title: 'Go To Statement OK Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 12,
      __v: 0
    }
  ];

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listOfBlogs);
    expect(result.author).toBe(listOfBlogs[3].author);
  });
});
