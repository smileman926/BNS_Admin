import { Button, Form, Input, notification, Checkbox } from "antd";
import clsx from "clsx";
import withAuth from "../../utils/HOC/withAuth";
import { apiSaveCategory } from "../../utils/api/api";
import React, { useState } from "react";
import router from "../../router";
import * as style from "./AddCategories.module.scss";
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';

function AddCategories({ history }) {
  const [loading, setLoading] = useState(false);

  const sendNewCategory = (values) => {
    setLoading(true);

    const { category_name, product_type } = values;

    apiSaveCategory({
      category_name,
      product_type: product_type
    })
      .then((res) => {
        setLoading(false);
        notification.success({
          message: "Save",
        });
        history.push(router.categories.path);
      })
      .catch((err) => {
        setLoading(false);
        notification.error({
          message: err.response.data.message === "Validation error" ? "Category name must be unique" : err.response.data.message,
        });
      });
  };

  return (
    <div className={clsx(style.box, "box")}>
      <h2>Add New Category</h2>
      <Form onFinish={sendNewCategory}>
        <Form.Item
          name="category_name"
          rules={[
            {
              required: true,
              message: "Please input category name",
            },
          ]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>
        <Form.Item
          name="product_type"
          rules={[
            {
              required: true,
              message: "Select type",
            },
          ]}
        >
          <Checkbox.Group
            style={{ justifyContent: "flex-start", display: "flex" }}
          >
            <Checkbox value="physical">Physical</Checkbox>
            <Checkbox value="standard">Standard Webinar</Checkbox>
            <Checkbox value="gift">Gift Card Webinar</Checkbox>
            <Checkbox value="mini">Mini Webinar</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="bns" loading={loading}>
            save now
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default withAuth(withPermissionChecking(AddCategories));
