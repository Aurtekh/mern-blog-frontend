import React from 'react';
import { useDispatch } from 'react-redux';
import { SideBlock } from './SideBlock';
import { useParams } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import { useSelector } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import styles from './CommentBlock.module.scss';
import { fetchRemoveComment } from '../redux/slices/comments';

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);

  const onClickRemove = (event) => {
    if (window.confirm('Вы действительно хотите удалить комментарий?')) {
      dispatch(fetchRemoveComment(event.currentTarget.id));
    }
  };

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-center">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText primary={obj.user.fullName} secondary={obj.text} />
              )}
              {userData?._id === obj?.user._id && obj && (
                <div id={obj._id} onClick={onClickRemove} className={styles.editButtons}>
                  <IconButton color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
