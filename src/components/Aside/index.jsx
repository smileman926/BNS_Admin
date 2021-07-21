import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { checkPermission } from '../../helpers/permissionChecker';
import { rolesSelector } from '../../redux/roles/Selectors';
import router from '../../router';
import Dot from '../Dot/Dot';
import AuthService from './../../utils/services/AuthService';
import * as style from './index.module.scss';

function Aside() {
  const permissions = useSelector(rolesSelector);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const history = useHistory();
  const [isProductDropdown, setProductDropdown] = useState(false);
  const [showDrop, setShowDrop] = useState(
    history.location.pathname.includes('product-management'),
  );

  const [showUser, setShowUser] = useState(history.location.pathname.includes('user-management'));

  const handlerDropDown = useCallback(() => setShowDrop(!showDrop), [showDrop]);
  const handlerDropUsers = useCallback(() => setShowUser(!showUser), [showUser]);

  const handleDropdownProductClick = useCallback(() => {
    setProductDropdown(!isProductDropdown);
  }, [isProductDropdown]);

  const logOut = () => {
    AuthService.logOut().then(() => {
      history.push('/login');
    });
  };

  return (
    isLogin && (
      <aside className={style.aside}>
        <div className={style.menu}>
          {checkPermission(router.dashboard.path, permissions) && (
            <NavLink
              to={router.dashboard.path}
              className={style.menuLink}
              exact
              activeClassName={style.selectedItemLink}
            >
              Dashboard
            </NavLink>
          )}
          <div className={style.dropDown}>
            <button
              type="button"
              className={clsx(style.btnDrop, showDrop ? style.open : null)}
              onClick={handlerDropDown}
            >
              Product Management
              {showDrop ? <MinusCircleOutlined className={style.icon} /> : <PlusCircleOutlined />}
            </button>
            {showDrop && (
              <div className={style.dropMenu}>
                {checkPermission(router.categories.path, permissions) && (
                  <NavLink
                    to={router.categories.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Categories
                  </NavLink>
                )}
                {(permissions?.includes('productView') ||
                  permissions?.includes('webinarQueueView')) && (
                  <div
                    className={clsx(
                      isProductDropdown ? style.subSelectItemLink : style.subItemLink,
                      style.productLink,
                    )}
                  >
                    <div
                      onClick={handleDropdownProductClick}
                      className={style.linkDiv}
                      role="presentation"
                    >
                      <img
                        alt=""
                        className={clsx(style.arrowIcon, isProductDropdown && style.arrowActive)}
                        src="/assets/icons/arrow_right.svg"
                      />
                      Products
                    </div>
                    {isProductDropdown && (
                      <div>
                        {checkPermission(router.productListingOptions.path, permissions) && (
                          <NavLink
                            to={router.productListingOptions.path}
                            className={style.subItemLink}
                            activeClassName={style.subSelectItemLink}
                          >
                            <Dot />
                            <span>Product Listing</span>
                          </NavLink>
                        )}
                        {checkPermission(router.webinarQueues.path, permissions) && (
                          <NavLink
                            to={router.webinarQueues.path}
                            className={style.subItemLink}
                            activeClassName={style.subSelectItemLink}
                          >
                            <Dot /> <span>Webinar Queues</span>
                          </NavLink>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {checkPermission(router.soldOutWebinars.path, permissions) && (
                  <NavLink
                    to={router.soldOutWebinars.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Sold out webinars
                  </NavLink>
                )}
                {checkPermission(router.soldPhysicalProducts.path, permissions) && (
                  <NavLink
                    to={router.soldPhysicalProducts.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Sold Physical Products
                  </NavLink>
                )}                
                {checkPermission(router.fflDb.path, permissions) && (
                  <NavLink
                    to={router.fflDb.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    FFL database
                  </NavLink>
                )}
                {checkPermission(router.giftCards.path, permissions) && (
                  <NavLink
                    to={router.giftCards.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Gift Cards
                  </NavLink>
                )}
                {checkPermission(router.promoCodes.path, permissions) && (
                  <NavLink
                    to={router.promoCodes.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Promo codes
                  </NavLink>
                )}
                {checkPermission(router.completedWebinars.path, permissions) && (
                  <NavLink
                    to={router.completedWebinars.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Completed Webinars
                  </NavLink>
                )}
                {checkPermission(router.orderHistory.path, permissions) && (
                  <NavLink
                    to={router.orderHistory.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Order History
                  </NavLink>
                )}
              </div>
            )}
          </div>
          <div className={style.dropDown}>
            <button
              type="button"
              className={clsx(style.btnDrop, showUser ? style.open : null)}
              onClick={handlerDropUsers}
            >
              Users Management
              {showUser ? <MinusCircleOutlined className={style.icon} /> : <PlusCircleOutlined />}
            </button>
            {showUser && (
              <div className={style.dropMenu}>
                {checkPermission(router.userManagement.path, permissions) && (
                  <NavLink
                    to={router.userManagement.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Users
                  </NavLink>
                )}
                {checkPermission(router.roles.path, permissions) && (
                  <NavLink
                    to={router.roles.path}
                    className={style.subItemLink}
                    activeClassName={style.subSelectItemLink}
                  >
                    <img alt="" src="/assets/icons/arrow_right.svg" />
                    Roles
                  </NavLink>
                )}
              </div>
            )}
          </div>
          {checkPermission(router.faq.path, permissions) && (
            <NavLink
              to={router.faq.path}
              className={style.menuLink}
              activeClassName={style.selectedItemLink}
            >
              FAQ
            </NavLink>
          )}
          {checkPermission(router.setting.path, permissions) && (
            <NavLink
              to={router.setting.path}
              className={style.menuLink}
              activeClassName={style.selectedItemLink}
            >
              Settings
            </NavLink>
          )}
          <button onClick={logOut} className={style.menuLink}>
            Log Out
          </button>
        </div>
      </aside>
    )
  );
}

export default Aside;
