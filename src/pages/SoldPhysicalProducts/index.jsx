import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Table } from 'antd';
import { getSoldPhysicalProducts, updateSoldPhysicalFFl } from '../../redux/SoldPhysicalProducts/Actions';
import { soldPhysicalProductsSelector } from '../../redux/SoldPhysicalProducts/Selectors';
import styles from './index.module.scss';
import ImageDownload from '../../components/ImageDownload';
import PageHeaderWithButton from '../../components/PageHeaderWithButton';
import Filter from '../../components/Filter';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import { settingsSelector } from '../../redux/setting/Selectors';
import withAuth from '../../utils/HOC/withAuth';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';
import { useHistory } from 'react-router-dom';
import router from '../../router';

const SoldPhysicalProducts = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const productsData = useSelector(soldPhysicalProductsSelector);
  const ffls = productsData?.list.ffl_data;
  const products = productsData?.list?.rows;
  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;
  const loading = productsData?.loading;
  const [id, setId] = useState('');
  const { Option } = Select;
  // const [disabled, setDisabled] = useState(false);
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'soldOutPhysicalEdit'));
  }, [permissions]);



  const handleFFLClick = (ffl) => {
    // setDisabled(true);
    dispatch(updateSoldPhysicalFFl({
      purchase_id: id,
      ffl_id: ffl === 'non-ffl' ? null : ffl,
    }));
  };

  const expandedRowRender = (record) => {
    console.log(record);
    const columns = [
      {
        title: 'Name',
        dataIndex: 'username',
        key: 'username',
        render: (product) => product?.slice(0, 30),
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: (product) => product?.slice(0, 30),
      },
      {
        title: 'Phone ',
        dataIndex: 'phone_number',
        key: 'phone_number',
        render: (product) => product?.slice(0, 30),
      }, {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (product) => product?.slice(0, 30),
      },

    ];

    return (
      <Table
        rowClassName={styles.row}
        columns={columns}
        pagination={false}
        loading={loading}
        dataSource={[record.buyer]}
      />
    );
  };

  const handleDuplicate = useCallback(
    (product) => {
      history.push(router.editProduct.path, {
        id: product?.productID,
        type: 'physical',
        duplicate: true
      });
    },
    [dispatch, history],
  );

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'main_image',
      key: 'main_image',
      render: (product, record) => <ImageDownload src={record?.productInfo?.main_image?.image_url} />,
    },
    {
      title: 'Name',
      dataIndex: 'product_Info',
      key: 'product_name',
      render: (product, record) => record?.productInfo?.productName.slice(0, 20),
    },
    {
      title: 'Buyer`s name',
      dataIndex: 'buyer',
      key: 'shortDescription',
      render: ((product, record) => record?.buyer?.username?.slice(0, 30)),
    },
    {
      title: 'Date sold',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (product) => parseTimeZone(product, timezone),
    },
    {
      title: 'FFL',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (product, record) => (
        <Select
          bordered={false}
          disabled={!edit}
          className={styles.Select}
          onChange={handleFFLClick}
          defaultValue={record.ffl_database?.ffl_name ? record.ffl_database?.ffl_name : 'Choose FFL'}
        >
          { ffls?.map((item) => (
            <Option className={styles.menuItem} key={item.id} value={item.id}>
              <div className={styles.menuItemCont}>
                <span className={styles.spanMenu}>{item.ffl_name.slice(0, 20)}</span>
              </div>
            </Option>
          ))}
          <Option className={styles.menuItem} value={"non-ffl"}>
              <div className={styles.menuItemCont}>
                <span className={styles.spanMenu}>non-FFL</span>
              </div>
          </Option>
        </Select>
      ),
    },
    {
      title: 'Duplicate',
      dataIndex: 'duplicate',
      key: 'duplicate',
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
        title='Sold Physical Products'
      />
      <Filter
        change={(param) => dispatch(getSoldPhysicalProducts(param))}
        total={productsData?.list?.count}
        search
      />
      <Table
        onRow={(record) => ({
          onMouseEnter: (event) => { setId(record.id); },
          onMouseLeave: (event) => { setId(''); },
        })}
        rowKey='id'
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

export default withAuth(withPermissionChecking(SoldPhysicalProducts));
