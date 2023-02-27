import React from 'react';
import styles from './UserInfo.module.scss';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <img
        className={styles.avatar}
        src={avatarUrl || 'https://mern-blog.adaptable.app/uploads/defAvatar.svg'}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>
          {additionalText.split('').slice(0, 16).join('').replace('T', ' ')}
        </span>
      </div>
    </div>
  );
};
