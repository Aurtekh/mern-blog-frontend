import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import uniq from 'lodash.uniq';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, fetchPostsPopular, fetchTagPosts } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments';

export const Home = () => {
  const { id: tag } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { comments } = useSelector((state) => state.comments);
  const { posts, tags } = useSelector((state) => state.posts);
  const [tabIndex, setTabIndex] = React.useState(0);
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentLoading = comments.status === 'loading';
  const isTagPosts = Boolean(tag);

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (tabIndex === 1) {
      dispatch(fetchPostsPopular());
    } else {
      dispatch(fetchPosts());
    }
    // dispatch(fetchTags());
    // eslint-disable-next-line
  }, [tabIndex]);

  React.useEffect(() => {
    if (isTagPosts) {
      dispatch(fetchTagPosts(tag));
    } else {
      dispatch(fetchPosts());
    }
  }, [isTagPosts, tag]);

  return (
    <>
      {!isTagPosts ? (
        <Tabs style={{ marginBottom: 15 }} value={tabIndex} aria-label="basic tabs example">
          <Tab label="Новые" onClick={() => setTabIndex(0)} />
          <Tab label="Популярные" onClick={() => setTabIndex(1)} />
        </Tabs>
      ) : (
        <h1 style={{ padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>{'#' + tag}</h1>
      )}
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                // imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={comments.items.filter((comment) => comment.post === obj._id).length}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={uniq(tags.items)} isLoading={isTagsLoading} />
          <CommentsBlock items={comments.items.slice(0, 5)} isLoading={isCommentLoading} />
        </Grid>
      </Grid>
    </>
  );
};
