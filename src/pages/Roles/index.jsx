import { Button, notification, Table } from 'antd';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import { rolesSelector } from '../../redux/roles/Selectors';
import router from '../../router';
import { apiGetPermissions, apiUpdateRole } from '../../utils/api/api';
import withAuth from '../../utils/HOC/withAuth';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { getRoles } from './../../redux/roles/Actions';
import styles, * as style from './index.module.scss';
import { xor } from 'lodash';
import AuthService from '../../utils/services/AuthService';
import Filter from '../../components/Filter';

const { Column } = Table;

function RoleDetails({ item, permissionsAll, dispatch }) {
  const [loading, setLoading] = useState(false);
  const [selectPermissions, setSelectPermissions] = useState(
    item?.permissions?.map(({ id }) => id),
  );

    const [edit, setEdit] = useState(false);
    const permissions = useSelector(rolesSelector);
    useEffect(() => {
      setEdit(permissions?.some((item) => item === 'rolesEdit'));
    }, [permissions]);

  const userRoleID = useSelector((state) => state.auth.user)?.role_id;

  const updateRole = useCallback(() => {
    const body = {
      permissionIds: selectPermissions,
    };

    const { id } = item;
    setLoading(true);
    apiUpdateRole(id, body)
      .then((res) => {
        notification.success({
          message: 'Saved',
        });
        if (userRoleID === item.id) {
          AuthService.logOut();
        }
        dispatch(getRoles({filterString: ""}));
      })
      .catch((err) => {
        notification.error({
          message: err.response?.data?.message || err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectPermissions]);

  const newValue = useMemo(() => {
    return (
      selectPermissions.length === item.permissions.length &&
      selectPermissions.every((el) => item.permissions.map(({ id }) => id).includes(el))
    );
  }, [selectPermissions, item]);

  const changeSelect = useCallback(
    (newSelects) => {
      const id = xor(newSelects, selectPermissions);
      if (newSelects.length > selectPermissions.length) {
        const currentItem = permissionsAll.find((el) => el.id === id[0]);
        if (currentItem.name.includes('View')) {
          if (currentItem.name === 'seatsRefundView') {
            newSelects.push(permissionsAll.find((el) => el.name === 'productView').id);
          }
        } else if (currentItem.name.includes('Edit')) {
          const parent = permissionsAll.find(
            (el) => el.name === currentItem.name.replace('Edit', 'View'),
          );
          if (!newSelects.includes(parent.id)) {
            newSelects.push(parent.id);
            setSelectPermissions(newSelects);
          }
        } else if (currentItem.name.includes('Delete')) {
          const parent = permissionsAll.find(
            (el) => el.name === currentItem.name.replace('Delete', 'View'),
          );
          if (!newSelects.includes(parent.id)) {
            newSelects.push(parent.id);
          }
        } else if (currentItem.name.includes('Create')) {
          const parent = permissionsAll.find(
            (el) => el.name === currentItem.name.replace('Create', 'sView'),
          );
          if (!newSelects.includes(parent.id)) {
            newSelects.push(parent.id);
          }
          setSelectPermissions(newSelects);
        }
      } else {
        const currentItem = permissionsAll.find((el) => el.id === id[0]);
        if (currentItem.name.includes('View')) {
          const ids = permissionsAll
            .filter(
              ({ name }) =>
                name.includes(currentItem.name.replace('View', 'Edit')) ||
                name.includes(currentItem.name.replace('View', 'Create')) ||
                name.includes(currentItem.name.replace('View', 'Delete')) ||
                name.includes(currentItem.name.replace('sView', 'Create')),
            )
            .map((el) => el.id);
          ids.push(item);
          if (currentItem.name === 'productView') {
            ids.push(permissionsAll.find((el) => el.name === 'seatsRefundView').id);
          }
          newSelects = newSelects.filter((el) => !ids.includes(el));
        }
      }
      setSelectPermissions(newSelects);
    },
    [selectPermissions, setSelectPermissions],
  );

  return (
    <Table
      pagination={false}
      dataSource={permissionsAll}
      title={() => (
        <div className={style.titleTable}>
          <h2>Permissions</h2>
          {edit && <Button type="bns" disabled={newValue} onClick={updateRole} loading={loading}>
            Update
          </Button>}
        </div>
      )}
      rowKey="id"
      rowSelection={{
        type: 'checkbox',
        onChange: changeSelect,
        selectedRowKeys: selectPermissions,
      }}
    >
      <Column dataIndex="title" title="Name" />
    </Table>
  );
}

const Roles = () => {
  const timezone = useSelector((state) => state.setting.settingInfo)?.time_zone;
  const { list, loading } = useSelector((state) => state.roles);
  const [edit, setEdit] = useState(false);
  const permissions = useSelector(rolesSelector);
  const [listAllPermissions, setListAllPermissions] = useState(null);
  const [roleFilter, setRoleFilter] = useState({filterString: ""});

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'rolesEdit'));
  }, [permissions]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoles(roleFilter));
    apiGetPermissions()
      .then((res) => {
        setListAllPermissions(res);
      })
      .catch((err) => {
        notification.error({
          message: err.response?.date?.message || err.message,
        });
      });
  }, [roleFilter]);

  return (
    <div className={style.box}>
      <div className={style.header}>
        <h2 className={style.title}>Roles</h2>
        {edit && (
          <Link to={router.createRole.path} className={style.btnAdd}>
            add new
          </Link>
        )}
      </div>
      <div className={clsx('box', style.container)}>
      <Filter change={setRoleFilter}  
          placeholder="Search by role name" 
          search
          />
        <Table
          dataSource={list}
          pagination={false}
          rowKey="id"
          rowClassName={styles.row}
          // response={true}
          loading={loading}
          className="expanded-table"
          rowClassName={(record, i) => (record.expanded ? 'open' : i % 2 ? 'dark' : ' light')}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender: (record) => (
              <RoleDetails item={record} permissionsAll={listAllPermissions} dispatch={dispatch} />
            ),
            expandRowByClick: true,
            onExpand: (expanded, record) => {
              record.expanded = expanded;
            },
          }}
        >
          <Column title="Name" dataIndex="name" />
          <Column
            title="Date"
            dataIndex="createdAt"
            render={(value) => parseTimeZone(value, timezone)}
          />
        </Table>
      </div>
    </div>
  );
};

export default withAuth(withPermissionChecking(Roles));
