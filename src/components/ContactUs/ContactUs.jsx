import React, { useEffect } from "react";
import { Button, Form, Input, Col } from "antd";
import * as style from "./ContactUs.module.scss";

const ContactUs = props => {
  const { content, email, isLoad, onSave, disabled } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      contact_us_page_info: content,
      contact_us_email_address: email,
    });
  }, [content, email, form]);

  return (
    <Col className={style.contact_us}>
      <h3 className={style.title}>Contact us page</h3>
      <p className={style.label}>The admin can change the text on the contact us page and specify what emails the contact form goes to.</p>
      <Form name="basic" form={form} onFinish={onSave}>
        <Form.Item
          name="contact_us_page_info"
          rules={[
            {
              required: true,
              message: "Please input the content!",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Content"
            autoSize={{ minRows: 3, maxRows: 5 }}
            disabled={disabled}
            className={style.textArea}
          />
        </Form.Item>
        <Form.Item
          name="contact_us_email_address"
          rules={[
            {
              required: true,
              message: "Please input the email!",
              type: "email",
            },
          ]}
        >
          <Input disabled={disabled} type="email" className={style.email} placeholder="Emails Address that contact form goes to" />
        </Form.Item>
        {!disabled &&
          <Button
            loading={isLoad}
            type="bns"
            htmlType="submit"
            className={style.save_button}
          >
            Save
          </Button>
        }
      </Form>
    </Col>
  )
}

export default ContactUs;
