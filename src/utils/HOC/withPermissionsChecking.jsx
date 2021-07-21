import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { checkPermission } from '../../helpers/permissionChecker';
import { rolesSelector } from '../../redux/roles/Selectors';
import router from '../../router';

const withPermissionChecking = (WrappedComponent) => ({ ...props }) => {
  const [comp, setComp] = useState(null);
  const permissions = useSelector(rolesSelector);

  const zeroPath = Object.values(router).find(({ permission }) => permissions?.includes(permission))?.path;
  const res = checkPermission(props.match.path, permissions);

  useEffect(() => {
    if (res) {
      setComp(<WrappedComponent {...props} />);
    } else {
      setComp(<Redirect to={zeroPath} />);
    }
  }, [permissions, res]);

  return comp;
};

export default withPermissionChecking;
