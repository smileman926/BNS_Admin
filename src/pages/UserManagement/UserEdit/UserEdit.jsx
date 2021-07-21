import { LoadingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditUserInfo from '../../../components/EditUserInfo';
import UserPurchaseHistory from '../../../components/UserPurchaseHistory/UserPurchaseHistory';
import UserWinnerHistory from '../../../components/UserWinnerHistory';
import { rolesSelector } from '../../../redux/roles/Selectors';
import { apiGetUserInfo } from '../../../utils/api/api';
import withAuth from '../../../utils/HOC/withAuth';
import withPermissionChecking from '../../../utils/HOC/withPermissionsChecking';
import * as style from './UserEdit.module.scss';
import { getRoles } from '../../../redux/roles/Actions';

const { TabPane } = Tabs;

function UserEdit({ location }) {
  const user = location.state;
  const { id } = user;
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [winners, setWinners] = useState(null);
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'usersEdit'));
  }, [permissions]);

  const dispatch = useDispatch();
const roleLoading = useSelector((state) => state.roles.loading);
  useEffect(() => {
    setLoading(true);
    apiGetUserInfo(id)
      .then((res) => {
        const { transactions, winner_history, ...user } = res;
        setWinners(winner_history);
        setTransactions(transactions);
        setUserData({ ...user, id });
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={style.box}>
      <div className={style.header}>
        <h2 className={style.title}>{user.username}</h2>
      </div>
      <div className={clsx('box', style.container)}>
        {loading && (
          <div className={style.loadingBox}>
            <LoadingOutlined spin />
          </div>
        )}
        {!loading && (
          <Tabs defaultActiveKey="info">
            {edit && (
              <TabPane tab="User Information" key="info">
                <div className={style.wrp}>{userData && <EditUserInfo user={userData} />}</div>
              </TabPane>
            )}
            <TabPane tab="Purchase history" key="purchase">
              <UserPurchaseHistory data={transactions} />
            </TabPane>
            <TabPane tab="Winner history" key="winners">
              <UserWinnerHistory data={winners} />
            </TabPane>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default withAuth(withPermissionChecking(UserEdit));
