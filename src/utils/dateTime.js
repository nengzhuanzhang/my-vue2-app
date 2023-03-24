/**
 * 时间日期相关操作
 */

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format(datetime) {
  return formatWithSeperator(datetime, "-", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator(datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    var month = dateMat.getMonth() + 1;
    var day = dateMat.getDate();
    var hh = dateMat.getHours();
    var mm = dateMat.getMinutes();
    var ss = dateMat.getSeconds();
    month = ("0" + month).slice(-2);
    day = ("0" + day).slice(-2);
    hh = ("0" + hh).slice(-2);
    mm = ("0" + mm).slice(-2);
    ss = ("0" + ss).slice(-2);
    const timeFormat =
      year +
      dateSeprator +
      month +
      dateSeprator +
      day +
      " " +
      hh +
      timeSeprator +
      mm +
      timeSeprator +
      ss;
    return timeFormat;
  }
}

export function formatDate(datetime, dateSeprator = "-") {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    var month = dateMat.getMonth() + 1;
    var day = dateMat.getDate();
    month = ("0" + month).slice(-2);
    day = ("0" + day).slice(-2);
    const timeFormat = year + dateSeprator + month + dateSeprator + day;
    return timeFormat;
  }
}
