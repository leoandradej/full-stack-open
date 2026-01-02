import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Blog component', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
    },
  };

  test('renders title and author but not url or likes by default', () => {
    render(<Blog blog={blog} />);

    // Check that title and author are visible
    const titleAuthor = screen.getByText(
      'Component testing is done with react-testing-library Test Author'
    );
    expect(titleAuthor).toBeDefined();

    // Check that URL is NOT visible (should not be in the document yet)
    const url = screen.getByText('http://testurl.com');
    expect(url).not.toBeVisible();

    // Check that likes are NOT visible
    const likes = screen.getByText('5');
    expect(likes).not.toBeVisible();
  });

  test('url and likes are shown when view button is clicked', async () => {
    render(<Blog blog={blog} />);

    const user = userEvent.setup();

    // Find and click the view button
    const button = screen.getByText('view');
    await user.click(button);

    // Now URL and likes should be visible
    expect(screen.getByText('http://testurl.com')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
  });

  test('clicking like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn();
    const user = userEvent.setup();

    render(<Blog blog={blog} updateBlog={mockHandler} />);

    // First, click view to show the details
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    // Find and click the like button twice
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    // Check that the mock function was called twice
    expect(mockHandler.mock.calls).toHaveLength(2);
  });

  test('like button calls handler with correct updated blog object', async () => {
    const mockHandler = vi.fn();
    const user = userEvent.setup();

    render(<Blog blog={blog} updateBlog={mockHandler} />);

    // Click view and then like
    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);

    // Check that handler was called with updated blog
    expect(mockHandler.mock.calls[0][0]).toEqual({
      ...blog,
      likes: blog.likes + 1,
    });
  });
});
