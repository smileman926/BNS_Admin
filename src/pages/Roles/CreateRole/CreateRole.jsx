import { Button, Form, Input, notification, Select } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import router from '../../../router';
import { apiGetPermissions, apiSaveRole } from '../../../utils/api/api';
import * as style from './CreateRole.module.scss';

const { Option } = Select;
function CreateRole({ history }) {
  const [permissions, setPermissions] = useState([]);
  const [permissionIds, setPermissionIds] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);


  useEffect(() => {
    setLoadingPermissions(true);
    apiGetPermissions()
      .then((res) => setPermissions(res))
      .catch((err) => console.log(err, 'err')).finally(() => {
        setLoadingPermissions(false);
      });

  }, []);

  const handleCreate = ({ name }) => {
    setLoading(true);
    apiSaveRole({
      name,
      permissionIds,
    })
      .then((res) => {
        notification.success({
          message: 'Saved',
        });
        history.push(router.roles.path);
      })
      .catch((err) => {
        notification.error({
          message: err.response?.data?.message || err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelect = (item) => {
    const currentItem = permissions.find((el) => el.id === item);
    console.log('currentItem', currentItem)
    if (currentItem.name.includes('View')) {
      if (currentItem.name === 'seatsRefundView') {
        setPermissionIds([
          ...permissionIds,
          permissions.find((el) => el.name === 'productView').id,
          item,
        ]);
      } else {
        setPermissionIds([...permissionIds, item]);
      }
    } else if (currentItem.name.includes('Edit')) {
      const parrent = permissions.find(
        (el) => el.name === currentItem.name.replace('Edit', 'View'),
      );

      if (!permissionIds.includes(parrent.id)) {
        setPermissionIds([...permissionIds, parrent.id, item]);
      } else {
        setPermissionIds([...permissionIds, item]);
      }
    } else if (currentItem.name.includes('Delete')) {
      const parrent = permissions.find(
        (el) => el.name === currentItem.name.replace('Delete', 'View'),
      );
      if (!permissionIds.includes(parrent.id)) {
        setPermissionIds([...permissionIds, parrent.id, item]);
      } else {
        setPermissionIds([...permissionIds, item]);
      }
    } else if (currentItem.name.includes('Create')) {
      const parrent = permissions.find(
        (el) => el.name === currentItem.name.replace('Create', 'sView'),
      );
      console.log('parrent', parrent)
      if (!permissionIds.includes(parrent.id)) {
        setPermissionIds([...permissionIds, parrent.id, item]);
      } else {
        setPermissionIds([...permissionIds, item]);
      }
    }
  };

  const handlerDeSelect = (item) => {
    const currentItem = permissions.find((el) => el.id === item);
    if (currentItem.name.includes('View')) {
      const ids = permissions
        .filter(
          ({ name }) =>
            name.includes(currentItem.name.replace('View', 'Edit')) ||
            name.includes(currentItem.name.replace('View', 'Create')) ||
            name.includes(currentItem.name.replace('View', 'Delete')) ||
            name.includes(currentItem.name.replace('sView', 'Create')) 
        )
        .map((el) => el.id);
      ids.push(item);
      if (currentItem.name === 'productView') {
        ids.push(permissions.find((el) => el.name === 'seatsRefundView').id);
      }
      setPermissionIds(permissionIds.filter((el) => !ids.includes(el)));
    }
  };

  useEffect(() => {
    form.setFieldsValue({ permissionIds });
  }, [permissionIds]);

  return (
    <div className={clsx('box', style.container)}>
      <h2 className={style.title}>Create role</h2>
      <Form onFinish={handleCreate} form={form}>
        <Form.Item
          label="Roles"
          labelAlign="left"
          name="name"
          rules={[{ required: true, message: 'Please input name' }]}
        >
          <Input placeholder="Input role" />
        </Form.Item>
        <Select
          mode="multiple"
          className={style.select}
          size="large"
          loading={loadingPermissions}
          placeholder="Please select"
          showArrow
          value={permissionIds}
          onSelect={handleSelect}
          onChange={(ids) => setPermissionIds(ids)}
          onDeselect={handlerDeSelect}
        >
          {permissions.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.title}
            </Option>
          ))}
        </Select>
        <Button
          loading={loading}
          type="bns"
          htmlType="submit"
          disabled={permissionIds.length === 0}
        >
          Save
        </Button>
      </Form>
    </div>
  );
}

export default CreateRole;
