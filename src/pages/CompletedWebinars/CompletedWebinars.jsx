import { Button, Select, Table } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Filter from '../../components/Filter';
import * as Actions from './../../redux/completedWebinars/completedWebinarsActions';
import * as style from './CompletedWebinars.module.scss';
import { useCallback } from 'react';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';
import withAuth from '../../utils/HOC/withAuth';
import { rolesSelector } from '../../redux/roles/Selectors';
import ImageDownload from '../../components/ImageDownload';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import { useHistory } from 'react-router-dom';
import router from '../../router';
const { Column } = Table;
const { Option } = Select;

function SetFFL({ record, fflList, init_val }) {
  const [ffl_id, setFdlId] = useState(null);
  const dispatch = useDispatch();
  const saveFfl = (event) => {
    event.stopPropagation();
    dispatch(Actions.saveFflWinnerRequest({ ffl_id, winner_id: record.winners[0].id }));
  };

  return (
    <div className={style.setFFL}>
      <Select
        // loading={true}
        defaultValue={init_val}
        showSearch
        style={{ width: '200px', padding: 0 }}
        className="no-right-radius"
        allowClear
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(value, option) => {
          setFdlId(option?.key || null);
        }}
      >
        {fflList.map((elem) => (
          <Option key={elem.id} value={elem.ffl_name} id={elem.id}>
            {elem.ffl_name}
          </Option>
        ))}
      </Select>
      <Button onClick={saveFfl}>
        Ок
      </Button>
    </div>
  );
}

function expandedRowRender(records, index, indent, expanded) {
  const winners = records.winners.sort((a, b) => (a.position < b.position ? -1 : 1));

  const checkActive = (type) => {
    return ['soldout', 'hold', 'progress', 'done'].includes(type);
  };

  return (
    <>
      <Table
        dataSource={winners}
        pagination={false}
        rowKey={(record) => records.id}
        title={(e) => 'Winners'}
        rowClassName={(record, i) =>
          checkActive(record?.seats?.webinar.product_status) && record.seats.number_used > 0
            ? style.danger
            : null
        }
      >
        <Column dataIndex="position" title="Position" />
        <Column dataIndex={['user_data', 'username']} title="Contact name" />
        <Column dataIndex={['user_data', 'phone_number']} title="Contact Phone" />
        <Column dataIndex={['user_data', 'email']} title="Contact Email" />
        {records.webinar_type === 'gifts' && (
          <Column dataIndex={['gifts', 'amount']} title="Amount" render={(text) => `${text}$`} />
        )}
        {!records.winners[0].ffl_id && (
          <Column dataIndex={['user_data', 'address']} title="Address" />
        )}
        {records.webinar_type === 'seats' && (
          <Column
            title="Status"
            render={(text, record) => (record.seats.number_used > 0 ? 'Not used' : 'Used')}
          />
        )}
      </Table>
    </>
  );
}

function CompletedWebinars() {

  const history = useHistory();
  const { data, loading } = useSelector((state) => state.completedWebinars);
  const { list, ffl, total } = data;
  console.log(ffl);
  const [filter, setFilter] = useState({
    limit: 10,
    offset: 0,
  });
  const permissions = useSelector(rolesSelector);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setEdit(permissions?.some((item) => item === 'completedWebinarsEdit'));
  }, [permissions]);
  const dispatch = useDispatch();
  const timezone = useSelector((state) => state.setting)?.settingInfo.time_zone;
  useEffect(() => {
    dispatch(Actions.getListRequest(filter));
  }, [filter]);

  const checkActive = useCallback((type) => {
    return ['soldout', 'hold', 'progress', 'done'].includes(type);
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

  return (
    <div className={style.box}>
      <div className={style.header}>
        <h2 className={style.title}>Completed Webinars</h2>
      </div>
      <div className={clsx('box', style.container)}>
        <Filter change={setFilter} total={total} placeholder="Search by user name" search/>

        <Table
          loading={loading}
          title={false}
          pagination={false}
          dataSource={list}
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
          <Column
            title="Thumbnail"
            dataIndex={['main_image', 'image_url']}
            render={(text) => <ImageDownload src={text} />}
            className={style.smallCol}
            align="center"
          />
          <Column
            title="Webinar Name"
            dataIndex="name"
            render={(text, record) => {
              if (record.webinar_type !== 'seats') {
                return text;
              }
              if (
                record.winners.some(
                  (el) => checkActive(el?.seats?.webinar?.product_status) && el?.seats?.number_used > 0,
                )
              ) {
                return <span className={style.warning}>{text}</span>;
              } else {
                return text;
              }
            }}
          />
          <Column
            title="Webinar Description"
            dataIndex="shortDescription"
            render={(text) => <div className="ellipsis">{text}</div>}
          />
          <Column
            title="Type"
            dataIndex="webinar_type"
            render={(text) => {
              switch (text) {
                case 'seats':
                  return 'Webinar Seats Webinar';
                case 'gifts':
                  return 'Gift Card Webinar';
                case 'webinar':
                  return 'Normal Webinar';
              }
            }}
          />
          <Column
            title="Sold Out Date"
            dataIndex="soldout_date"
            render={(value) => (value ? parseTimeZone(value, timezone) : '')}
          />
          <Column
            title="FFL"
            render={(text, record) => {
              let ffl_no = "";
              ffl_no = ffl.find((el) => el.id === record?.winners[0]?.ffl_id)?.ffl_name;
              return record.webinar_type === 'webinar'
                ?                     
                  edit && <SetFFL record={record} init_val={ffl_no} fflList={ffl} filter={filter} />
                : null;
            }}
          />
          <Column
            title='Duplicate'
            dataIndex='duplicate'
            render={(product, record) => 
              <button
                className={style.duplicateBtn}
                onClick={() => handleDuplicate(record)}
              >
                Duplicate
              </button>
            }    
          />
        </Table>
      </div>
    </div>
  );
}

export default withAuth(withPermissionChecking(CompletedWebinars));
