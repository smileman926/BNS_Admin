import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Select, Row, Col } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as style from './CounterChart.module.scss';
import moment from 'moment';

const { Option } = Select;

const CustomizedDot = props => {
  const { cx, cy } = props;

  return <circle cx={cx} cy={cy} r={3} stroke="#83e363" strokeWidth={2} fill="white" />;
};

const CounterChart = props => {

  const timeZone = useSelector((state) => state.setting)?.settingInfo?.time_zone;

  const {
    title = 'Chart',
    isRevenue,
    periodList,
    revenueList,
    chartData,
    initialPeriod = 'day',
    initialRevenue = 'both',
    onChange,
    type
  } = props;
  
  const [period, setPeriod] = useState(initialPeriod);
  const [revenue, setRevenue] = useState(initialRevenue);

  const [totalValue, setTotalValue] = useState();

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      let tempTotalVal = 0;
      chartData.map( data => {         
          tempTotalVal += data.amount;
      });
      tempTotalVal = tempTotalVal.toString();
      if (tempTotalVal.indexOf(".") > -1)
          tempTotalVal = tempTotalVal.slice(0, (tempTotalVal.indexOf("."))+3);
      setTotalValue(Number(tempTotalVal));
    }
  }, [chartData]);

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

  useEffect(() => {
    onChange(period, revenue);
  }, [period, revenue]);

  return (
    <Row className={style.chart_container}>
      <Row className={style.chart_header}>
        <Col className={style.chart_header_title}>{title}</Col>
        <Col className={style.chart_header_filter}>
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
              domain={[0, Math.max(...chartData.map(el => Number(el.amount))) || 4]}
              tick={{ fill: 'white' }}
              tickFormatter={e => +e}
            />
            <Tooltip
              labelStyle={{ color: '#000' }}
              itemStyle={{ color: '#000' }}
              formatter={(value,) => [value + type,'Total']}
              labelFormatter={(data) => timeZone ? moment(data).tz(timeZone).format('MM/DD/YYYY hh A') : moment(data).format('MM/DD/YYYY hh A')}
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
      {
        isRevenue && period === "day" &&
        <p className={style.total_revenue}>Total Revenue: ${totalValue}</p>
      }
    </Row>
  );
};

export default CounterChart;
