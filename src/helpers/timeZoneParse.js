import moment from 'moment-timezone';


export const parseTimeZone = (date, timezone) => {
 return  moment(date)?.tz(timezone)?.format('MM/DD/YYYY LTS');
}
