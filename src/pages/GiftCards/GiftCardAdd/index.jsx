import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AutoComplete } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import PageHeaderWithButton from '../../../components/PageHeaderWithButton';

import styles from './index.module.scss';
import { usersSelector } from '../../../redux/users/Selectors';
import { getAllUsers, getUsersSearchResult } from '../../../redux/users/Actions';
import { saveGiftCard } from '../../../redux/giftCards/Actions';
import router from '../../../router';
import withAuth from '../../../utils/HOC/withAuth';
import withPermissionChecking from '../../../utils/HOC/withPermissionsChecking';
import { apiGetUsers } from '../../../utils/api/api';
import { API } from 'aws-amplify';
import { debounce } from 'lodash';

const GiftCardAdd = () => {
  const users = useSelector(usersSelector)?.list?.searchResult?.rows;
  const [amount, setAmount] = useState();
  const [userId, setUserId] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const { Option } = AutoComplete;
  const [request, setRequest] = useState(null);

  
  useEffect(() => {
    dispatch(getAllUsers(''));
    // eslint-disable-next-line
  }, []);
  
  const children = users?.map((user) => <Option key={user.id} value={`${user.first_name} ${user.last_name}`}>{`${user.first_name} ${user.last_name}`}</Option>);
  
  const onSelect = useCallback((id, data) => {
    setUserId(data.key);
  }, []);
  const onChange = (data) => {
    dispatch(getUsersSearchResult(data));
  };
  const serchApi = debounce(onChange, 800);
  
  const handleAmountChange = useCallback((e) => {
    if(e.target.value.length > 6){
      return
    }
    setAmount(e.target.value);
  }, []);

  const handleSave = useCallback(() => {
    if (!amount || !userId) {
      return;
    }
    dispatch(saveGiftCard({ user_id: userId, amount }));
    history.push(router.giftCards.path);
  }, [amount, userId]);

  return (
    <div className={styles.container}>
      <PageHeaderWithButton title="Add New GiftCard" />

      <div className={styles.inptCont}>
        <span className={styles.span}>User</span>
        <AutoComplete
          className={styles.inpt}
          placeholder="Type user"
          onSelect={(key, data) => onSelect(key, data)}
          onChange={serchApi}
        >
          {children}
        </AutoComplete>
        <span className={styles.span}>Amount</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(e)}
          className={styles.inpt}
          placeholder="Type amount"
        />
        <button className={styles.btn} onClick={handleSave}>
          Save GiftCard
        </button>
      </div>
    </div>
  );
};

export default withAuth(withPermissionChecking(GiftCardAdd));
