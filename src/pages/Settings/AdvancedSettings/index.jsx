import { Col, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as styles from '../index.module.scss';
import SocialLink from '../../../components/SocialLink';
import ContactUs from '../../../components/ContactUs';
import { updateSettingInfoRequest } from '../../../redux/setting/settingActions';
import BackgroundSettings from '../BackgroundSettings';
import ColorSettings from '../ColorSettings';
import { rolesSelector } from '../../../redux/roles/Selectors';

const AdvancedSettings = () => {
  const dispatch = useDispatch();
  const settingInfo = useSelector((state) => state.setting.settingInfo);
  const isLoad = useSelector((state) => state.setting.isLoad);
  const [edit, setEdit] = useState(false);
  const permissions = useSelector(rolesSelector);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'settingsEdit'));
  }, [permissions]);

  const updateSetting = (params) => {
    dispatch(updateSettingInfoRequest(params));
  };
  return (
    <Col className={styles.wrapper}>
      <h2 className={styles.title}>Advance Settings</h2>
      <Divider />
      <SocialLink
        facebook_media_links={settingInfo.facebook_media_links}
        instagram_media_links={settingInfo.instagram_media_links}
        isLoad={isLoad}
        onSave={updateSetting}
        disabled={!edit}
      />
      <Divider />
      <ContactUs
        disabled={!edit}
        content={settingInfo.contact_us_page_info}
        email={settingInfo.contact_us_email_address}
        isLoad={isLoad}
        onSave={updateSetting}
      />
      <BackgroundSettings
      disabled={!edit}
      />
      <ColorSettings title='Change header color' text='Allow the admin to change the color of header bar' type='header'  disabled={!edit} isLoading={isLoad}/>
      <ColorSettings title='Change footer color' text='Allow the admin to change the color of footer bar' type='footer'  disabled={!edit} isLoading={isLoad}/>
    </Col>
  );
};

export default AdvancedSettings;
