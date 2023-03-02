import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import ReactMarkdown from 'react-markdown';
import axios from '../axios';
import { fetchCommentsThisPost } from '../redux/slices/comments';

export const FullPost = () => {
  const [data, setData] = React.useState();
  const dispatch = useDispatch();
  const commentsThisPost = useSelector((state) => state.comments.commentsThisPost);
  const [isLoading, setLoading] = React.useState(true);
  const isCommentsLoading = commentsThisPost.status === 'loading';
  const { id } = useParams();
  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении статьи');
      });
    dispatch(fetchCommentsThisPost(id));
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        // imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ''}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={commentsThisPost.items.length}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />,
      </Post>
      <CommentsBlock items={commentsThisPost.items} isLoading={isCommentsLoading}>
        <Index />
      </CommentsBlock>
    </>
  );
};
