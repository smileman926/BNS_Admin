import React, { useCallback, useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Table } from 'antd';
import clsx from 'clsx';

import PageHeaderWithButton from '../../components/PageHeaderWithButton';
import styles from './index.module.scss';
import { productsSelector, queuedWebinarsSelector } from '../../redux/products/Selectors';
import { clearWebinars, getQueuedWebinars, moveWebinarToQueue } from '../../redux/products/Actions';
import ImageDownload from '../../components/ImageDownload';
import Filter from '../../components/Filter';
import router from '../../router';
import withAuth from '../../utils/HOC/withAuth';
import QueueModal from '../../components/QueueModal';
import { getSettingInfoRequest, updateSettingInfoRequest } from '../../redux/setting/settingActions';

import { settingsSelector } from '../../redux/setting/Selectors';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';


const WebinarQueues = () => {
  const loading = useSelector(productsSelector)?.loading;
  const modalRoot = document.getElementById('modal-root');
  const dispatch = useDispatch();
  const products = useSelector(queuedWebinarsSelector)?.rows;
  const totalActiveWebinars = useSelector((state) => state.setting.settingInfo)?.queued_webinar_limit;
  const history = useHistory();
  const location = useLocation();
  const queuedWebinarsPage = matchPath(location.pathname, router.webinarQueues.path) && true;
  const [active, setActive] = useState(false);
  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'productEdit' || item === 'webinarQueueEdit'));
  }, [permissions]);


  const handleModal = useCallback(() => {
    setActive(!active);
  }, [active]);
  const [newTotalActiveWebinars, setNewTotalActiveWebinars] = useState(totalActiveWebinars);

  useEffect(() => {
    dispatch(getSettingInfoRequest());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (totalActiveWebinars) {
      setNewTotalActiveWebinars(totalActiveWebinars);
    }
    // eslint-disable-next-line
  }, [totalActiveWebinars])

  const handleChangeButton = useCallback(() => {
    dispatch(updateSettingInfoRequest({
      queued_webinar_limit: newTotalActiveWebinars,
    }));
  }, [dispatch, newTotalActiveWebinars]);

  const handleQueuedWebinarsClick = useCallback(() => {
    dispatch(clearWebinars());
    history.push(router.webinarQueues.path);
  }, [dispatch, history]);

  const handleScheduledWebinarsClick = useCallback(() => {
    dispatch(clearWebinars());
    history.push(router.scheduledWebinars.path);
  }, [dispatch, history]);

  const handleAddToQueue = (product) => {
    dispatch(moveWebinarToQueue({
      product_id: product.id,
      publish_method: 'queued',
      product_type: 'webinar',
    },{
      param: 'scheduled',
      offset: 0,
      limit: 50,
    }));
  };
  const handleTotalActiveWebinarsChange = useCallback((e) => {
    const total = e.target.value;
    if (total < 0 || total > 100) {
      return;
    }
    setNewTotalActiveWebinars(total);
  }, []);

  const handleDuplicate = useCallback(
    (product) => {
      history.push(router.editProduct.path, {
        id: product?.id,
        type: 'webinar',
        duplicate: true
      });
    },
    [dispatch, history],
  );

  const queuedColumns = [
    {
      title: 'Thumbnail',
      dataIndex: 'name',
      key: 'name',
      render: (product, record) => <ImageDownload src={record?.main_image?.image_url} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (product) => product?.slice(0, 20),
    },
    {
      title: 'Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price_per_seats',
      key: 'price_per_seats',
      align: 'center',
      render: (product) => `$${product}`,
    },
    {
      title: 'Number of Seats',
      dataIndex: 'seats',
      key: 'seats',
      align: 'center',
      render: (product) => product,
    },
    {
      title: 'Webinar Type',
      dataIndex: 'webinar_type',
      key: 'webinar_type',
      align: 'center',
      render: (product) => product,
    },
    {
      title: 'Remove from the queue',
      dataIndex: 'product_status',
      key: 'goLive',
      align: 'center',
      className: styles.col,
      render: (product, record) => (
        edit &&
        <div className={styles.dropdown}>
          <button className={styles.dropdownBtn} onClick={handleModal}>
            Remove
          </button>
          {active && ReactDom.createPortal(<QueueModal
            close={handleModal}
            webinar={record}
          />, modalRoot) }
        </div>
      ),
    },
    {
      title: 'Duplicate',
      dataIndex: 'duplicate',
      key: 'duplicate',
      align: 'center',
      render: (product, record) => (
        <button
          className={styles.duplicateBtn}
          onClick={() => handleDuplicate(record)}
        >
          Duplicate
        </button>
      ),
    },
  ];
  const scheduledColumns = [
    {
      title: 'Thumbnail',
      dataIndex: 'name',
      key: 'name',
      render: (product, record) => <ImageDownload src={record?.main_image?.image_url} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (product) => product?.slice(0, 20),
    },
    {
      title: 'Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price_per_seats',
      key: 'price_per_seats',
      align: 'center',
      render: (product) => `$${product}`,
    },
    {
      title: 'Number of Seats',
      dataIndex: 'seats',
      key: 'seats',
      align: 'center',
      render: (product) => product,
    },
    {
      title: 'Webinar Type',
      dataIndex: 'webinar_type',
      key: 'webinar_type',
      align: 'center',
      render: (product) => product,
    },
    {
      title: 'Schedule time',
      dataIndex: 'scheduled_time',
      key: 'scheduled_time',
      align: 'center',
      render: (product) => parseTimeZone(product, timezone),
    },
    {
      title: 'Active/Inactive',
      dataIndex: 'product_status',
      key: 'goLive',
      align: 'center',
      render: (product, record) => (
        edit &&
        <button className={styles.duplicateBtn} onClick={() => handleAddToQueue(record)}>
          Add to Queue
        </button>

      ),
    },
    {
      title: 'Duplicate',
      dataIndex: 'duplicate',
      key: 'duplicate',
      align: 'center',
      render: (product, record) => (
        <button
          className={styles.duplicateBtn}
          onClick={() => handleDuplicate(record)}
        >
          Duplicate
        </button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeaderWithButton
        title='Webinar Queues'
      />
      <div className={styles.filtersCont}>
        <div className={styles.dropdownCont}>
          <div className={clsx(styles.btn, queuedWebinarsPage && styles.activeTab)} onClick={handleQueuedWebinarsClick}>
            Queued webinars
          </div>
          <div className={clsx(styles.btn, !queuedWebinarsPage && styles.activeTab)} onClick={handleScheduledWebinarsClick}>
            Scheduled webinars
          </div>
        </div>
        <div className={styles.cnt}>
          <div className={styles.search}>
            <input
              type='number'
              className={styles.inpt}
              value={newTotalActiveWebinars}
              onChange={(e) => handleTotalActiveWebinarsChange(e)}
              disabled={!edit}
            />
            <button
              className={styles.changeBtn}
              onClick={handleChangeButton}
              disabled={!edit}
            >
              Change
            </button>
          </div>
          <span>
         max number of queue
          </span>
        </div>
      </div>
      <div className={styles.tableCont}>
        <Filter
          webinarType={queuedWebinarsPage ? 'queued' : 'scheduled'}
          change={(param) => {dispatch(getQueuedWebinars(param)); console.log(param); } }
          search
        />
        <div>

          <Table
            loading={loading}
            dataSource={products}
            rowKey='id'
            columns={queuedWebinarsPage ? queuedColumns : scheduledColumns}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(withPermissionChecking(WebinarQueues));

