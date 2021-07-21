import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Dropdown, Menu } from 'antd';
import { apiGetOrderHistory } from '../../utils/api/api';
import { saveRefundSeats } from '../../redux/seatRefund/Actions';
import styles from './index.module.scss';
import PageHeaderWithButton from '../../components/PageHeaderWithButton';
import Filter from '../../components/Filter';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import { settingsSelector } from '../../redux/setting/Selectors';
import withAuth from '../../utils/HOC/withAuth';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';
import { DownOutlined } from '@ant-design/icons';
import ReactDom from 'react-dom';
import RefundModal from '../../components/RefundModal';
import clsx from 'clsx';

const OrderHistory = () => {

  const dispatch = useDispatch();
  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;
  const permissions = useSelector(rolesSelector);

  const modalRoot = document.getElementById('modal-root');
  const [seatRefund, setSeatRefund] = useState({
    id: null,
    seatNo: null,
    showModal: false
  });

  const [edit, setEdit] = useState(false);
  const [filterObj, setFilterObj] = useState({
    limit: 50,
    offset: 0,
    filter: '',
    search: ''
  });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const getOrderHistoryList = () => {
    setLoading(true);
    apiGetOrderHistory(filterObj)
    .then( res => {
        setLoading(false);
        setTotalCount(res?.count)
        setProducts(res?.rows);        
      }
    )
    .catch( err => {
      setLoading(false);
      console.log(err);
      }      
    )
  }

  const changeFilterObj = params => {
    if (params) {
      const { limit, offset, filterString } = params;
      setFilterObj({...filterObj, limit: limit, offset: offset, search: filterString});
    }
  }

  useEffect(() => {
    getOrderHistoryList();
  }, []);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'soldOutPhysicalEdit'));    
  }, [permissions]);

  const accessRefund = useMemo(() => permissions?.some((item) => item === 'seatsRefundView'), [
    permissions,
  ]);

  useEffect(() => {
    getOrderHistoryList();
  }, [filterObj]);

  const renderFilterProductType = useMemo(() => {
    switch (filterObj.filter) {
      case 'both':
        return 'All';
      case 'webinar':
        return 'Webinar';
      case 'product':
        return 'Physical';
      default:
        return 'All';
    }
  }, [filterObj.filter]);

  const handleChangeProductFilter = (productType) => {
    setFilterObj({...filterObj, filter: productType});
  };

  const reloadTable = () => {
    setSeatRefund({
      id: null,
      seatsNo: null,
      showModal: false
    })
    setFilterObj({ ...filterObj });
  };

  const handleGiftRefund = (onSuccess = reloadTable) => {
    dispatch(saveRefundSeats({
      paymentMethod: 'gift',
      webinar_id: seatRefund.id,
      seats: [seatRefund.seatNo]
    }, {
      onSuccess
    }));
  };
  const handlePaymentRefund = (onSuccess = reloadTable) => {
    dispatch(saveRefundSeats({
      paymentMethod: 'payment',
      webinar_id: seatRefund.id,
      seats: [seatRefund.seatNo]
    }, {
      onSuccess
    }));
  };

  const refundSeatFunc = (id, num) => {
    setSeatRefund({
      id: id,
      seatNo: num,
      showModal: true
    });
  }

  const productsMenu = (
    <Menu className={styles.menuCont}>
      <Menu.Item
        key="0"
        className={styles.menuItem}
        onClick={() => handleChangeProductFilter('')}
      >
        <div>
          <span className={styles.spanMenu}>All</span>
        </div>
      </Menu.Item>
      <Menu.Divider className={styles.divider} />
      <Menu.Item
        key="1"
        className={styles.menuItem}
        onClick={() => handleChangeProductFilter('product')}
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

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: 'Credit Card',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        render: (product) => product ? `$${product.toFixed(2)}` : '$0.00',
      },
      {
        title: 'Gift Card',
        dataIndex: 'gift_card_amount',
        key: 'gift_card_amount',
        align: 'center',
        render: (product) => product ? `$${product.toFixed(2)}` : '$0.00',
      },
      {
        title: 'Promo Code ',
        dataIndex: 'promo_code_amount',
        key: 'promo_code_amount',
        align: 'center',
        render: (product) => product ? `$${product.toFixed(2)}` : '$0.00',
      }
    ];

    return (
      <Table
        rowKey={record => record.purchase_id}
        rowClassName={styles.row}
        columns={columns}
        pagination={false}
        loading={loading}
        dataSource={[record]}
      />
    );
  };

  const columns = [
    {
      title: 'Date sold',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (product, record) => parseTimeZone(record?.createdAt, timezone),
    },
    {
      title: 'No.',
      dataIndex: 'orderNo',
      key: 'orderNo',
      align: 'center',
      render: (product, record) => record?.id,
    },
    {
      title: 'Type',
      dataIndex: 'prod_type',
      key: 'prod_type',    
      align: 'center',
      render: (product, record) => record?.product_type === 'product' ? 'Physical' : 'Webinar',
    },
    {
      title: 'Name',
      dataIndex: 'prod_name',
      key: 'prod_name',    
      align: 'center',
      render: (product, record) => record?.product_type === 'product' ? record?.physical_product_name : record?.webinar_name,
    },
    {
      title: 'Seat No.',
      dataIndex: 'seat_no',
      key: 'seat_no',    
      align: 'center',
      render: (product, record) => record?.product_type === 'webinar' && record?.seatsNo+1,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',    
      align: 'center',
      render: (product, record) => record && `$${record.price.toFixed(2)}`,
    },
    {
      title: 'FFL',
      dataIndex: 'ffl',
      key: 'ffl',    
      align: 'center',
      render: (product, record) => record?.ffl_name,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',    
      align: 'center',
      render: (product, record) => record?.orderStatus,
    },
    {
      title: 'User name',
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'center',
      render: (product, record) => record?.user_name,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'emal',
      align: 'center',
      render: (product, record) => record?.user_email,
    },
    {
      title: 'Refund',
      dataIndex: 'refund',
      key: 'refund',
      key: 'updatedAt',
      align: 'center',
      render: (product, record) => record?.product_type === 'webinar' && (
        <button
          className={clsx(
            styles.btn,
            (record?.orderStatus === 'Refund' || !accessRefund) && styles.btnGreyed,
          )}
          disabled={record?.orderStatus === 'Refund' || !accessRefund}
          onClick={() => refundSeatFunc(record.webinar_id, record.seatsNo)}
        >
          Refund
        </button>
      ),
    },
  ];
  return (
    <div className={styles.container}>
      {seatRefund.showModal
      && ReactDom.createPortal(
        <RefundModal
          disabled={loading}
          handleGiftRefund={handleGiftRefund}
          handlePaymentRefund={handlePaymentRefund}
          close={() => setSeatRefund({...seatRefund, showModal: false})}
        />, modalRoot,
      )}
      <PageHeaderWithButton
        title='Order History'
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
        </div>
      </div>
      <Filter
        change={param => changeFilterObj(param)}
        total={totalCount}
        search
      />
      <Table
        rowKey={record => record.purchase_id}
        dataSource={products}
        rowClassName={styles.row}
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
          onExpand: (expanded, record) => {
            record.expanded = expanded;
          },
        }}
        columns={columns}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default withAuth(withPermissionChecking(OrderHistory));
