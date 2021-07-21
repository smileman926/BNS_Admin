import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthService from '../services/AuthService';
import routers from '../../router';

const withAuth = (WrappedComponent) => ({ ...props }) => {
  const [comp, setComp] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    AuthService.isAuthUser().then((res) => {
      if (!res) AuthService.logOut();
      setComp(
        res && user ? (
          <WrappedComponent {...props} />
        ) : (
          <Redirect to={routers.login.path} />
        ),
      );
    });
    // eslint-disable-next-line
  }, [ user]);

  return comp;
};

export default withAuth;
