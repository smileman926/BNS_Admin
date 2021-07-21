import { Button, Col, Divider } from 'antd';
import React, { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { faqsSelector } from '../../../redux/FAQ/Selectors';
import * as styles from './index.module.scss';
import { updateFAQ } from '../../../redux/FAQ/Actions';
import router from '../../../router';
import withAuth from '../../../utils/HOC/withAuth';
import withPermissionChecking from '../../../utils/HOC/withPermissionsChecking';

const EditFaq = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const faq = useSelector(faqsSelector).list.selectedFaq;
  const [question, setQuestion] = useState(faq?.question || '');
  const [answer, setAnswer] = useState(faq?.answer || '');
  const handleQuestion = useCallback((e) => {
    setQuestion(e.target.value);
  }, []);
  const handleAnswer = useCallback((e) => {
    setAnswer(e.target.value);
  }, []);
  const handleUpdate = useCallback(() => {
    if (!question || !answer || !faq?.id) {
      return;
    }
    dispatch(updateFAQ({ id: faq?.id, question, answer }));
    history.push(router.faq.path);
  }, [question, answer, faq, dispatch, history]);

  const renderEditForm = useMemo(() => (
    <Col className={styles.wrapper}>
      <h2 className={styles.title}>FAQ Edit</h2>
      <Divider />
      <div className={styles.cont}>
        <span className={styles}>Edit question</span>
        <input onChange={handleQuestion} value={question} className={styles.inpt} />
      </div>
      <div className={styles.cont}>
        <span className={styles}>Edit answer</span>
        <input onChange={handleAnswer} value={answer} className={styles.inpt} />
      </div>
      <Button className={styles.btn} onClick={handleUpdate}>UPDATE</Button>
    </Col>
  ), [answer, handleAnswer, handleQuestion, handleUpdate, question]);

  return (renderEditForm);
};

export default withAuth(withPermissionChecking(EditFaq));
