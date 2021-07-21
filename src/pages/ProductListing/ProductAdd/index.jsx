import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Route, useParams } from 'react-router-dom';
import GiftCardIcon from '../../../assets/iconsComponents/GiftCardIcon';
import GunIcon from '../../../assets/iconsComponents/GunIcon';
import WebinarIcon from '../../../assets/iconsComponents/WebinarIcon';
import PageHeaderWithButton from '../../../components/PageHeaderWithButton';
import { getCategoriesRequest } from '../../../redux/categories/categoriesActions';
import withAuth from '../../../utils/HOC/withAuth';
import withPermissionChecking from '../../../utils/HOC/withPermissionsChecking';
import GiftCardWebinar from './fragments/GiftCardWebinar';
import PhysicalProduct from './fragments/PhysicalProduct';
import WebinarProduct from './fragments/Webinar';
import WebinarSeatWebinar from './fragments/WebinarSeatWebinar';
import styles from './index.module.scss';
const productTypes = [
  {
    path: 'physical_product',
    component: PhysicalProduct,
    title: 'New Product',
  },
  {
    path: 'webinar',
    component: WebinarProduct,
    title: 'New Webinar',
    Icon: WebinarIcon,
  },
  { path: 'gift_card_webinar',
    component: GiftCardWebinar,
    title: 'Gift Card Webinar',
    Icon: GiftCardIcon
  },
  {
    path: 'webinar_seat',
    component: WebinarSeatWebinar,
    title: 'Mini',
    Icon: WebinarIcon
  },
];

const ProductAdd = ({ match, history }) => {
  const { product_type } = useParams();
  const selectedType = useMemo(() => {
    return productTypes.find(({ path }) => path === product_type)
  }, [product_type]);

  const menuItems = useMemo(() => {
    const items = productTypes.filter(({ path }) => path !== selectedType.path && path !== 'physical_product');
    return <Menu>
      {items.map(({ title, path, Icon }) => (<Menu.Item key={path}>
        <div className={styles.menuItemCont} onClick={() => history.push(match.path.replace(':product_type', path))}>
          <Icon width={20} height={20} color='#5c5c5c' />
          <span className={styles.spanMenu}>{title}</span>
        </div>
      </Menu.Item>))}
    </Menu>
  }, [selectedType]);

  const selectedWebinar = useMemo(() => {
    const { title, Icon } = selectedType.path !== 'physical_product' && selectedType || productTypes[1];
    return <div className={styles.menuItemCont}>
              <Icon width={20} height={20}/>
              <span className={styles.spanMenu}>{title}</span>
            </div>;
  }, [selectedType]);


  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(getCategoriesRequest());
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <PageHeaderWithButton title={`Add ${selectedType.title}`} />
        <div className={styles.productTypeCont}>
          <div className={clsx(styles.newProductBtn, selectedType.path !== 'physical_product' && styles.active)}>
            <Dropdown overlay={menuItems} trigger={['click']} className={styles.menu}>
              <a onClick={(e) => e.preventDefault()}>
                {selectedWebinar}
                <DownOutlined />
              </a>
            </Dropdown>
          </div>
          <button
            className={clsx(styles.newProductBtn, selectedType.path === 'physical_product' && styles.active)}
            onClick={() => history.push(match.path.replace(':product_type', 'physical_product'))}
          >
            <GunIcon height={20} width={20} />
            Add New Product
          </button>
        </div>
      </div>

      {productTypes.map(({path, component}) =>
        <Route key={path} exact path={match.path.replace(':product_type',path)} component={component}/>
        )
      }
    </div>
  );
};

export default withAuth(withPermissionChecking(ProductAdd));
