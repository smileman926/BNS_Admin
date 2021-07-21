import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Switch, } from 'react-router-dom';
import router from '../router';
import 'antd/dist/antd.css';
import '../style/common.scss';
import { getSettingInfoRequest } from '../redux/setting/settingActions';

const pages = Object.values(router);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSettingInfoRequest());
    // eslint-disable-next-line
  }, []);
  return (
    <div className='bns-container'>
      <Switch>
        {pages.map((page) => <Route {...page} key={Math.random()} />)}
        <Redirect to='/' />
      </Switch>
    </div>
  );
}

export default App;
