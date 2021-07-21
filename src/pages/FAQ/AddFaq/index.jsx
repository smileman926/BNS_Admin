import { Button, Col, Divider } from 'antd';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as styles from './index.module.scss';
import { saveFAQ } from '../../../redux/FAQ/Actions';
import router from '../../../router';
import withAuth from '../../../utils/HOC/withAuth';
import withPermissionChecking from '../../../utils/HOC/withPermissionsChecking';

const AddFaq = () => {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const history = useHistory();

  const handleQuestion = useCallback((e) => {
    setQuestion(e.target.value);
  }, []);

  const handleAnswer = useCallback((e) => {
    setAnswer(e.target.value);
  }, []);

  const handleSave = useCallback(async () => {
    if (!question || !answer) {
      return;
    }
    await dispatch(saveFAQ({ question, answer }));
    history.push(router.faq.path);
  }, [question, answer, dispatch, history]);

  return (
    <Col className={styles.wrapper}>
      <h2 className={styles.title}>ADD FAQ</h2>
      <Divider />
      <div className={styles.cont}>
        <span className={styles.span}>Edit question</span>
        <input className={styles.inpt} onChange={(e) => handleQuestion(e)} />
      </div>
      <Divider />
      <div className={styles.cont}>
        <span className={styles.span}>Edit answer</span>
        <input className={styles.inpt} onChange={(e) => handleAnswer(e)} />
      </div>
      <Button className={styles.btn} onClick={handleSave}>SAVE</Button>
    </Col>
  );
};

export default withAuth(withPermissionChecking(AddFaq));
