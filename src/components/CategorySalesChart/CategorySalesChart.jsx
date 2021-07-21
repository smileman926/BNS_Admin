import { Col, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCategoriesRequest } from './../../redux/categories/categoriesActions';
import {
  getCategorySalesDataRequest,
  getCategorySalesDataSuccess,
} from './../../redux/dashboard/dashboardActions';
import * as style from './CategorySalesChart.module.scss';
const { Option } = Select;

const CustomizedDot = props => {
  const { cx, cy } = props;

  return <circle cx={cx} cy={cy} r={3} stroke="#83e363" strokeWidth={2} fill="white" />;
};

const CategorySalesChart = props => {

  const timeZone = useSelector((state) => state.setting)?.settingInfo?.time_zone;
  
  const {
    title = 'Chart',
    periodList,
    revenueList,
    chartData,
    initialPeriod = 'day',
    initialRevenue = 'both',
    queryParams,
    type,
  } = props;

  const [period, setPeriod] = useState(initialPeriod);
  const [revenue, setRevenue] = useState(initialRevenue);

  const formatDate = date => {
    let format = '';
    switch (period) {
      case 'day':
        format = 'hh a';
        break;
      case 'week':
        format = 'dddd';
        break;
      case 'month':
        format = 'DD.MM';
        break;
      case 'year':
        format = 'MMM';
        break;
    }
    return timeZone ? moment(date).tz(timeZone).format(format) : moment(date).format(format)
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoriesRequest());
  }, []);

  const categories = useSelector(state => state.categories.list);

  const categoriesList = useMemo(
    () => {
     return revenue === 'both' ?
      categories.filter(
        el => el.product_type.includes('physical') || el.product_type.includes('standard') || el.product_type.includes('gift') || el.product_type.includes('mini'),
      )
      : revenue === 'physical' ?
      categories.filter(
        el => el.product_type.includes('physical'),
      )
      :
      categories.filter(
        el => el.product_type.includes('standard') || el.product_type.includes('gift') || el.product_type.includes('mini'),
      )
    },
    [revenue, categories],
  );

  const [category_id, setCategory] = useState(null);

  useEffect(() => {
    const query = queryParams(period, revenue);
    const test = categories.find(el => el.id === category_id);
    if (
      categories.length > 0 &&
      test &&
      (test.product_type.includes('physical') || test.product_type.includes('standard') || test.product_type.includes('gift') || test.product_type.includes('mini'))
    ) {
      dispatch(getCategorySalesDataRequest({ ...query, category_id }));
    } else {
      dispatch(getCategorySalesDataSuccess([]));
      setCategory();
    }
  }, [period, revenue, category_id]);

  return (
    <Row className={style.chart_container}>
      <Row className={style.chart_header}>
        <Col className={style.chart_header_title}>{title}</Col>
        <Col className={style.chart_header_filter}>
          {categoriesList && (
            <Col className={style.chart_header_revenue}>
              <Select
                showSearch
                placeholder="Please select"
                optionFilterProp="children"
                className={style.select_categories}
                value={category_id}
                onChange={setCategory}
              >
                {categoriesList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.category_name}
                  </Option>
                ))}
              </Select>
            </Col>
          )}
          {revenueList && (
            <Col className={style.chart_header_revenue}>
              <Select
                showSearch
                placeholder="Please select"
                optionFilterProp="children"
                className={style.chart_header_revenue_select}
                value={revenue}
                onChange={value => setRevenue(value)}
              >
                {revenueList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
          )}
          {periodList && (
            <Col className={style.chart_header_period}>
              <Select
                showSearch
                placeholder="Please select"
                optionFilterProp="children"
                className={style.chart_header_period_select}
                value={period}
                onChange={value => setPeriod(value)}
              >
                {periodList.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
          )}
        </Col>
      </Row>
      <Row className={style.chart_content}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 40, left: 10, bottom: 30 }}
            fill="#fff"
          >
            <CartesianGrid horizontal={false} color="#fff" stroke="#606060" />
            <defs>
              <linearGradient id="colorReport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(150, 150, 150, 0.8)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="rgba(150, 150, 150, 0)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fill: 'white' }} />
            <YAxis
              dataKey="amount"
              type="number"
              domain={[0, Math.max(...chartData.map(el => Number(el.amount)))]}
              tick={{ fill: 'white' }}
              tickFormatter={e => +e}
            />
            <Tooltip
              labelStyle={{ color: '#000' }}
              itemStyle={{ color: '#000' }}
              formatter={value => [value + type, 'Total']}
              labelFormatter={data => timeZone ? moment(data).tz(timeZone).format('MM/DD/YYYY hh A') : moment(data).format('MM/DD/YYYY hh A')}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#83e363"
              fillOpacity={1}
              fill="url(#colorReport)"
              dot={<CustomizedDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Row>
    </Row>
  );
};

export default CategorySalesChart;
