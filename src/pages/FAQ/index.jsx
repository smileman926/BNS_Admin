import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import router from '../../router';
import styles from './index.module.scss';
import Question from './Question';
import { getFAQs } from '../../redux/FAQ/Actions';
import { faqsSelector } from '../../redux/FAQ/Selectors';
import withAuth from '../../utils/HOC/withAuth';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';

const FAQ = () => {
  const faqs = useSelector(faqsSelector)?.list?.data;
  const history = useHistory();
  const dispatch = useDispatch();
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'faqEdit'));
  }, [permissions]);
  useEffect(() => {
    dispatch(getFAQs());
  }, []);

  const handleAddClick = useCallback(() => {
    history.push(router.addFaq.path);
  }, []);

  const renderFAQs = useMemo(() => {
    if (faqs?.length > 0) {
      return faqs.map((faq) => (<Question key={faq.id} faq={faq} />));
    }
    return (<div className={styles.noFaqsCont}> There is no FAQs </div>);
  }, [faqs]);

  return (
    <div className={styles.container}>
      <div className={styles.titleCont}>
        <span className={styles.title}>Frequently asked questions</span>
        {' '}
        {edit &&
        <button className={styles.addNewBtn} onClick={handleAddClick}>ADD NEW</button>
        }
      </div>
      <div className={styles.questCont}>
        {
          renderFAQs
        }
      </div>
    </div>

  );
};

export default withAuth(withPermissionChecking(FAQ));
