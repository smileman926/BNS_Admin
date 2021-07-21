import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import moment from 'moment-timezone';

import styles from './index.module.scss';
import PageHeaderWithButton from '../../components/PageHeaderWithButton';
import router from '../../router';
import { getAllPromoCodes } from '../../redux/promoCodes/Actions';
import { promoCodesSelector } from '../../redux/promoCodes/Selectors';
import withAuth from '../../utils/HOC/withAuth';
import { settingsSelector } from '../../redux/setting/Selectors';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';
import { apiEditPromoCode } from '../../utils/api/api';
import { notification } from 'antd';
import Filter from '../../components/Filter';

const PromoCodes = () => {
  const dispatch = useDispatch();
  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;
  const promoCodes = useSelector(promoCodesSelector)?.list?.rows;
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);
  const [filter, setFilter] = useState({
    filterString: "",
  });

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'promoCodesEdit'));
  }, [permissions]);

  const handleEdit = record => {
    apiEditPromoCode(
      { is_deactivated: !record.is_deactivated},
      record.id
    )
    .then((res) => {
      if ( res.message === "success") {
        notification.success({
          message: "Edited successfully",
        });
        dispatch(getAllPromoCodes(filter));
      }          
      else
        notification.error({
          message: "Failed editing",
        });
    })
    .catch(err => {
      notification.error({
        message: err?.response?.data?.message,
      });
    });
  }

  const columns = [

    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (product) => product,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (product, record) => record.code_type === 'percent' ? `${product}%` : `$${product}`,
    },
    {
      title: 'Product type',
      dataIndex: 'product_type',
      key: 'product_type',
      render: (product) => product,
    },
    {
      title: 'Number of Uses',
      dataIndex: 'number_used',
      key: 'number_used',
      render: (product) => product,
    },
    {
      title: 'Start Date',
      dataIndex: 'date_from',
      key: 'date_from',
      render: (product) => parseTimeZone(product, timezone),
    },
    {
      title: 'End Date',
      dataIndex: 'date_to',
      key: 'date_to',
      render: (product) => parseTimeZone(product, timezone),
    },
    {
      title: 'Status',
      dataIndex: 'is_deactivated',
      key: 'is_deactivated',
      render: (product) => product ? 'Inactive' : 'Active',
    },
    {
      title: 'Activate/ Deactivate',
      dataIndex: 'activation',
      key: 'activation',
    render: (product, record) => <button disabled={moment(Date()) > moment(record?.date_to)} className={record.is_deactivated ? styles.btn : styles.btn_deactive} onClick={() => handleEdit(record)}>{ record.is_deactivated ? 'Activate' : 'Inactive'}</button>,
    },
  ];

  useEffect(() => {
    dispatch(getAllPromoCodes(filter));
  },[filter])

  return (
    <div className={styles.container}>
      <PageHeaderWithButton
        title="Promo Codes"
        buttonTitle={edit ? "ADD NEW" : null }
        path={router.addPromoCode.path}
      />
      <Filter 
        change={setFilter} 
        placeholder="Search by promo code" 
        search
        />
      <Table
        dataSource={promoCodes}
        columns={columns}
        pagination={false}
        rowClassName={styles.row}
      />
    </div>
  );
};

export default withAuth(withPermissionChecking(PromoCodes));
