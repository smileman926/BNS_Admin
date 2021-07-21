import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import moment from 'moment-timezone';
import styles from './index.module.scss';
import PageHeaderWithButton from '../../components/PageHeaderWithButton';
import router from '../../router';
import { giftCardsSelector } from '../../redux/giftCards/Selectors';
import { getAllGiftCards} from '../../redux/giftCards/Actions';
import withAuth from '../../utils/HOC/withAuth';
import { settingsSelector } from '../../redux/setting/Selectors';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';
import Filter from '../../components/Filter';

const GiftCards = () => {
  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;
  const giftCards = useSelector(giftCardsSelector)?.list?.rows;
  const loading = useSelector(giftCardsSelector)?.loading;
  const giftCardsTotal = useSelector(giftCardsSelector)?.list.count;
  const dispatch = useDispatch();

  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'giftCardsEdit'));
  }, [permissions]);


  useEffect(() => {
    dispatch(getAllGiftCards({ limit: 50, offset: 0 }));
  }, []);

  const columns = [

    {
      title: 'Id',
      dataIndex: 'id',
      key: 'name',
      render: (product) => product,
    },
    {
      title: 'Creation date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (product) => parseTimeZone(product, timezone),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      render: (value,record) => <label>${value}</label> 
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (product, record) => record?.status === 'unused' ? 'received' : 'spent',
    },
    {
      title: 'Win',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (product) => product === 'created' ? 'Manual' : product === 'won' ? 'Won' : 'Manual Correction',
    },
    {
      title: 'User email',
      dataIndex: ['user', 'email'],
      key: 'email',
      align: 'center',
    },
    {
      title: 'User first name',
      dataIndex: ['user', 'first_name'],
      key: 'user.email',
      align: 'center',
    },
    {
      title: 'User last name',
      dataIndex: ['user', 'last_name'],
      key: 'user.last_name',
      align: 'center',
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeaderWithButton
        title="Gift Cards"
        buttonTitle={edit ?"ADD NEW" : null}
        path={router.addGiftCard.path}
      />
      <Filter
        change={(param) => dispatch(getAllGiftCards(param))}
        total={giftCardsTotal}
        search
      />
      <Table
        dataSource={giftCards}
        columns={columns}
        pagination={false}
        loading={loading}
        rowClassName={styles.row}
      />
    </div>
  );
};

export default withAuth(withPermissionChecking(GiftCards));
