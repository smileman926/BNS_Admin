import { Button, DatePicker, Form, Input, notification, Popover, Table } from 'antd';
import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ImageDownload from '../../components/ImageDownload';
import { getListSoldOutWebinarsRequest } from '../../redux/soldOutWebinars/soldOutWebinarsActions';
import router from '../../router';
import { apiSendLinkStartWebinar } from '../../utils/api/api';
import withAuth from '../../utils/HOC/withAuth';
import * as style from './SoldOutWebinars.module.scss';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import { rolesSelector } from '../../redux/roles/Selectors';
import { settingsSelector } from '../../redux/setting/Selectors';
import Filter from '../../components/Filter';

const { Column } = Table;

const SendUrl = ({ webinar, history }) => {

  const timezone = useSelector(settingsSelector)?.settingInfo.time_zone;

  const [show, setShow] = useState(false);
  const handlerPop = () => setShow(!show);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const handlerForm = ({ webinar_link, start_date }) => {
    setLoading(true);

    apiSendLinkStartWebinar(
      { webinar_link, start_date: start_date.format('MMMM Do YYYY, h:mm A') },
      webinar.id,
    )
      .then(() => {        
        dispatch(getListSoldOutWebinarsRequest());
        setShow(false);
        setLoading(false);
        history.push(router.liveStreamMode.path, { webinar });
      })
      .catch(err => {
        setLoading(false);
        notification.error({
          message: err.message,
        });
      });
  };

  return (
    <Popover
      placement="left"
      visible={show}
      onVisibleChange={handlerPop}
      content={
        <>
          <h3 className={style.sendUrl_title}>Post the link here</h3>
          <Form name="live webinar" onFinish={handlerForm}>
            <Form.Item
              name="webinar_link"
              rules={[
                {
                  required: true,
                  message: 'Please past webinar link',
                  type: 'url',
                },
              ]}
            >
              <Input placeholder="Link goes here..." className={style.sendUrl_input} />
            </Form.Item>
            <Form.Item
              name="start_date"
              rules={[
                {
                  required: true,
                  message: 'Please select start date',
                },
              ]}
              normalize={(value) => {
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
              }}
            >
              <DatePicker
                className={style.datePicker}
                // dropdownClassName={style.datePickerStyle}
                format="MM/DD/YYYY HH:mm"
                placeholder="Select start time"
                disabledDate={current => current && current < moment().endOf('day')}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                // showToday={false}
                // showNow={false}
              />
            </Form.Item>
            <Button loading={loading} type='bns' htmlType='submit' className={style.sendUrl_submit}>
              go live
            </Button>
          </Form>
        </>
      }
      trigger="click"
    >
      <Button onClick={handlerPop} className={style.liveBtn}>
        Live to stream
      </Button>
    </Popover>
  );
};

function SoldOutWebinars({ history }) {
  // const [filter, setFilter] = useState({
  //   limit: '100',
  //   query: '',
  //   page: 1,
  // });

  const dispatch = useDispatch();
  const list = useSelector(state => state.soldOutWebinars.list);
  const loading = useSelector(state => state.soldOutWebinars.listLoading);
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);

  console.log("LIST===", list);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'soldOutWebinarsEdit'));
  }, [permissions]);

  const accessRefund = useMemo(() => permissions?.some((item) => item === 'seatsRefundView'), [
    permissions,
  ]);

  useEffect(() => {
    dispatch(getListSoldOutWebinarsRequest());
  }, []);

  const handleDuplicate = useCallback(
    (product) => {
      history.push(router.editProduct.path, {
        id: product?.id,
        type: 'webinar',
        duplicate: true
      });
    },
    [dispatch, history],
  );

  const handleRefund = ({ id }) => {
    return accessRefund ? history.push(router.seatRefund.path.replace(':id', id)) : null;
  };

  return (
    <div className={style.box}>
      <div className={style.header}>
        <h2 className={style.title}>Sold Out Webinars</h2>
      </div>
      <div className={clsx('box', style.container)}>

      <Filter
        change= {(params) => {dispatch(getListSoldOutWebinarsRequest(params)); console.log(params)}}
        search
       />

        <Table
          loading={loading}
          title={false}
          dataSource={list}
          rowKey={record => record.id}
          pagination={false}
        >
          <Column
            title="Thumbnail"
            dataIndex="main_image"
            render={text => <ImageDownload src={text?.image_url} />}
          />
          <Column
            title="Name"
            dataIndex="name"
            render={(text, record) => <div
              className={clsx(record.product_type !== 'Physical' && accessRefund ? style.pointer : '', 'ellipsis')}
              onClick={
                record.product_type !== 'Physical' && accessRefund ? () => handleRefund(record) : null
              }
            >{text}</div>}
          />
          <Column
            title="Description"
            dataIndex="shortDescription"
            render={text => <div className="ellipsis">{text}</div>}
          />
          <Column
            title="Price"
            dataIndex="price"
            render={text => <div className="ellipsis">$ {text}</div>}
          />
          <Column title="No. of Seats" dataIndex="seats" align="center" />
          <Column
            title='Duplicate'
            dataIndex='duplicate'
            key='duplicate'
            render={(product, record) => 
              <button
                className={style.duplicateBtn}
                onClick={() => handleDuplicate(record)}
              >
                Duplicate
              </button>
            }    
          />
          {edit && <Column
            render={(text, record) =>
              record.product_status === 'soldout' ? (
                <SendUrl webinar={record} history={history}/>
              ) : (

                <Button
                  onClick={() => {
                    history.push(router.liveStreamMode.path, { webinar: record });
                  }}
                  className={style.liveBtn}
                >
                  Select Winners
                </Button>
              )
            }
          />
          }
        </Table>
      </div>
    </div>
  );
}

export default withAuth(withPermissionChecking(SoldOutWebinars));
