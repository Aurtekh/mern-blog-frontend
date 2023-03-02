import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
  const { data } = await axios.get('/comments');
  return data;
});

export const fetchCommentsThisPost = createAsyncThunk(
  'comments/fetchCommentsThisPost',
  async (id) => {
    const { data } = await axios.get(`/comments/${id}`);
    return data;
  },
);

export const fetchRemoveComment = createAsyncThunk(
  'comments/fetchRemoveComment',
  async (id) => await axios.delete(`/comments/${id}`),
);

const initialState = {
  comments: {
    items: [],
    status: 'loading',
  },
  commentsThisPost: {
    items: [],
    status: 'loading',
  },
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Получение комментариев
    builder.addCase(fetchComments.pending, (state) => {
      state.comments.status = 'loading';
      state.comments.items = [];
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments.status = 'success';
      state.comments.items = action.payload;
    });
    builder.addCase(fetchComments.rejected, (state) => {
      state.comments.status = 'error';
      state.comments.items = [];
    });

    // Получение комментариев для полного поста
    builder.addCase(fetchCommentsThisPost.pending, (state) => {
      state.commentsThisPost.status = 'loading';
      state.commentsThisPost.items = [];
    });
    builder.addCase(fetchCommentsThisPost.fulfilled, (state, action) => {
      state.commentsThisPost.status = 'success';
      state.commentsThisPost.items = action.payload;
    });
    builder.addCase(fetchCommentsThisPost.rejected, (state) => {
      state.commentsThisPost.status = 'error';
      state.commentsThisPost.items = [];
    });

    // Удаление комментария
    builder.addCase(fetchRemoveComment.pending, (state, action) => {
      state.comments.items = state.comments.items.filter((obj) => obj._id !== action.meta.arg);
    });
  },
});

export const commentsReducer = commentsSlice.reducer;
