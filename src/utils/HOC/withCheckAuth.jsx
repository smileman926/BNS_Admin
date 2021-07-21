import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthService from '../services/AuthService';

const withCheckAuth = (WrappedComponent) => ({ ...props }) => {
  const [comp, setComp] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    AuthService.isAuthUser().then((res) => {
      if (!res) AuthService.logOut();
      setComp(
        res && user ? (
          <Redirect to='/' />
        ) : (
          <WrappedComponent {...props} />
        ),
      );
    });
    // eslint-disable-next-line
  }, [ user]);

  return comp;
};

export default withCheckAuth;
