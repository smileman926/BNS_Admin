import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import styles from './index.module.scss';
import router from '../../../router';
import { deleteFAQ, selectFAQ } from '../../../redux/FAQ/Actions';
import { rolesSelector } from '../../../redux/roles/Selectors';

const Question = (faq) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'faqEdit'));
  }, [permissions]);

  const handleEditClick = useCallback((id) => {
    dispatch(selectFAQ(id));
    history.push(router.editFaq.path);
  }, [history]);

  const handleOpenClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleDelete = useCallback((id) => {
    dispatch(deleteFAQ({ id }));
  }, []);

  return (
    <div className={clsx(styles.container, !isOpen && styles.maxHeight)}>
      <div className={clsx(styles.questCont, isOpen && styles.openQuestCont)}>
        <div className={clsx(styles.cnt, isOpen && styles.openedCnt)}>
          <div className={clsx(styles.inpt, isOpen && styles.faqQuestOpened)}>{faq.faq.question}</div>
          <img
            className={styles.icon}
            alt=""
            src={isOpen ? '/assets/icons/remove_circle.svg' : '/assets/icons/add_circle.svg'}
            onClick={handleOpenClick}
          />
        </div>
        {isOpen && <div className={styles.textArea}><div>{faq.faq.answer}</div></div>}
      </div>
      {edit &&
      <div className={clsx(styles.iconsCont, isOpen && styles.faqOpened)}>
        <img className={styles.changeIcon} alt=" " src="/assets/icons/create.svg"
             onClick={() => handleEditClick(faq.faq.id)} role="presentation"/>
        <img className={styles.deleteIcon} alt="" src="/assets/icons/delete.svg"
             onClick={() => handleDelete(faq.faq.id)}/>
      </div>
      }
    </div>
  );
};

export default Question;
