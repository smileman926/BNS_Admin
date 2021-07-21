import React, { useEffect, useRef, useState } from 'react';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  Col, Input, Pagination, Row, Select,
} from 'antd';
import { useLocation } from 'react-router-dom';
import * as style from './Filter.module.scss';

const { Option } = Select;
const { Search } = Input;

function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return (
      <a>
        <LeftOutlined />
        {' '}
        Previous
      </a>
    );
  }
  if (type === 'next') {
    return (
      <a>
        Next
        {' '}
        <RightOutlined />
      </a>
    );
  }

  return originalElement;
}

function Filter({
  change, setGetProdFilter, total, placeholder, productFilter, productStatus, webinarType, search, id,
}) {
  const [filter, setFilter] = useState({
    query: '',
    limit: 50,
    offset: 0,
    // page: 1,
    param: webinarType,
    filterString: '',
    id,
  });
  const [page, setPage] = useState(1);

  const prevRef = useRef();
  useEffect(() => {
    prevRef.current = filter;
  });
  const prevFilter = prevRef.current;
  useEffect(() => {
    setFilter({
      ...filter, offset: ((page - 1) * filter.limit),
    });
    // eslint-disable-next-line
  },[page]);

  useEffect(() => {
    if (!productStatus) {
      return;
    }
    setFilter({ ...filter, status: productStatus });
    // eslint-disable-next-line
  },[productStatus])

  useEffect(() => {
    if (!webinarType) {
      return;
    }
    setFilter({ ...filter, param: webinarType });
    // eslint-disable-next-line
  },[webinarType])

  useEffect(() => {
    if (!productFilter) {
      return;
    }
    setFilter({ ...filter, filter: productFilter });
    // eslint-disable-next-line
  },[productFilter])

  useEffect(() => {
    if (JSON.stringify(prevFilter) === JSON.stringify(filter)) {
      return;
    }    
    change(filter);
    setGetProdFilter && setGetProdFilter(filter);
    // eslint-disable-next-line
  }, [filter]);

  const handlerLimit = (value) => {
    const limit = parseInt(value, 10);
    setFilter({ ...filter, limit });
  };
  const handlerFilterName = (query) => setFilter({ ...filter, filterString: encodeURIComponent(query), offset: 0 });
  const handlerPage = (page) => setPage( page );


  return (
    <Row>
      <Col>
        <Select
          style={{padding: 0}}
          value={filter.limit}
          defaultValue={filter.limit}
          onChange={handlerLimit}
          className={style.select}
        >
          <Option value='10'>10</Option>
          <Option value='20'>20</Option>
          <Option value='30'>30</Option>
          <Option value='40'>40</Option>
          <Option value='50'>50</Option>
        </Select>
        <p className={style.titleLimit}>Per Page</p>
      </Col>
      {search &&
      <Col>
        <Search
          className={style.search}
          placeholder='search by filter fields'
          onSearch={(value) => handlerFilterName(value)}
        />
      </Col>
      }
      <Col />
      <Col className={style.colPagination}>
        <Pagination
          current={page}
          total={total}
          itemRender={itemRender}
          pageSize={filter.limit}
          onChange={handlerPage}
          showSizeChanger={false}
          showTitle={false}
        />
      </Col>
    </Row>
  );
}

export default Filter;
