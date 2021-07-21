import { Select, Switch, Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';

import * as styles from './index.module.scss';
import { updateSettingInfoRequest } from '../../redux/setting/settingActions';
import { settingsSelector } from '../../redux/setting/Selectors';

const SwitchWithTextRaw = ({
  title, text, switchMethod, checked, loading, terms, isTimezoneSettings,disabled
}) => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const [newTerms, setTerms] = useState('Type here ...');
  const settings = useSelector(settingsSelector)?.settingInfo;

  const timezoneList = moment.tz.names();
  useEffect(() => {
    if (terms) {
      setTerms(terms);
    }
    // eslint-disable-next-lines
  }, [terms]);
  const handleTimeZone = (timezone) => {
    dispatch(updateSettingInfoRequest({ time_zone: timezone }));
  };
  const handleTermsUpdate = useCallback(() => {
    if (!newTerms) {

    } else {
      dispatch(updateSettingInfoRequest({ terms: newTerms }));
    }
  }, [newTerms, terms]);


  const handleClick = useCallback(() => {
    const resp = {};

    if (!switchMethod) {
      return;
    }
    if (switchMethod === 'commentsOption') {
      resp.commentsOption = !checked;
    }
    if (switchMethod === 'hide_comments') {
      resp.hide_comments = !checked;
    }
    dispatch(updateSettingInfoRequest(resp));
  }, [checked, dispatch, switchMethod]);
  const handleChange = useCallback((e) => {
    console.log('handleChange---',e.target.value);
    setTerms(e.target.value);
  }, [setTerms]);

  return (
    <>
      <div className={styles.commonCont}>
        <div className={styles.cont}>
          <div className={styles.textCont}>
            <span className={styles.spanTitle}>{title}</span>
            <span className={styles.spanText}>{text}</span>
          </div>
          {isTimezoneSettings && (
            <Select
              disabled={disabled}
              showSearch
              loading={loading}
              onChange={handleTimeZone}
              className={styles.select}
              defaultValue={settings?.time_zone ? settings?.time_zone : 'Choose time zone'}
            >
              {
                timezoneList.map((item, idx) => (
                  <Option className={styles.menuItem} key={item.idx} value={item}>
                    <div className={styles.menuItemCont}>
                      <span className={styles.spanMenu}>{item}</span>
                    </div>
                  </Option>
                ))
              }
            </Select>
          )}
          {title !== 'Terms and Conditions Management' && switchMethod
          && <Switch
            loading={loading}
            className={styles.switch}
            checked={checked}
            onClick={handleClick}
            disabled={disabled}
          />}
        </div>
        {title === 'Terms and Conditions Management'
        && <textarea
          value={newTerms}
          onChange={(e) => handleChange(e)}
          className={styles.textArea}
          disabled={disabled}
        />}
      </div>
      {title === 'Terms and Conditions Management' && (
        !disabled && <Button
        loading={loading}
        className={styles.btn}
        onClick={handleTermsUpdate}
        >
        UPDATE
        </Button>

      )}
    </>
  );
};
export default SwitchWithTextRaw;
