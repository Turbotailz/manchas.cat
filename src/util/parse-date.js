import { isValid, parseJSON, format } from 'date-fns';

export default function parseDate(jsonDate) {
  const date = parseJSON(jsonDate);
  return isValid(date) ?  format(date, process.env.DATE_FORMAT) : ' ';
}
