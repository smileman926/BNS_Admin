import { Col, Divider } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SwitchWithTextRaw from '../../../components/SwitchWithTextRaw';
import * as styles from './index.module.scss';
import { getSettingInfoRequest, updateSettingInfoRequest } from '../../../redux/setting/settingActions';
import { settingsSelector } from '../../../redux/setting/Selectors';
import { rolesSelector } from '../../../redux/roles/Selectors';

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector)?.settingInfo;
  const loading = useSelector(settingsSelector)?.isLoad;
  const [edit, setEdit] = useState(false);
  const permissions = useSelector(rolesSelector);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'settingsEdit'));
  }, [permissions]);
  return (
    <Col className={styles.wrapper}>
      <h2 className={styles.title}>General Settings</h2>
      <Divider />
      <SwitchWithTextRaw
        title='Disable User Comments'
        text='The admin can turn off user responses to comments and only allow the admin to respond'
        checked={settings?.commentsOption}
        switchMethod='commentsOption'
        loading={loading}
        disabled={!edit}
      />
      <Divider />
      <SwitchWithTextRaw
        title='Hide Comments Completely'
        text='The admin can turn off the comment system entirely site wide'
        checked={settings?.hide_comments}
        switchMethod='hide_comments'
        loading={loading}
        disabled={!edit}
      />
      <Divider />
      <SwitchWithTextRaw
        title='Time Zone '
        text='The admin can change current time zone'
        loading={loading}
        isTimezoneSettings={true}
        disabled={!edit}
      />
      <Divider />
      <SwitchWithTextRaw
        disabled={!edit}
        title='Terms and Conditions Management'
        text={'The admin can update the terms and conditions here by pasting or '
                             + 'typing into a text box the terms and conditions'}
        terms={settings?.terms}
      />

    </Col>
  );
};
export default GeneralSettings;
