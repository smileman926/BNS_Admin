import React from 'react';

import withAuth from '../../utils/HOC/withAuth';
import GeneralSettings from './GeneralSettings';
import AdvancedSettings from './AdvancedSettings';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';

const Settings = () => {

  return (
    <>
      <GeneralSettings />
      <AdvancedSettings />
    </>
  );
}

export default withAuth(withPermissionChecking(Settings));
