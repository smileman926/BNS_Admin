import { Button, DatePicker, Form, Input, InputNumber, notification } from 'antd';
import clsx from 'clsx';
import { parseFromTimeZone } from 'date-fns-timezone';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CategoriesDropdown from '../../../../../components/CategoriesDropdown';
import DropZone from '../../../../../components/DropZone';
import ImagesContainer from '../../../../../components/ImagesContainer';
import { PRODUCT_IMAGES_LIMIT } from '../../../../../config/constatnts';
import uploadImages from '../../../../../helpers/uploadImage';
import router from '../../../../../router';
import styles from '../../index.module.scss';
import { apiSaveProduct } from './../../../../../utils/api/api';

export default function () {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [files, setFiles] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const timeZone = useSelector((state) => state.setting)?.settingInfo?.time_zone;

  const submit = useCallback(
    async (values) => {
      if (!mainImage) {
        notification.error({
          message: 'Upload a picture!',
        });
        return;
      }
      try {
        setLoading(true);
        const picture = await uploadImages({ type: 'physical', mainImage, listImages: files });

        const body = { ...values, ...picture };

        if (values.scheduled_time) {
          body.scheduled_time = parseFromTimeZone(values.scheduled_time, {
            timeZone,
          }).toISOString();
          body.publish_method = 'scheduled';
        } else {
          body.publish_method = 'instant';
        }
        await apiSaveProduct(body);
        notification.success({
          message: 'Saved',
        });
        history.push(router.productListingOptions.path);
      } catch (err) {
        notification.error({
          message: err.response?.data?.message || err.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [files, mainImage, timeZone],
  );

  const onUpload = (newFiles) => {
    if (!mainImage && newFiles.length) {
      setMainImage(newFiles[0]);
    }
    files.unshift(...newFiles);
    setFiles([...files]);
  };

  const onDelete = (item) => {
    if (item !== mainImage) {
      files.splice(files.indexOf(item), 1);
      setFiles([...files]);
    }
  };

  return (
    <Form
      className={clsx(styles.form, styles.physical)}
      onFinish={submit}
      onFinishFailed={(e) => console.log('e fail', e)}
    >
      <Form.Item
        name="productName"
        className={styles.name}
        rules={[
          {
            required: true,
            message: 'Name is required',
          },
        ]}
      >
        <Input placeholder="Product Name*" />
      </Form.Item>
      <Form.Item
        className={styles.category}
        name="category_id"
        rules={[
          {
            required: true,
            message: 'Category is required',
          },
        ]}
      >
        <CategoriesDropdown type="physical" />
      </Form.Item>
      <Form.Item
        name="amount"
        className={styles.inventory}
        rules={[
          {
            required: true,
            message: 'Inventory is required',
          },
        ]}
      >
        <InputNumber placeholder="Inventory*" min={1} />
      </Form.Item>
      <Form.Item
        name="pricePerItem"
        className={styles.price}
        rules={[
          {
            required: true,
            message: 'Price per unit is required',
          },
        ]}
      >
        <InputNumber placeholder="Price per unit*" min={1} />
      </Form.Item>
      <Form.Item name="shipping_price" className={styles.shipping_price}>
        <InputNumber placeholder="Shipping price" min={0} />
      </Form.Item>
      <Form.Item name="shortDescription" className={styles.description}>
        <Input.TextArea placeholder="Description" />
      </Form.Item>
      <Form.Item className={styles.dropzone}>
        {!!files.length && (
          <ImagesContainer
            files={files}
            handleDeleteImage={onDelete}
            handleSelectImage={(v) => setMainImage(v)}
            selectedImage={mainImage}
          />
        )}
        {files.length <= PRODUCT_IMAGES_LIMIT && <DropZone onChange={onUpload} />}
      </Form.Item>
      <div className={styles.actions}>
        <div>
          <Button
            onClick={() => setScheduled(false)}
            className={clsx(styles.btn, scheduled && styles.inactive)}
          >
            List now
          </Button>
          <Button
            onClick={() => setScheduled(true)}
            className={clsx(styles.btn, !scheduled && styles.inactive)}
          >
            List later
          </Button>
        </div>
        {scheduled && (
          <Form.Item
            name="scheduled_time"
            rules={[
              {
                required: true,
                message: 'Select scheduled time',
              },
            ]}
            normalize={(value) => {
              const d = value.unix() === moment().unix() ? moment(value).tz(timeZone) : value;
              const newDate = new Date(
                d.year(),
                d.month(),
                d.date(),
                d.hours(),
                d.minutes(),
                d.seconds(),
                d.milliseconds(),
              );
              return moment(newDate);
            }}
          >
            <DatePicker className={styles} format="MM/DD/YYYY hh:mm:ss" placeholder="Select date" showTime />
          </Form.Item>
        )}
        <Button htmlType="submit" className={styles.btn} loading={loading}>
          Save
        </Button>
      </div>
    </Form>
  );
}
