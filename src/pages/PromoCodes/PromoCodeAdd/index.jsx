import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import clsx from 'clsx';
import { Dropdown, Menu, DatePicker, notification, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styles from './index.module.scss';
import PageHeaderWithButton from '../../../components/PageHeaderWithButton';
import { getProducts } from '../../../redux/products/Actions';
import { productsSelector } from '../../../redux/products/Selectors';
import router from '../../../router';
import withAuth from '../../../utils/HOC/withAuth';
import { parseFromTimeZone } from 'date-fns-timezone';
import { settingsSelector } from '../../../redux/setting/Selectors';
import withPermissionChecking from '../../../utils/HOC/withPermissionsChecking';
import { apiSavePromoCode } from "../../../utils/api/api";
import { getCategoriesRequest } from '../../../redux/categories/categoriesActions';

const { Option } = Select;

const PromoCodeAdd = () => {
  const [amount, setAmount] = useState();
  const [code, setCode] = useState();
  const [numberOfUses, setNumberOfUses] = useState();
  const [product, setProduct] = useState();
  const [priceType, setPriceType] = useState('cost');
  const [productType, setProductType] = useState('physical');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(false);
  const products = useSelector(productsSelector)?.list?.rows;
  const dispatch = useDispatch();
  const history = useHistory();
  const timezone = useSelector(settingsSelector)?.settingInfo?.time_zone;
  const categories = useSelector((state) => state.categories.list);
  const [bannedCategories, setBannedCategories] = useState([]);

  useEffect(() => {
    dispatch(getProducts({ offset: 0, filter: productType }));
    dispatch(getCategoriesRequest({filterString: ""}));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (code && amount && numberOfUses && priceType && productType && startDate && endDate) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [code, amount, numberOfUses, priceType, productType, startDate, endDate]);
  const date_from = useMemo(() => {
    return startDate ? parseFromTimeZone(startDate, { timeZone: timezone }).toISOString() : null;
  }, [startDate]);

  const date_to = useMemo(() => {
    return endDate ? parseFromTimeZone(endDate, { timeZone: timezone }).toISOString() : null;
  }, [endDate]);

  const handleStartDate = useCallback(
    (date) => {
      if (date) {
        const d = date.unix() === moment().unix() ? moment(date).tz(timezone) : date;
        const newDate = new Date(
          d.year(),
          d.month(),
          d.date(),
          d.hours(),
          d.minutes(),
          d.seconds(),
          d.milliseconds(),
        );
        return setStartDate(moment(newDate));
      }
      setStartDate(date);
    },
    [startDate, timezone],
  );
  const handleEndDate = useCallback(
    (date) => {
      if (date) {
        const d = date.unix() === moment().unix() ? moment(date).tz(timezone) : date;
        const newDate = new Date(
          d.year(),
          d.month(),
          d.date(),
          d.hours(),
          d.minutes(),
          d.seconds(),
          d.milliseconds(),
        );
        return setEndDate(moment(newDate));
      }
      setEndDate(date);
    },
    [endDate, timezone],
  );
  const getProductsFilteredByProductType = useCallback(
    (type) => {
      dispatch(getProducts({ offset: 0, filter: type }));
    },
    [dispatch],
  );

  const handlePriceType = useCallback((type) => {
    setPriceType(type);
    setAmount(0);
  }, []);
  const handleProductType = useCallback((type) => {
    setProductType(type);
  }, []);
  const handleAmountChange = useCallback(
    (e) => {
      if (priceType === 'cost') {
        if (e.target.value.length > 6) {
          return;
        }
      } else if (priceType === 'percent') {
        if (e.target.value > 100) {
          return;
        }
      }
      setAmount(e.target.value);
    },
    [priceType],
  );
  const handleProductId = useCallback((product) => {
    setProduct(product);
  }, []);
  const handleCode = useCallback((e) => {
    setCode(e.target.value);
  }, []);
  const handleNumberOfUsesChange = useCallback((e) => {
    setNumberOfUses(e.target.value);
  }, []);
  const handleSave = useCallback(async () => {    
    try {
      await apiSavePromoCode({
        code,
        amount,
        product_id: product?.id,
        product_type: productType,
        code_type: priceType,
        number_used: numberOfUses,
        category_ids: bannedCategories,
        date_from,
        date_to,
      });
      notification.success({
        message: 'The promo code saved successfully'
      })
      history.push(router.promoCodes.path);
    }catch (e){
      notification.error({
        message: e.response.data.message === "Validation error" ? "Code must be unique" : e.message,
      });
    }
  }, [dispatch, code, amount, productType, priceType, numberOfUses, bannedCategories, startDate, endDate, history]);

  const valueMenu = (
    <Menu>
      <Menu.Item key="0">
        <div className={styles.menuItemCont} onClick={() => handlePriceType('percent')}>
          <span className={styles.spanMenu}>%</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <div className={styles.menuItemCont} onClick={() => handlePriceType('cost')}>
          <span className={styles.spanMenu}>$</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );
  const productMenu = (
    <Menu className={styles.productMenu}>
      <Menu.Item
        className={styles.item}
        onClick={() => handleProductId(null)}
        onItemHover={() => void null}
        key="all"
      >
        <div className={styles.menuItemCont}>
          <span className={styles.spanMenu}>All</span>
        </div>
      </Menu.Item>
      {products?.length ? (
        products.map((item) => (
            <Menu.Item
              className={styles.item}
              key={item.id}
              onClick={() => handleProductId(item)}
              onItemHover={() => void null}
            >
              <div className={styles.menuItemCont}>
                <span className={styles.spanMenu}>{item.product_name}</span>
              </div>
            </Menu.Item>
        ))
      ) : (
        <Menu.Item key="not_found" className={styles.item} disabled={true}>No items found</Menu.Item>
      )}
    </Menu>
  );
  const productTypeMenu = (
    <Menu>
      <Menu.Item key="0" onClick={() => getProductsFilteredByProductType('physical')}>
        <div key="0" className={styles.menuItemCont} onClick={() => handleProductType('physical')}>
          <span className={styles.spanMenu}>Physical Product</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={() => getProductsFilteredByProductType('webinar')}>
        <div key="1" className={styles.menuItemCont} onClick={() => handleProductType('webinar')}>
          <span className={styles.spanMenu}>Webinar</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

  return (
    <div className={styles.container}>
      <PageHeaderWithButton title="Add New Promo Code" />
      <div className={styles.inptCont}>
        <span className={styles.span}>Code</span>
        <input
          value={code}
          onChange={(e) => handleCode(e)}
          className={styles.inpt}
          placeholder="Type code"
        />
        <div className={styles.inptGroupCont}>
          <div className={styles.inptBlockCont}>
            <span className={styles.span}>Value</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e)}
              className={styles.inpt}
              placeholder="Type amount"
            />
          </div>
          <div className={styles.inptBlockContSec}>
            <span className={styles.span}>% or $</span>
            <Dropdown overlay={valueMenu} trigger={['click']} className={styles.priceMenu}>
              <a onClick={(e) => e.preventDefault()}>
                {priceType === 'cost' ? '$' : '%'}
                <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
        <span className={styles.span}>Select type</span>
        <Dropdown overlay={productTypeMenu} trigger={['click']} className={styles.priceMenu}>
          <a onClick={(e) => e.preventDefault()}>
            {productType === 'physical' ? 'Physical Product' : 'Webinar'}
            <DownOutlined />
          </a>
        </Dropdown>
        <span className={styles.span}>Select item</span>
        <Dropdown overlay={productMenu} trigger={['click']} className={styles.priceMenu}>
          <a onClick={(e) => e.preventDefault()}>
            {product?.product_name ? product.product_name : 'All'}
            <DownOutlined />
          </a>
        </Dropdown>
        <span className={styles.span}>Categories</span>
        <Select
          mode="multiple"
          className={styles.select}
          size="large"
          placeholder="Please select"
          showArrow
          value={bannedCategories}
          onChange={(ids) => setBannedCategories(ids)}
        >
          {categories.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.category_name}
            </Option>
          ))}
        </Select>
        <div className={styles.inptGroupCont}>
          <div className={styles.inptSeats}>
            <span className={styles.span}>Maximum number of Uses</span>
            <input
              type="number"
              value={numberOfUses}
              onChange={(e) => handleNumberOfUsesChange(e)}
              className={styles.inpt}
              placeholder="Type value"
            />
          </div>
          <div className={styles.inptBlockCont}>
            <span className={styles.span}>Start Date</span>
            <DatePicker
              className={styles.inpt}
              showTime
              onChange={(date) => handleStartDate(date)}
              disabledDate={(current) =>
                (current && current < moment()) || (current && endDate ? current > endDate : false)
              }
              disabledTime={(current) =>
                (current && current < moment()) || (current && endDate ? current > endDate : false)
              }
              value={startDate}
            />
          </div>
          <div className={styles.inptBlockContSec}>
            <span className={styles.span}>End Date</span>
            <DatePicker
              disabled={!startDate}
              onChange={(date) => handleEndDate(date)}
              className={styles.inpt}
              dropdownClassName={styles.disabledBntNow}
              showTime
              value={endDate}
              disabledDate={(current) => current && current < startDate}
              disabledTime={(current) => current && current < startDate}
            />
          </div>
        </div>
        <button
          className={clsx(styles.btn, !active && styles.greyBtn)}
          disabled={!active}
          onClick={handleSave}
        >
          Save Promo Code
        </button>
      </div>
    </div>
  );
};

export default withAuth(withPermissionChecking(PromoCodeAdd));
