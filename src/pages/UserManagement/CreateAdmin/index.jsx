import { Button, Form, Input, Select, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mailPattern, passPattern } from '../../../helpers/regExps';
import withAuth from '../../../utils/HOC/withAuth';
import withPermissionChecking from '../../../utils/HOC/withPermissionsChecking';
import styles from './index.module.scss';
import { getRoles, createUser } from './../../../redux/roles/Actions';

const { Option } = Select;

const CreateAdmin = ({ history }) => {
  const dispatch = useDispatch();

  const { list, loading } = useSelector((state) => state.roles);
  useEffect(() => {
    dispatch(getRoles());
  }, []);

  const callbackSuccess = () => {
    notification.success({
      message: 'Create new admin success',
    });
    history.go(-1);
  };

  const handleCreate = (userData) => {
    dispatch(createUser({ userData, callbackSuccess }));
  };
  return (
    <Form className={styles.container} onFinish={handleCreate} labelAlign="left" hideRequiredMark>
      <div>
        <h3>User Management</h3>
      </div>
      <div className={styles.cnt}>
        <h3>Create a New Admin User</h3>
        <div className={styles.btnsCont}>
          <div className={styles.inptGroup}>
            <Form.Item
              label="Username"
              rules={[
                {
                  required: true,
                  message: 'Username is required',
                },
              ]}
              name="username"
            >
              <Input placeholder="Input Username" />
            </Form.Item>
          </div>

          <div className={styles.inptGroup}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'email is required',
                },
                {
                  pattern: mailPattern,
                  message: 'email is not valid',
                },
              ]}
            >
              <Input placeholder="Input Email" />
            </Form.Item>
          </div>
          <div className={styles.inptGroup}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'password is required',
                },
                {
                  pattern: passPattern,
                  message:
                    'Minimum length of 8 characters. Numeric characters(0-9). Special characters. Uppercase characters. Lowercase characters.',
                },
              ]}
            >
              <Input placeholder="InputPassword" />
            </Form.Item>
          </div>

          <div className={styles.inptGroup}>
            <Form.Item
              name="role"
              label="Role"
              rules={[
                {
                  required: true,
                  message: 'Role is required',
                },
              ]}
            >
              <Select
                className="rounded"
                bordered={false}
                placeholder="Please select"
                showArrow
              >
                {list.length > 0 &&
                  list.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <Button type="bns" htmlType="submit" loading={loading}>
            Create
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default withAuth(withPermissionChecking(CreateAdmin));
