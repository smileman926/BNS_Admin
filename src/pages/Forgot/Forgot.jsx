import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Typography } from "antd";
import clsx from "clsx";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SixNumeric from "../../components/SixNumeric";
import router from "../../router";
import AuthService from "../../utils/services/AuthService";
import * as style from "./Forgot.module.scss";
import withCheckAuth from "../../utils/HOC/withCheckAuth";

const { Paragraph } = Typography;

function Forgot() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  const [step, setStep] = useState(1);

  const sendCode = ({ email }) => {
    setIsLoading(true);

    AuthService.forgotPassword(email.toLowerCase())
      .then((res) => {
        setIsLoading(false);
        setEmail(email.toLowerCase());
        setStep(2);
      })
      .catch((err) => {
        setIsLoading(false);
        notification.error({
          message: err.message,
        });
      });
  };

  const sendNewPassword = ({ newPassword }) => {
    setIsLoading(true);
    AuthService.confirmNewPassword({ email: email.toLowerCase(), code, newPassword })
      .then((res) => {
        setIsLoading(false);
        setStep(4);
      })
      .catch((err) => {
        setIsLoading(false);
        setStep(2);
        notification.error({
          message: err.message,
        });
      });
  };

  return (
    <div className={clsx(style.wrp, "box")}>
      {step === 1 && (
        <>
          <h2>Forgot Password</h2>
          <Form name="basic" onFinish={sendCode}>
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
              <Input placeholder="E-mail" />
            </Form.Item>

            <Paragraph type="secondary" className="text-center">
              If an account with this email exists, a password <br /> reset
              email will be shortly
            </Paragraph>

            <Button loading={isLoading} type="bns" htmlType="submit">
              send
            </Button>
          </Form>
        </>
      )}
      {step === 2 && (
        <>
          <h2>Verification code</h2>
          <SixNumeric handler={setCode} />
          <Button
            type="bns"
            htmlType="button"
            disabled={code.length !== 6}
            onClick={() => setStep(3)}
          >
            NEXT
          </Button>
        </>
      )}
      {step === 3 && (
        <>
          <h2>New Password</h2>
          <Form onFinish={sendNewPassword}>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>
            <Button loading={isLoading} type="bns" htmlType="submit">
              send
            </Button>
          </Form>
        </>
      )}
      {step === 4 && (
        <div className={style.confirm}>
          <CheckCircleOutlined style={{ fontSize: "80px" }} />
          <h2>Password confirmed!</h2>
          <Link to={router.login.path} className={style.link}>
            go to login page
          </Link>
        </div>
      )}
    </div>
  );
}

export default withCheckAuth(Forgot);
