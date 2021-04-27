export default (function (o, c, dayjs) {
  // locale needed later
  var proto = c.prototype;

  var getShort = function getShort(ins, target, full, num) {
    var locale = ins.name ? ins : ins.$locale();

    if (!locale[target]) {
      return locale[full].map(function (f) {
        return f.substr(0, num);
      });
    }

    return locale[target];
  };

  var getDayjsLocaleObject = function getDayjsLocaleObject() {
    return dayjs.Ls[dayjs.locale()];
  };

  var localeData = function localeData() {
    var _this = this;

    return {
      months: function months(instance) {
        return instance ? instance.format('MMMM') : getShort(_this, 'months');
      },
      monthsShort: function monthsShort(instance) {
        return instance ? instance.format('MMM') : getShort(_this, 'monthsShort', 'months', 3);
      },
      firstDayOfWeek: function firstDayOfWeek() {
        return _this.$locale().weekStart || 0;
      },
      weekdaysMin: function weekdaysMin(instance) {
        return instance ? instance.format('dd') : getShort(_this, 'weekdaysMin', 'weekdays', 2);
      },
      weekdaysShort: function weekdaysShort(instance) {
        return instance ? instance.format('ddd') : getShort(_this, 'weekdaysShort', 'weekdays', 3);
      },
      longDateFormat: function longDateFormat(format) {
        return _this.$locale().formats[format];
      }
    };
  };

  proto.localeData = function () {
    return localeData.bind(this)();
  };

  dayjs.localeData = function () {
    var localeObject = getDayjsLocaleObject();
    return {
      firstDayOfWeek: function firstDayOfWeek() {
        return localeObject.weekStart || 0;
      },
      weekdays: function weekdays() {
        return dayjs.weekdays();
      },
      weekdaysShort: function weekdaysShort() {
        return dayjs.weekdaysShort();
      },
      weekdaysMin: function weekdaysMin() {
        return dayjs.weekdaysMin();
      },
      months: function months() {
        return dayjs.months();
      },
      monthsShort: function monthsShort() {
        return dayjs.monthsShort();
      }
    };
  };

  dayjs.months = function () {
    return getDayjsLocaleObject().months;
  };

  dayjs.monthsShort = function () {
    return getShort(getDayjsLocaleObject(), 'monthsShort', 'months', 3);
  };

  dayjs.weekdays = function () {
    return getDayjsLocaleObject().weekdays;
  };

  dayjs.weekdaysShort = function () {
    return getShort(getDayjsLocaleObject(), 'weekdaysShort', 'weekdays', 3);
  };

  dayjs.weekdaysMin = function () {
    return getShort(getDayjsLocaleObject(), 'weekdaysMin', 'weekdays', 2);
  };
});