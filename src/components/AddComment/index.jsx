import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { fetchCommentsThisPost } from '../../redux/slices/comments';

export const Index = () => {
  const [update, setUpdate] = React.useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const [text, setText] = React.useState('');
  const { id } = useParams();

  const onSubmit = async () => {
    try {
      const fields = {
        text,
        user: userData._id,
        post: id,
      };

      await axios.post('/comments', fields);
      setText('');
      setUpdate(true);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании комментария');
    }
  };

  React.useEffect(() => {
    dispatch(fetchCommentsThisPost(id));
    setUpdate(false);
  }, [update]);

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={userData ? userData.avatarUrl : ''} />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained" disabled={!userData || !text}>
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
