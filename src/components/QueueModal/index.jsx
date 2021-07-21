import React, { useCallback, useMemo, useState } from 'react';
import { DatePicker } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.scss';
import { changePublishMethodFromQueue, updateProduct } from '../../redux/products/Actions';
import moment from 'moment';
import { settingsSelector } from '../../redux/setting/Selectors';
import { parseFromTimeZone } from 'date-fns-timezone';

const QueueModal = ({
  close, webinar,
}) => {
  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;
  const [active, setActive] = useState(false);
  const [scheduledDateNTime, setScheduledDateNTime] = useState();
  const dispatch = useDispatch();

  const setScheduledTime = useCallback((date) => {
    if (date) {
      const d = date.unix() === moment().unix() ? moment(date).tz(timezone) : date;
      const newDate = new Date(d.year(), d.month(), d.date(), d.hours(), d.minutes(), d.seconds(), d.milliseconds());
      return setScheduledDateNTime(moment(newDate));
    }
    setScheduledDateNTime(date);
  }, [setScheduledDateNTime, timezone]);
  const scheduled_time = useMemo(() => {
    return scheduledDateNTime ? parseFromTimeZone(scheduledDateNTime, { timeZone: timezone }).toISOString() : null;
  }, [scheduledDateNTime]);
  const handleScheduledPublish = useCallback(() => {
    dispatch(changePublishMethodFromQueue({
      product_id: webinar.id,
      product_type: 'webinar',
      scheduled_time,
      publish_method: 'scheduled',
      product_status: 'inactive',
    }, {
      close: () => close(),
    }));
  }, [dispatch, scheduledDateNTime, webinar.id]);

  const handlePublishNow = useCallback(() => {
    dispatch(changePublishMethodFromQueue({
      product_id: webinar.id,
      product_type: 'webinar',
      publish_method: 'instant',
      product_status: 'active',
    }, {
      close: () => close(),
    }));
  }, [dispatch, webinar.id]);

  const handlePutOnHold = useCallback(() => {
    dispatch(changePublishMethodFromQueue({
      product_id: webinar.id,
      product_type: 'webinar',
      product_status: 'hold',
    }, {
      close: () => close(),
    }));
  }, [dispatch, webinar.id]);
  
  const handleDate = useCallback(() => {
    setActive(true);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.panelCont}>
        <div className={styles.panel}>
          <div className={styles.imgCont} onClick={close} role='presentation'>
            <img alt='' src='/assets/icons/delete.svg' />
          </div>
          <div className={styles.btnsCont}>
            <button className={styles.btn} onClick={handlePublishNow}>
              Activate Now
            </button>
            <button className={styles.btn} onClick={handleDate}>
              Set date to go live
            </button>
            {
            active && (
            <DatePicker
              className={styles.datePicker}
              format="MM/DD/YYYY hh:mm:ss"
              showTime
              value={scheduledDateNTime}
              onChange={setScheduledTime}
            />
            )
          }
            {scheduledDateNTime && (
            <button className={styles.btn} onClick={handleScheduledPublish}>
              Save
            </button>
            )}
            <button className={styles.btn} onClick={handlePutOnHold}> 
             Put on hold
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QueueModal;
