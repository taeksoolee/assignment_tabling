export default class Converter {
  static xss(str) {
    return str.replace(/</g, '&lt').replace(/>/g, '&gt');
  }

  static timeText(dateStr) {
    const str = dateStr.replace(/[- :]/g, '');
    return str.slice(8, 10)+':'+str.slice(10, 12);
  }

  static longText(str, max=30) {
    if(str.length > max) {
      return str.slice(0, max) + '...';
    }

    return str;
  }

  static statusText(str) {
    return str === 'reserved' ? '예약' : '착석중'
  }

  static statusButtonText(str) {
    return str === 'reserved' ? '착석' : '퇴석';
  }

  static numberText(num, length=2) {
    const blankLength = length - (num+'').length;
    return new Array(blankLength).fill(0).join('')+num;
  }
}