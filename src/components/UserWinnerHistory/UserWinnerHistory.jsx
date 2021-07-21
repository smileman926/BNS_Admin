import React from 'react';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import { parseTimeZone } from '../../helpers/timeZoneParse';

const { Column } = Table;

function UserWinnerHistory({ data }) {
  const timezone = useSelector((state) => state.setting)?.settingInfo.time_zone;

  return (
    <Table dataSource={data} pagination={false}>
      <Column
        title="Date"
        dataIndex={'updatedAt'}
        render={(value) => parseTimeZone(value, timezone)}
      />
      <Column title="Webinar name" dataIndex={['webinar_parent', 'name']} />
      <Column
        title="Webinar type"
        dataIndex={['webinar_parent', 'webinar_type']}
        render={(text) => {
          switch (text) {
            case 'seats':
              return 'Webinar Seats Webinar';
            case 'gifts':
              return 'Gift Card Webinar';
            case 'webinar':
              return 'Normal Webinar';
            default:
              return 'None';
          }
        }}
      />
      <Column
        title="Prize"
        dataIndex="product_type"
        render={(text, record) => {
          switch (text) {
            case 'promo_code':
              return record.seats?.webinar.name;
            case 'gift_card':
              return `${record.gifts?.amount || 0} $`;
            case 'webinar':
              return record.webinar_parent?.name || 'None';
            default:
              return 'None';
          }
        }}
      />
    </Table>
  );
}

export default UserWinnerHistory;
