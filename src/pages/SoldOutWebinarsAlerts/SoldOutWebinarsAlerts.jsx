import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';
import ImageDownload from '../../components/ImageDownload';
import * as style from './SoldOutWebinarsAlerts.module.scss';
import { readNotifyRequest } from '../../redux/notification/notificationActions';
import withAuth from '../../utils/HOC/withAuth';

function SoldOutWebinarsAlerts() {
  const list = useSelector(state => state.notify.list);
  const loading = useSelector(state => state.notify.loading);

  const time = date => {
    const time = moment.duration(new Date() - new Date(date));

    const help = (data, type) => (data > 0 ? `${data} ${type}` : '');
    return `
      ${help(time.years(), 'y')}
      ${help(time.months(), 'm')}
      ${help(time.days(), 'd')}
      ${help(time.hours(), 'h')}
      ${help(time.minutes(), 'min')}
       ago`;
  };

  const dispatch = useDispatch();

  const readNotify = id => {
    dispatch(readNotifyRequest({ id }));
  };

  const typeNotify = type => {
    switch (type) {
      case 'sold_out':
        return 'has been sold out';
      case 'unused_promo_code':
        return `Some promo codes weren't applied to webinar`;
      case 'promo_code_sold_out':
        return 'promo code can not be generated because the prize is sold out';
      default:
        return '';
    }
  };

  return (
    <div className={style.box}>
      <div className={style.header}>
        <h2 className={style.title}>Sold Out Webinars</h2>
      </div>
      <div className={clsx('box', style.container)}>
        <p>Alerts</p>
        {list &&
          list.length > 0 &&
          list.map(notify => (
            <div key={notify.id} className={style.row}>
              <ImageDownload src={notify.product_image} />
              <p className={style.description}>
                <strong> {notify.product_name}</strong>{' '}
                <span>{typeNotify(notify.service_type)}</span>
                <span className={style.time}>{time(notify.createdAt)}</span>
              </p>
              <Button
                onClick={() => readNotify(notify.id)}
                icon={<CloseOutlined />}
                data-id={notify.id}
                htmlType="button"
                className={style.btnDel}
                loading={loading}
              />
            </div>
          ))}
        {!loading && list && list.length === 0 && <h2>Notification not found</h2>}
      </div>
    </div>
  );
}

export default withAuth(SoldOutWebinarsAlerts);
