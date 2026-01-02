import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('BlogForm', () => {
  test('form calls event handler with correct details when a new blog is created', async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByPlaceholderText('write title here');
    const authorInput = screen.getByPlaceholderText('write author here');
    const urlInput = screen.getByPlaceholderText('write url here');
    const submitButton = screen.getByText('create');

    await user.type(titleInput, 'Testing forms is important');
    await user.type(authorInput, 'Test Author');
    await user.type(urlInput, 'http://testurl.com');

    await user.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);

    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Testing forms is important',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0,
    });
  });
});
