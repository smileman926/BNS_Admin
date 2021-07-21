import { BellOutlined } from '@ant-design/icons';
import { Badge, Popover } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import ImageDownload from '../ImageDownload';
import { getNotifyRequests } from '../../redux/notification/notificationActions';
import router from '../../router';
import * as style from './Header.module.scss';

function Header() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);

  const location = useLocation();

  const list = useSelector((state) => state.notify.list);

  useEffect(() => {
    if (isLogin) {
      dispatch(getNotifyRequests());
    }
  }, [isLogin, location.pathname]);

  const typeNotify = (type) => {
    switch (type) {
      case 'sold_out':
        return 'has been sold out';
      case 'unused_promo_code':
        return 'promotional codes were not used for this selection';
      case 'promo_code_sold_out':
        return 'promo code can not be generated because the prize is sold out';
      default:
        return '';
    }
  };

  return (
    <header className={style.header}>
      <div className={style.logo_wrp}>
        <img src={logo} alt='logo' />
      </div>
      <div>
        {isLogin && (
          <Badge count={list.length}>
            <Popover
              placement='bottom'
              title={<h4 className={style.title}>Notification</h4>}
              content={(
                <div className={style.content}>
                  <div className={style.list}>
                    {list
                      && list.length > 0
                      && list.map((item) => (
                        <div className={style.row} key={item.id}>
                          <ImageDownload
                            className={style.img}
                            src={item.product_image}
                            color='#000'
                          />
                          <p className={style.name}>
                            <strong className={style.product}>{item.product_name}</strong>
                            {typeNotify(item.service_type)}
                          </p>
                        </div>
                      ))}
                  </div>
                  {list && list.length === 0 && (
                    <h4 className={style.subtitle}>Notification not found</h4>
                  )}
                  <Link className={style.link} to={router.soldOutWebinarsAlerts.path}>
                    View All Notifications
                  </Link>
                </div>
              )}
              trigger='click'
            >
              <BellOutlined style={{ fontSize: '30px' }} />
            </Popover>
          </Badge>
        )}
      </div>
    </header>
  );
}

export default Header;
