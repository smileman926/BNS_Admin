/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, notification } from "antd";
import clsx from "clsx";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../utils/services/AuthService";
import * as style from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "./../../redux/auth/authActions";
import router from "../../router";
import withCheckAuth from "../../utils/HOC/withCheckAuth";
import { setPermissions } from '../../redux/roles/Actions';

function Login({ history }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isLoad = useSelector((state) => state.auth.isLoad);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [isLoading, setIsLoading] = useState(isLoad || false);
  const [newUser, setNewUser] = useState(null);

  const onSubmit = (value) => {
    setIsLoading(true);
    AuthService.logIn({...value, email: value.email.toLowerCase()})
      .then((res) => {
        setIsLoading(false);
        if (res.challengeName === 'NEW_PASSWORD_REQUIRED') {
          return setNewUser(res);
        }
        dispatch(authActions.loginRequest(res));
      })
      .catch((err) => {
        setIsLoading(false);
        showError(err.message);
      });
  };

  const completeNewPasswordChallenge = useCallback(({ new_password }) => {
    setIsLoading(true);
    newUser.completeNewPasswordChallenge(new_password, {}, {
      onSuccess: () => {
        onSubmit({ email: form.getFieldValue('email'), password: new_password });
      },
      onFailure: (err) => {
        setIsLoading(false);
        showError(err.message);
      }
    });
  }, [form, newUser, setIsLoading]);

  const showError = (mes) => {
    notification.error({
      message: "Error",
      description: mes,
    });
  };

  useEffect(() => {
    if (isLogin) history.push("/");
  }, [isLogin]);

  return (!newUser ?
      <div className={clsx(style.wrp, "box")}>
        <h2>Login to Admin</h2>
        <Form name="basic" form={form} onFinish={onSubmit}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                type: "email",
              },
            ]}
          >
            <Input placeholder="E-mail"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input type="password" placeholder="Password"/>
          </Form.Item>

          <Link to={router.forgot.path} className={style.link}>
            Forgot Password ?
          </Link>

          <Button
            loading={isLoad || isLoading}
            type="bns"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form>
      </div> :
      <div className={clsx(style.wrp, "box")}>
        <h2>New password</h2>
        <Form name="basic" onFinish={completeNewPasswordChallenge}>
          <Form.Item
            name="new_password"
            rules={[{ required: true, message: "Please input your new password!" }]}
          >
            <Input type="password" autoComplete='off' placeholder="New password"/>
          </Form.Item>
          <Button
            loading={isLoading}
            type="bns"
            htmlType="submit"
            className="login-form-button"
          >
            Confirm
          </Button>
        </Form>
      </div>
  );
}

export default withCheckAuth(Login);
