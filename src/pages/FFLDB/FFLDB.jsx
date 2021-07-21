import { Button, DatePicker, Form, Input, Modal, Table, notification } from 'antd';
import clsx from 'clsx';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddressInput from '../../components/AddressInput/AddressInput';
import Filter from '../../components/Filter';
import { mailPattern } from '../../helpers/regExps';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import { getFflDbRequest, saveFflDbRequest, editFflDbRequest } from '../../redux/fflDb/fflDbActions';
import { rolesSelector } from '../../redux/roles/Selectors';
import withAuth from '../../utils/HOC/withAuth';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import * as style from './FFLDB.module.scss';
import { parseFromTimeZone, format } from 'date-fns-timezone';
import { apiUpdateFFL } from '../../utils/api/api';

const { Column } = Table;

function ChangeDate({ date, id }) {
  const [time, setTime] = useState(date ? moment(date) : null);
  const timezone = useSelector((state) => state.setting.settingInfo)?.time_zone || null;
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const permissions = useSelector(rolesSelector);
  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'fflEdit'));
  }, [permissions]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (timezone && date) {
      setTime(moment(date).tz(timezone));
    }
  }, [timezone]);

  const onChange = useCallback(
    (value) => {
      if (!value) return setTime(null);

      const d = value.unix() === moment().unix() ? moment(value).tz(timezone) : value;
      const newDate = new Date(
        d.year(),
        d.month(),
        d.date(),
        d.hours(),
        d.minutes(),
        d.seconds(),
        d.milliseconds(),
      );
      setTime(moment(newDate));
    },
    [timezone],
  );

  const saveNewDate = () => {
    setLoading(true);
    apiUpdateFFL({
      expiration_date: parseFromTimeZone(time, {
        timeZone: timezone,
      }).toISOString(),
      id,
    })
      .then((res) => {
        notification.success({
          message: 'Saved!',
        });
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

  return (
    <div className={style.setFFL} onClick={(e) => e.stopPropagation()}>
      <DatePicker
        value={time}
        showTime
        format={"MM/DD/YYYY hh:mm:ss"}
        onChange={onChange}
        className={style.changeDate}
        placeholder="Expiration date"
        disabledDate={(current) => current && current < moment()}
      />
      <Button disabled={!edit || !time} loading={loading} className={style.btnSave} onClick={saveNewDate}>
        Ок
      </Button>
    </div>
  );
}

function expandedRowRender(records) {
  const { winners, ffl_products } = records;
  const data = ffl_products.map((item) => ({
    user_data: item.buyer,
    webinar: { name: item.productInfo.productName },
  }));
  return (
    <Table dataSource={[...winners, ...data]} pagination={false} rowKey={(record) => records.id}>
      <Column dataIndex={['webinar', 'name']} title="Item" />
      <Column dataIndex={['user_data', 'username']} title="Contact name" />
      <Column dataIndex={['user_data', 'phone_number']} title="Contact Phone" />
      <Column dataIndex={['user_data', 'email']} title="Contact Email" />
    </Table>
  );
}

function FFLDB() {
  const [filter, setFilter] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const dispatch = useDispatch();
  const list = useSelector((state) => state.fflDb.list);
  const loading = useSelector((state) => state.fflDb.loading);
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editFFLId, setEditFFLId] = useState();
  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'fflEdit'));
  }, [permissions]);

  useEffect(() => {
    if (filter) {
      dispatch(getFflDbRequest(filter));
    }
  }, [filter]);

  const handlerModal = () => setShowModal(!showModal);
  const handleEditModal = () => {
    setShowEditModal(!showEditModal);
  }
  const timezone = useSelector((state) => state.setting.settingInfo)?.time_zone || null;

  const sendNewFFL = (values) => {
    const { expiration_date } = values;
    dispatch(
      saveFflDbRequest({
        ...values,
        expiration_date: parseFromTimeZone(expiration_date, {
          timeZone: timezone,
        }).toISOString(),
        filter,
      }),
    );
    setShowModal(false);
  };

  const editCurrentFFL = (values) => {
    const { expiration_date } = values;
    dispatch(
      editFflDbRequest({
        ...values,
        id: editFFLId,
        expiration_date: parseFromTimeZone(expiration_date, {
          timeZone: timezone,
        }).toISOString(),
        filter,
      }),
    );
    setShowEditModal(false);
  };

  const handleEdit = (value,record) => {
    setEditFFLId(record.id);
    editForm.setFieldsValue({
      ffl_name: record.ffl_name,
      location: record.location,
      ffl_no: record.ffl_no,
      contact_name: record.contact_name,
      contact_phone: record.contact_phone,
      contact_email: record.contact_email,
      expiration_date: moment(record.expiration_date).tz(timezone)
    })
    handleEditModal();
  }
  return (
    <>
      <Modal title="Add New FFL" visible={showModal} onCancel={handlerModal} footer={false}>
        <Form onFinish={sendNewFFL} form={form}>
          <Form.Item
            name="ffl_name"
            rules={[
              {
                required: true,
                message: 'Please input FFL name',
              },
            ]}
          >
            <Input placeholder="FFL Name"/>
          </Form.Item>
          <Form.Item
            name="location"
            rules={[
              {
                required: true,
                message: 'Please input FFL address',
              },
            ]}
          >
            <AddressInput placeholder="FFL Address"/>
          </Form.Item>
          <Form.Item
            name="ffl_no"
            rules={[
              {
                required: true,
                message: 'Please input FFL number',
              },
            ]}
          >
            <Input placeholder="FFL Number"/>
          </Form.Item>
          <Form.Item name="contact_name">
            <Input placeholder="Contact name"/>
          </Form.Item>
          <Form.Item
            name="contact_phone"
            type="number"
            normalize={(v, pV) => v.replace(/\D/g, '')}
            rules={[
              {
                required: true,
                message: 'Please input contact phone',
              },
              {
                pattern: '^(1s?)?((([0-9]{3}))|[0-9]{3})[s-]?[\0-9]{3}[s-]?[0-9]{4}$',
                message: 'Please input contact phone',
              },
            ]}
          >
            <Input placeholder="Contact phone"/>
          </Form.Item>
          <Form.Item
            name="contact_email"
            rules={[
              {
                required: true,
                message: 'Please input contact email',
              },
              {
                pattern: mailPattern,
                message: 'Please input contact email',
              },
            ]}
          >
            <Input placeholder="Contact email"/>
          </Form.Item>
          <Form.Item
            name="expiration_date"
            rules={[
              {
                required: true,
                message: 'Please input expiration date',
              },
            ]}
            normalize={(value) => {
              if (value) {
                const d = value.unix() === moment().unix() ? moment(value).tz(timezone) : value;
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
              }
              else
                return "";
            }}
          >
            <DatePicker
              className={style.datePicker}
              showTime
              format={"MM/DD/YYYY hh:mm:ss"}
              placeholder="Expiration date"
              disabledDate={(current) => current && current < moment()}
            />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="bns" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Edit FFL" visible={showEditModal} onCancel={handleEditModal} footer={false}>
        <Form onFinish={editCurrentFFL} form={editForm}>
          <Form.Item
            name="ffl_name"
            rules={[
              {
                required: true,
                message: 'Please input FFL name',
              },
            ]}
          >
            <Input placeholder="FFL Name"/>
          </Form.Item>
          <Form.Item
            name="location"
            rules={[
              {
                required: true,
                message: 'Please input FFL address',
              },
            ]}
          >
            <AddressInput placeholder="FFL Address"/>
          </Form.Item>
          <Form.Item
            name="ffl_no"
            rules={[
              {
                required: true,
                message: 'Please input FFL number',
              },
            ]}
          >
            <Input placeholder="FFL Number"/>
          </Form.Item>
          <Form.Item name="contact_name">
            <Input placeholder="Contact name"/>
          </Form.Item>
          <Form.Item
            name="contact_phone"
            type="number"
            normalize={(v, pV) => v.replace(/\D/g, '')}
            rules={[
              {
                required: true,
                message: 'Please input contact phone',
              },
              {
                pattern: '^(1s?)?((([0-9]{3}))|[0-9]{3})[s-]?[\0-9]{3}[s-]?[0-9]{4}$',
                message: 'Please input contact phone',
              },
            ]}
          >
            <Input placeholder="Contact phone"/>
          </Form.Item>
          <Form.Item
            name="contact_email"
            rules={[
              {
                required: true,
                message: 'Please input contact email',
              },
              {
                pattern: mailPattern,
                message: 'Please input contact email',
              },
            ]}
          >
            <Input placeholder="Contact email"/>
          </Form.Item>
          <Form.Item
            name="expiration_date"
            rules={[
              {
                required: true,
                message: 'Please input expiration date',
              },
            ]}
            normalize={(value) => {
              if( value ) {
                const d = value.unix() === moment().unix() ? moment(value).tz(timezone) : value;
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
              }
              else
                return "";
            }}
          >
            <DatePicker
              className={style.datePicker}
              showTime
              format={"MM/DD/YYYY hh:mm:ss"}
              placeholder="Expiration date"
              disabledDate={(current) => current && current < moment()}
            />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="bns" htmlType="submit">
              Edit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className={style.box}>
        <div className={style.header}>
          <h2 className={style.title}>FFL Database</h2>
          {edit && (
            <Button htmlType="button" type="bns" className={style.btnAdd} onClick={handlerModal}>
              add new
            </Button>
          )}
        </div>
        <div className={clsx('box', style.container)}>
          <Filter 
          change={setFilter} 
          total={list.count} 
          placeholder="Search by user name" 
          search
          />

          <Table
            loading={loading}
            title={false}
            pagination={false}
            dataSource={list.rows}
            className="expanded-table"
            rowClassName={(record, i) => (record.expanded ? 'open' : i % 2 ? 'dark' : ' light')}
            rowKey={(record) => record.id}  
            expandable={{
              expandedRowRender,
              expandRowByClick: true,
              onExpand: (expanded, record) => {
                record.expanded = expanded;
              },
            }}
          >
            <Column title="FFL Name" dataIndex="ffl_name" />
            <Column title="Address" dataIndex="location" />
            <Column title="FFL Number" dataIndex="ffl_no" />
            <Column title="Contact Name" dataIndex="contact_name" />
            <Column title="Contact Phone" dataIndex="contact_phone" />
            <Column title="Contact Email" dataIndex="contact_email" />
            <Column
              title="Expiration date"
              dataIndex="expiration_date"
              className={style.expiration_date}
              render={(value, record) => <ChangeDate date={value} id={record.id} />}
            />
            <Column 
              title="Edit" 
              dataIndex="edit" 
              render={(value,record) => <img
                        alt=""
                        src="/assets/icons/create.svg"
                        className={style.iconPencil}
                        onClick={() => handleEdit(value,record)}
                      />}
            />
          </Table>
        </div>
      </div>
    </>
  );
}

export default withAuth(withPermissionChecking(FFLDB));
