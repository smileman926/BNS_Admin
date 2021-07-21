import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import clsx from 'clsx';
import styles from './index.module.scss';
import PageHeaderWithButton from '../../components/PageHeaderWithButton';
import Filter from '../../components/Filter';
import { getRefundSeats, saveRefundSeats } from '../../redux/seatRefund/Actions';
import { refundSeatsSelector } from '../../redux/seatRefund/Selectors';
import RefundModal from '../../components/RefundModal';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import withAuth from '../../utils/HOC/withAuth';

const SeatRefund = (props) => {
  const [selectedRows, setSelectedRows] = useState();
  const { id } = props.match.params;
  const dispatch = useDispatch();
  const seats = useSelector(refundSeatsSelector)?.list?.rows;
  const total = useSelector(refundSeatsSelector)?.list?.count;
  const loading = useSelector(refundSeatsSelector)?.loading;
  const [showModal, setShowModal] = useState(false);
  const modalRoot = document.getElementById('modal-root');
  const totalAmount = selectedRows?.reduce((acc, val) => acc + val.price, 0);
  const [filter, setFilter] = useState();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };
  useEffect(() => {
    if (filter) {
      filter.filterString = Number(filter.filterString) ? 
      Number(filter.filterString) - 1 : filter.filterString;
      dispatch(getRefundSeats(filter));
    }
  }, [filter]);
  const reloadTable = () => {
    setShowModal(false);
    setSelectedRows(null);
    setFilter({ ...filter });
  };
  const handleGiftRefund = (onSuccess = reloadTable) => {
    dispatch(saveRefundSeats({
      paymentMethod: 'gift',
      webinar_id: id,
      seats: selectedRows.map(({ seatsNo }) => seatsNo),
    }, {
      onSuccess,
      id,
    }));
  };
  const handlePaymentRefund = (onSuccess = reloadTable) => {
    dispatch(saveRefundSeats({
      paymentMethod: 'payment',
      webinar_id: id,
      seats: selectedRows.map(({ seatsNo }) => seatsNo),
    }, {
      onSuccess,
      id,
    }));
  };
  const columns = [
    {
      title: 'Seat No.',
      dataIndex: 'seatsNo',
      key: 'seatsNo',
      render: (product) => product + 1,
    },
    {
      title: 'User Name',
      dataIndex: 'buyer',
      key: 'username',
      render: (product) => product.username.slice(0, 20),

    },
    {
      title: 'User Email',
      dataIndex: 'buyer',
      key: 'email',
      render: (product) => product.email.slice(0, 40),
    },
    {
      title: 'Price Per Seat',
      dataIndex: 'price',
      key: 'price',
      render: (product) => `${product}$`,
    }];
  return (
    <div className={styles.cont}>
      <PageHeaderWithButton
        title='Seat Refund'
      />
      {showModal
      && ReactDom.createPortal(
        <RefundModal
          disabled={loading}
          handleGiftRefund={handleGiftRefund}
          handlePaymentRefund={handlePaymentRefund}
          close={() => setShowModal(false)}
        />, modalRoot,
      )}
      <Filter
        id={id}
        change={setFilter}
        total={total}
        search
      />
      <Table
        rowClassName={styles.row}
        pagination={false}
        columns={columns}
        dataSource={seats}
        rowKey='id'
        loading={loading}
        rowSelection={rowSelection}
      />
      <div className={styles.contain}>
        <div className={styles.inptCont}>
          <input className={styles.leftInpt} disabled placeholder='Total amount' />
          <input className={styles.rightInpt} disabled value={`${totalAmount || 0}$`} />
        </div>
        <button className={clsx(styles.btn, (!selectedRows?.length || loading) && styles.greyedBtn)} disabled={!selectedRows?.length || loading} onClick={() => setShowModal(true)}>Refund</button>
      </div>
    </div>
  );
};

export default withAuth(withPermissionChecking(SeatRefund));
