// import moment from 'moment';


export const monthNames: string[] = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// export function toDate(dateInput: moment.MomentInput): string {
//   return moment(dateInput).format('DD-MM-YYYY');
// }

// export function toDatenew(dateInput: moment.MomentInput): string {
//   return moment(dateInput).format('DD-MM-YY');
// }

// export function toTime(timeInput: moment.MomentInput): string {
//   return moment(timeInput).format('HH:mm:ss');
// }

export function splittime(value: string): string {
  const [hh, mm] = value.split(':');
  return `${hh}:${mm}`;
}

export function toDecimal(decimalInput: number): string {
  return decimalInput.toFixed(2);
}

export function toINR(currencyInput: number): string {
  return currencyInput.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });
}

export function toNumber(numberInput: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(numberInput);
}

export function padTo2Digits(num: number): string {
  return num.toString().padStart(2, '0');
}

export function formatDate(date: Date): string {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
