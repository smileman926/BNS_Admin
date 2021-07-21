import { Table } from 'antd';
import React from 'react';
import ImageDownload from '../ImageDownload';
import { parseTimeZone } from '../../helpers/timeZoneParse';
import { useSelector } from 'react-redux';

const { Column } = Table;

function expandedRowRender(records, index, indent, expanded) {
  const { purchase } = records;
  return (
    <Table dataSource={purchase} pagination={false} rowKey={(record) => records.id}>
      <Column
        dataIndex="product_type"
        title="Thumbnail"
        align="center"
        render={(value, record) => {
          let correct = '';
          switch (value) {
            case 'webinar':
              correct = record.webinar_product?.main_image?.image_url;
              break;
            case 'product':
              correct = record.productInfo?.main_image?.image_url;
              break;
            default:
              return '';
          }

          return <ImageDownload src={correct} />;
        }}
      />
      <Column
        dataIndex="product_type"
        title="Name"
        render={(value, record) => {
          switch (value) {
            case 'webinar':
              return record.webinar_product?.name;
            case 'product':
              return record.productInfo?.productName;
            default:
              return '';
          }
        }}
      />
      <Column title="Product type" dataIndex="product_type" />
      <Column
        dataIndex="product_type"
        title="Quantity/Seats"
        align="center"
        render={(value, record) => {
          switch (value) {
            case 'webinar':
              return record.seatsNo + 1;
            case 'product':
              return record.units;
            default:
              return '';
          }
        }}
      />
      <Column
        dataIndex="product_type"
        title="Price for one unit"
        render={(value, record) => {
          switch (value) {
            case 'webinar':
              return record.webinar_product?.price_per_seats + ' $';
            case 'product':
              return record.productInfo.pricePerItem + ' $';
            default:
              return '';
          }
        }}
      />
       <Column
        dataIndex="order_status"
        title="Status"
        render={(value, record) => {
          return record?.orderStatus
        }}
      />
    </Table>
  );
}

function UserPurchaseHistory({ data }) {
  const timezone = useSelector((state) => state.setting)?.settingInfo.time_zone;
  return (
    <Table
      dataSource={data?.sort((a, b) => (a.id > b.id ? -1 : 1))}
      pagination={false}
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
        title="Date"
        dataIndex={'createdAt'}
        render={(value) => parseTimeZone(value, timezone)}
      />
      <Column title="ID" dataIndex="id" />
      <Column
        title="Promo Code"
        dataIndex={['promoCode', 'amount']}
        render={(value, record) => {
          let type = '';

          switch (record.promoCode?.code_type) {
            case 'percent':
              return `${value} %`;
            case 'cost':
              return `${value} $`;
            case 'seat':
              return `${value} seat`;
            default:
              return '';
          }
        }}
      />
      <Column
        title="Gift Card"
        dataIndex="gift_card_amount"
        render={(value) => (value ? `${value} $` : '')}
      />
      <Column title="Total" dataIndex="amount" render={(value) => (value ? `${value} $` : '')} />
    </Table>
  );
}

export default UserPurchaseHistory;
