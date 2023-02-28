import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchPostsPopular = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts/popular');
  return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchTagPosts = createAsyncThunk('posts/fetchTagPosts', async (tag) => {
  const { data } = await axios.get(`/tags/${tag}`);
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  'posts/fetchRemovePost',
  async (id) => await axios.delete(`/posts/${id}`),
);

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Получение статей
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.status = 'loading';
      state.posts.items = [];
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.status = 'success';
      state.posts.items = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.status = 'error';
      state.posts.items = [];
    });

    // Получение тегов
    builder.addCase(fetchTags.pending, (state) => {
      state.tags.status = 'loading';
      state.tags.items = [];
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.status = 'success';
      state.tags.items = action.payload;
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.status = 'error';
      state.tags.items = [];
    });

    // Удаление статьи
    builder.addCase(fetchRemovePost.pending, (state, action) => {
      state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
    });

    //получение постов с определнным тегом
    builder.addCase(fetchTagPosts.pending, (state) => {
      state.posts.status = 'loading';
      state.posts.items = [];
    });
    builder.addCase(fetchTagPosts.fulfilled, (state, action) => {
      state.posts.status = 'success';
      state.posts.items = action.payload;
    });
    builder.addCase(fetchTagPosts.rejected, (state) => {
      state.posts.status = 'error';
      state.posts.items = [];
    });
  },
});

export const postsReducer = postsSlice.reducer;
