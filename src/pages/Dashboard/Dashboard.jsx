import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import withAuth from '../../utils/HOC/withAuth';
import CounterChart from '../../components/CounterChart';
import CategorySalesChart from '../../components/CategorySalesChart';
import * as dashboardActions from './../../redux/dashboard/dashboardActions';
import * as style from './Dashboard.module.scss';
import moment from 'moment';
import withPermissionChecking from '../../utils/HOC/withPermissionsChecking';

const periodList = [
  { id: 'day', name: 'Day' },
  { id: 'week', name: 'Week' },
  { id: 'month', name: 'Month' },
  { id: 'year', name: 'Year' },
];

const revenueList = [
  { id: 'webinar', name: 'Webinars' },
  { id: 'physical', name: 'Physical' },
  { id: 'both', name: 'Both' },
];

function Dashboard() {
  const dispatch = useDispatch();
  const revenueData = useSelector(state => state.dashboard.revenueData);
  const memberData = useSelector(state => state.dashboard.memberData);
  const categorySalesData = useSelector(state => state.dashboard.categorySalesData);
  const timeZone = useSelector((state) => state.setting)?.settingInfo?.time_zone;

  const endTime = useMemo(() => timeZone ? moment().tz(timeZone).toISOString() : moment().toISOString(), []);

  const handlerRevenue = (unit, product_type) => {
    let startTime = moment();
    if ( unit === 'day' )
      startTime = timeZone ? startTime.tz(timeZone).startOf('day').toISOString() : startTime.startOf('day').toISOString();
    else {
      startTime = startTime.utc().subtract(1, unit); 
      startTime = startTime.toDate(); 
      startTime.setMinutes(0);
      startTime.setSeconds(0);
      startTime = startTime.toISOString();
    }   
    switch (unit) {
      case 'year':
        unit = 'month';
        break;
      case 'month':
        unit = 'day';
        break;
      case 'week':
        unit = 'day';
        break;
      case 'day':
        unit = 'hour';
        break;
    }

    return {
      startTime,
      endTime,
      unit,
      product_type,
    };
    // return request;
    // dispatch(dashboardActions.getRevenueDataRequest(request));
  };


  return (
    <Row className={style.container}>
      <Row type="flex" justify="space-around" gutter={[32, 32]}>
        <Col sm={12} className={style.counter_chart}>
          <CounterChart
            title="Revenue Counter"
            isRevenue={true}
            periodList={periodList}
            revenueList={revenueList}
            type="$"
            chartData={revenueData}
            onChange={(unit, product_type) =>
              dispatch(dashboardActions.getRevenueDataRequest(handlerRevenue(unit, product_type)))
            }
          />
        </Col>
        <Col sm={12} className={style.counter_chart}>
          <CounterChart
            title="Member Counter"
            isRevenue={false}
            periodList={periodList}
            chartData={memberData}
            type=""
            onChange={(unit, product_type) =>
              dispatch(dashboardActions.getMemberDataRequest(handlerRevenue(unit, product_type)))
            }
          />
        </Col>
      </Row>
      <Row type="flex" justify="space-around" gutter={[32, 32]}>
        <Col sm={24} className={style.counter_chart}>
          <CategorySalesChart
            title="Category sales"
            periodList={periodList}
            revenueList={revenueList}
            type="$"
            chartData={categorySalesData}
            queryParams={handlerRevenue}
          />
        </Col>
      </Row>
    </Row>
  );
}

export default withAuth(withPermissionChecking(Dashboard));
