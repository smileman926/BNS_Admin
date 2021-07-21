import { DeleteOutlined } from '@ant-design/icons';
import { Button, notification, Switch, Table } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Filter from '../../components/Filter';
import { PencilIcon } from '../../helpers/customIcon';
import {
  apiGetUsersManagement,
  apiUpdateUsersManagement,
  apiDelUsersManagement,
} from '../../utils/api/api';
import * as style from './UserManagement.module.scss';
import router from '../../router';
import PageHeaderWithButton from '../../components/PageHeaderWithButton';
import withAuth from '../../utils/HOC/withAuth';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { useSelector } from 'react-redux';
import { rolesSelector } from '../../redux/roles/Selectors';
import RenderGiftBalance from './RenderGiftEdit/RenderGiftBalance';

const { Column } = Table;

function UserManagement() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(null);
  const history = useHistory();
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);
  const [deletePermission, setDeletePermission] = useState(false);
  const [createAdmin, setCreateAdmin] = useState(false);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'usersEdit'));
    setDeletePermission(permissions?.some((item) => item === 'usersDelete'));
    setCreateAdmin(permissions?.some((item) => item === 'userCreate'));
  }, [permissions]);
  useEffect(() => {
    setLoading(true);
    if (filter) {
      console.log(filter);
      filter.query_search = filter.filterString; 
      apiGetUsersManagement(filter)
        .then((res) => {
          setLoading(false);
          setList(res);
        })
        .catch((err) => {
          setLoading(false);
          notification.error({
            message: err.message,
          });
        });
    }
  }, [filter]);

  // const deleteUser = (id) => {
  //   setLoading(true);
  //   apiDelUsersManagement(id)
  //     .then(() => {
  //       setFilter({ ...filter });
  //       notification.success({
  //         message: 'Deleted',
  //       });
  //     })
  //     .catch((err) => {
  //       notification.error({
  //         message: err.message,
  //       });
  //     });
  // };

  const disabledUser = ({ auth_banned, id }) => {
    setLoading(true);
    apiUpdateUsersManagement({ auth_banned: !auth_banned, id })
      .then(() => {
        notification.success({
          message: 'Saved',
        });
        setFilter({ ...filter });
      })
      .catch((err) => {
        setLoading(err);
        notification.error({
          message: err.message,
        });
      });
  };

  return (
    <div className={style.box}>
      <PageHeaderWithButton
        title="User Management"
        buttonTitle={createAdmin ? "Create Admin" : null}
        clickHandler={() => history.push(router.createAdmin.path)}
      />
      <div className={clsx('box', style.container)}>
        <Filter change={setFilter} total={list.count} search/>
        <Table
          dataSource={list.rows}
          loading={loading}
          title={false}
          pagination={false}
          rowKey={(record) => record.id}
        >
          <Column title="Name" dataIndex="username" />
          <Column title="Address" dataIndex="address" />
          <Column title="Phone" dataIndex="phone_number" />
          <Column title="Email" dataIndex="email" />
          <Column title="Role" dataIndex={["role", "name"]} />
          <Column
            title="Gift Balance"
            dataIndex="gift_amount"
            align="center"
            render={(value, record) => <RenderGiftBalance balance={value} userID={record?.id} />}
          />
          <Column
            title="Edit"
            dataIndex="id"
            align="center"
            render={(value, record) => (
              <Link to={{ pathname: router.userInformation.path, state: record }}>
                <PencilIcon className={style.editIcon} />
              </Link>
            )}
          />
          <Column
            title="Disabled/Enabled"
            align="center"
            dataIndex="auth_banned"
            render={(current, { id }) => {
              return (
                <Switch
                  disabled={!edit}
                  size="medium"
                  checked={!current}
                  onChange={(auth_banned) => disabledUser({ auth_banned, id })}
                />
              );
            }}
          />
          {/* {deletePermission && <Column
            title="Delete"
            dataIndex="id"
            render={(value) => (
              <Button
                className={style.delBtn}
                icon={<DeleteOutlined style={{ fontSize: '24px' }}/>}
                onClick={() => deleteUser(value)}
              />
            )}
          />
          } */}
        </Table>
      </div>
    </div>
  );
}

export default withAuth(withPermissionChecking(UserManagement));
