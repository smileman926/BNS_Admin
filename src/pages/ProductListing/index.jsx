import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dropdown, Menu, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import uid from 'uid';

import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { DownOutlined } from '@ant-design/icons';
import PageHeaderWithButton from '../../components/PageHeaderWithButton';
import router from '../../router';
import Filter from '../../components/Filter';
import styles from './index.module.scss';
import { productsSelector } from '../../redux/products/Selectors';
import {
  changeProductStatus,
  getProducts,
  getSelectedProduct,
  updateProduct,
} from '../../redux/products/Actions';
import ImageDownload from '../../components/ImageDownload';
import withAuth from '../../utils/HOC/withAuth';
import { settingsSelector } from '../../redux/setting/Selectors';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';

const ProductListingOptions = () => {
  const dispatch = useDispatch();
  const products = useSelector(productsSelector)?.list?.rows;
  const loading = useSelector(productsSelector)?.loading;
  const productsTotal = useSelector(productsSelector)?.list?.count;
  const totalActive = useSelector(productsSelector)?.list?.total_live_count || 0;
  const history = useHistory();
  const [filter, setFilter] = useState();
  const [status, setStatus] = useState();
  const [edit, setEdit] = useState(false);

  const [getProdFilter, setGetProdFilter] = useState();

  useEffect(() => {
    console.log(getProdFilter)
  }, [getProdFilter]);

  const permissions = useSelector(rolesSelector);
  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'productEdit'));
  }, [permissions]);

  const handleChangeStatusFilter = (status) => {
    setStatus(status);
  };
  const handleChangeProductFilter = (productType) => {
    setFilter(productType);
  };

  const accessRefund = useMemo(() => permissions?.some((item) => item === 'seatsRefundView'), [
    permissions,
  ]);

  const handleRefund = ({ id }) => {
    return accessRefund ? history.push(router.seatRefund.path.replace(':id', id)) : null;
  };

  const handleEdit = useCallback(
    (product) => {
      // Promise.resolve(
      //   dispatch(
      //     getSelectedProduct({
      //       id: product?.id,
      //       type: product?.product_type.toLowerCase(),
      //     }),
      //   ),
      // ).then(history.push(router.editProduct.path));
      history.push(router.editProduct.path, {
        id: product?.id,
        type: product?.product_type.toLowerCase()
      });
    },
    [dispatch, history],
  );

  const handleDuplicate = useCallback(
    (product) => {
      history.push(router.editProduct.path, {
        id: product?.id,
        type: product?.product_type.toLowerCase(),
        duplicate: true
      });
    },
    [dispatch, history],
  );

  const handleActivateClick = useCallback(
    (product) => {
      console.log(getProdFilter);
      if (product?.product_status === 'active') {
        if (product?.product_type === 'webinar') {
          dispatch(
            changeProductStatus(
              {
                product_id: product.id,
                product_status: 'hold',
                product_type: product.product_type.toLowerCase(),
              },
              getProdFilter
            ),
          );
        } else {
          dispatch(
            changeProductStatus(
              {
                product_id: product.id,
                product_status: 'hold',
                product_type: product.product_type.toLowerCase(),
              },
              getProdFilter
            ),
          );
        }
      } else if (product?.product_type === 'Physical') {
        dispatch(
          changeProductStatus(
            {
              product_id: product.id,
              publish_method: 'instant',
              product_type: product.product_type.toLowerCase(),
              scheduled_time: moment().toISOString(),
            },
            getProdFilter
          ),
        );
      } else {
        dispatch(
          changeProductStatus(
            {
              product_id: product.id,
              publish_method: 'instant',
              product_type: product.product_type.toLowerCase(),
              scheduled_time: moment().toISOString(),
              product_status: 'active',
            },
            getProdFilter
          ),
        );
      }
    },
    [dispatch, getProdFilter],
  );

  const renderFilterProductType = useMemo(() => {
    switch (filter) {
      case 'both':
        return 'All';
      case 'webinar':
        return 'Webinar';
      case 'physical':
        return 'Physical';
      default:
        return 'All';
    }
  }, [filter]);
  const renderFilterStatus = useMemo(() => {
    switch (status) {
      case 'all':
        return 'Both';
      case 'active':
        return 'Active';
      case 'hold':
        return 'Inactive';
      default:
        return 'Both';
    }
  }, [status]);
  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'main_image',
      key: 'main_image',
      render: (product) => <ImageDownload src={product?.image_url} />,
    },
    {
      title: 'Name',
      dataIndex: 'product_name',
      key: 'product_name',
      width: '20%',
      render: (product, record) => (
        <span
          className={record.product_type !== 'Physical' && accessRefund ? styles.pointer : ''}
          onClick={
            record.product_type !== 'Physical' && accessRefund ? () => handleRefund(record) : null
          }
        >
          {product&&product}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      width: '15%',
      render: (product) => product?.slice(0, 30),
    },
    {
      title: (
        <span>
          Type of
          <br /> Product
        </span>
      ),
      dataIndex: 'product_type',
      key: uid(4),
      render: (product) => product,
    },
    {
      title: 'Price',
      dataIndex: 'product_price',
      key: uid(4),
      render: (product) => `$${product}`,
    },
    {
      title: (
        <span>
          Quantity/
          <br /> Seats
        </span>
      ),
      dataIndex: 'Quantity',
      key: uid(4),
      render: (product) => product,
    },
    {
      title: (
        <span>
          Set date
          <br /> to go Live
        </span>
      ),
      dataIndex: 'scheduled_time',
      key: uid(4),
      render: (product, record) =>
        record.product_status === 'hold'
          ? 'hold'
          : product && (
              <div className={styles.calendarCont}>
                {parseTimeZone(product, timezone)}
                <img alt="" src="/assets/icons/calendar.svg" />
              </div>
            ),
    },
    {
      title: (
        <span>
          View/
          <br />
          Edit
        </span>
      ),
      dataIndex: 'view/Edit',
      key: 'view/Edit',
      render: (text, record) =>
        edit && (
          <img
            alt=""
            src="/assets/icons/create.svg"
            className={styles.iconPencil}
            onClick={() => handleEdit(record)}
          />
        ),
    },
    {
      title: 'Active/Inactive',
      dataIndex: 'product_status',
      key: 'goLive',
      render: (product, record) => (
        <button
          disabled={record.Quantity === 0 || !edit}
          className={clsx(
            styles.btn,
            product !== 'active' && styles.inAcitve,
            record.Quantity === 0 && styles.btnGreyed,
          )}
          onClick={() => handleActivateClick(record)}
        >
          {product === 'active' ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      title: 'Duplicate',
      dataIndex: 'duplicate',
      key: 'duplicate',
      render: (product, record) => (
        <button
          className={styles.btn}
          onClick={() => handleDuplicate(record)}
        >
          Duplicate
        </button>
      ),
    },
  ];
  const productsMenu = (
    <Menu className={styles.menuCont}>
      <Menu.Item
        key="0"
        className={styles.menuItem}
        onClick={() => handleChangeProductFilter('both')}
      >
        <div>
          <span className={styles.spanMenu}>All</span>
        </div>
      </Menu.Item>
      <Menu.Divider className={styles.divider} />
      <Menu.Item
        key="1"
        className={styles.menuItem}
        onClick={() => handleChangeProductFilter('physical')}
      >
        <div>
          <span className={styles.spanMenu}>Physical</span>
        </div>
      </Menu.Item>
      <Menu.Divider className={styles.divider} />
      <Menu.Item
        key="2"
        className={styles.menuItem}
        onClick={() => handleChangeProductFilter('webinar')}
      >
        <div>
          <span className={styles.spanMenu}>Webinar</span>
        </div>
      </Menu.Item>
    </Menu>
  );
  const statusMenu = (
    <Menu className={styles.menuCont}>
      <Menu.Item
        key="0"
        className={styles.menuItem}
        onClick={() => handleChangeStatusFilter('all')}
      >
        <div>
          <span className={styles.spanMenu}>Both</span>
        </div>
      </Menu.Item>
      <Menu.Divider className={styles.divider} />
      <Menu.Item
        key="1"
        className={styles.menuItem}
        onClick={() => handleChangeStatusFilter('active')}
      >
        <div>
          <span className={styles.spanMenu}>Active</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="2"
        className={styles.menuItem}
        onClick={() => handleChangeStatusFilter('hold')}
      >
        <div>
          <span className={styles.spanMenu}>Inactive</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.container}>
      <PageHeaderWithButton
        buttonTitle={edit && 'ADD NEW'}
        title="Product Listing"
        path={`${router.addProduct.path.replace(':product_type', 'physical_product')}`}
      />
      <div className={styles.filtersCont}>
        <div className={styles.dropdownCont}>
          <div>
            <Dropdown overlay={productsMenu} trigger={['click']} className={styles.menu}>
              <a onClick={(e) => e.preventDefault()}>
                <div className={styles.span}>{renderFilterProductType}</div> <DownOutlined />
              </a>
            </Dropdown>
          </div>
          <div>
            <Dropdown overlay={statusMenu} trigger={['click']} className={styles.menu}>
              <a onClick={(e) => e.preventDefault()}>
                <div className={styles.span}>{renderFilterStatus}</div> <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
        <div>
          <span>Total active Webinars: {totalActive}</span>
        </div>
      </div>
      <div className={styles.tableCont}>
        <Filter
          change={(param) => dispatch(getProducts(param))}
          total={productsTotal}
          productFilter={filter}
          productStatus={status}
          setGetProdFilter={(params) => setGetProdFilter(params)}
          search
        />
        <div>
          <Table
            dataSource={products}
            columns={columns}
            pagination={false}
            rowKey="id"
            rowClassName={styles.row}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(withPermissionChecking(ProductListingOptions));
