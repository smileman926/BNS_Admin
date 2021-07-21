import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.scss';
import { apiGetPermissions } from '../../utils/api/api';
import { saveRole } from '../../redux/roles/Actions';
import { rolesLoadingSelector } from '../../redux/roles/Selectors';

const RoleModal = ({ close }) => {
  const { Option } = Select;
  const [permissions, setPermissions] = useState([]);
  const [permissionIds, setPermissionIds] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const loading = useSelector(rolesLoadingSelector);
  useEffect(() => {
    apiGetPermissions()
      .then((res) => setPermissions(res))
      .catch((err) => console.log(err, 'err'));
  }, []);

  const handleCreate = ({ name }) => {
    dispatch(
      saveRole(
        {
          name,
          permissionIds,
        },
        {
          onSuccess: close,
        },
      ),
    );
  };

  const handleSelect = (item) => {
    const currentItem = permissions.find((el) => el.id === item);
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
            name.includes(currentItem.name.replace('View', 'Delete')),
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
    <div className={styles.container}>
      <div className={styles.panelCont}>
        <div className={styles.panel}>
          <div className={styles.imgCont} onClick={close} role="presentation">
            <img className={styles.img} alt="img" src="/assets/icons/delete.svg" />
          </div>
          <h3> Create a Role</h3>
          <Form onFinish={(val) => handleCreate(val)} form={form}>
            <div className={styles.btnsCont}>
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
                className={styles.select}
                // dropdownClassName={styles.drop}
                size="large"
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
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default RoleModal;
