import * as styles from './index.module.scss';
import { Col, Divider } from 'antd';
import SwitchWithTextRaw from '../../../components/SwitchWithTextRaw';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSettingInfoRequest } from '../../../redux/setting/settingActions';
import { settingsSelector } from '../../../redux/setting/Selectors';
import CheckColorCircle from '../../../components/CheckColorCircle';

const ColorSettings = ({ title , text, type, disabled, isLoading}) => {
 const dispatch = useDispatch();
 const settings = useSelector(settingsSelector)?.settingInfo;
 const loading  = useSelector(settingsSelector)?.isLoad;
 return (
      <>
          <Divider/>
          <SwitchWithTextRaw
            title={title}
            text={text}
          />
          {
            disabled ? <h5 className="text-white">Not allowed to change color.</h5>
            :
            <CheckColorCircle type={type} isLoad={isLoading}/>
          }
          
      </>
    );
}
export default ColorSettings;

