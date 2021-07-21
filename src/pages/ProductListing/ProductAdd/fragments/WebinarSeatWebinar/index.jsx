import { Button, DatePicker, Form, Input, InputNumber, notification, Select } from 'antd';
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
import { apiSaveWebinar, apiGetProducts } from './../../../../../utils/api/api';
import { useEffect } from 'react';

const { Option } = Select;

export default function () {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [files, setFiles] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [addQueue, setAddQueue] = useState(false);
  const [now, setNow] = useState(true);
  const [form] = Form.useForm();
  const timeZone = useSelector((state) => state.setting)?.settingInfo?.time_zone;
  const [webinarsList, setWebinarsList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    setLoadingList(true);
    apiGetProducts({
      limit: Number.MAX_SAFE_INTEGER,
      filter: 'webinar',
      status: 'all',
    })
      .then((res) => {
        setWebinarsList(res.rows);
      })
      .catch((err) => console.log('err', err))
      .finally(() => {
        setLoadingList(false);
      });
  }, []);

  const changePublishMethod = useCallback((type) => {
    setNow(false);
    setAddQueue(false);
    setScheduled(false);
    switch (type) {
      case 'queue':
        setAddQueue(true);
        form.setFieldsValue({ publish_method: 'queued' });
        break;
      case 'scheduled':
        form.setFieldsValue({ publish_method: 'scheduled' });
        setScheduled(true);
        break;
      case 'now':
        form.setFieldsValue({ publish_method: 'instant' });
        setNow(true);
        break;
      default:
        return;
    }
  }, []);

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
        const picture = await uploadImages({ type: 'webinar', mainImage, listImages: files });

        const body = { ...values, ...picture };
        body.webinar_type = 'seats';

        if (values.scheduled_time) {
          body.scheduled_time = parseFromTimeZone(values.scheduled_time, {
            timeZone,
          }).toISOString();
        }
        await apiSaveWebinar(body);
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
    [files, mainImage, timeZone, now, scheduled, addQueue],
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
    <Form form={form} className={clsx(styles.form, styles.physical)} onFinish={submit}>
      <Form.Item
        name="name"
        className={styles.name}
        rules={[
          {
            required: true,
            message: 'Name is required',
          },
        ]}
      >
        <Input placeholder="Webinar Name*" />
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
        <CategoriesDropdown type="mini" />
      </Form.Item>
      <Form.Item
        name="seats"
        className={styles.inventory}
        rules={[
          {
            required: true,
            message: 'Number of seats is required',
          },
        ]}
      >
        <InputNumber placeholder="Number of seats*" min={1} max={1000} />
      </Form.Item>
      <Form.Item
        name="price_per_seats"
        className={styles.price}
        rules={[
          {
            required: true,
            message: 'Price per seat is required',
          },
        ]}
      >
        <InputNumber placeholder="Price per seat*" min={1} />
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
      <Form.Item name="publish_method" initialValue="instant" hidden>
        <Input />
      </Form.Item>
      <Form.Item name={['prize', 'webinar_id']}>
        <Select
          loading={loadingList}
          placeholder="Choose prize webinar"
          className="rounded"
          bordered={false}
        >
          {!!webinarsList.length &&
            webinarsList.map((elem) => (
              <Option key={elem.id} value={elem.id}>
                {elem.product_name}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={['prize', 'seats']}
        dependencies={['seats']}
        rules={[
          {
            required: true,
            message: 'Write amount seats',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (getFieldValue('seats') >= value) {
                return Promise.resolve();
              } else {
                return Promise.reject(
                  'The number of prize seats cannot be more than the total number of seats',
                );
              }
            },
          }),
        ]}
      >
        <InputNumber placeholder="Number of seats" min={1} />
      </Form.Item>
      <div className={styles.actions}>
        <div>
          <Button
            onClick={() => changePublishMethod('now')}
            className={clsx(styles.btn, !now && styles.inactive)}
          >
            List now
          </Button>
          <Button
            onClick={() => changePublishMethod('scheduled')}
            className={clsx(styles.btn, !scheduled && styles.inactive)}
          >
            List later
          </Button>
          <Button
            onClick={() => changePublishMethod('queue')}
            className={clsx(styles.btn, !addQueue && styles.inactive)}
          >
            add to queue
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
            <DatePicker className={styles} placeholder="Select date" showTime />
          </Form.Item>
        )}

        <Button htmlType="submit" className={styles.btn} loading={loading}>
          Save
        </Button>
      </div>
    </Form>
  );
}
