import React, { useEffect } from "react";
import { Button, Form, Input, Row, Col } from "antd";
import * as style from "./SocialLink.module.scss";

const SocialLink = props => {
  const { facebook_media_links, instagram_media_links, isLoad, onSave, disabled } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      facebook_media_links,
      instagram_media_links,
    });
  }, [facebook_media_links, instagram_media_links, form]);

  return (
    <Col className={style.social_link}>
      <h3 className={style.title}>Social media links</h3>
      <p className={style.label}>
        The admin should be able to set a FaceBook and an Instagram link for the social media
        icons in the footer of the customer facing site.
      </p>
      <Form name="basic" form={form} onFinish={onSave}>
        <Row type="flex" justify="space-between" align="center">
          <Col md={9}>
            <Form.Item
              name="facebook_media_links"
              rules={[
                {
                  required: true,
                  message: "Please input the facebook link!",
                },
              ]}
            >
              <Input type="text" disabled={disabled} className={style.link} placeholder="Add Facebook Link" />
            </Form.Item>
          </Col>
          <Col md={9}>
            <Form.Item
              name="instagram_media_links"
              rules={[
                {
                  required: true,
                  message: "Please input the instagram link!",
                },
              ]}
            >
              <Input type="text" disabled={disabled} className={style.link} placeholder="Add Instagram Link" />
            </Form.Item>
          </Col>
          <Col>
            { !disabled &&
            <Button
              loading={isLoad}
              type="bns"
              htmlType="submit"
              className={style.save_button}
            >
              Save
            </Button>
            }
          </Col>
        </Row>
      </Form>
    </Col>
  )
}

export default SocialLink;
