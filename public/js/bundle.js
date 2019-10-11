"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  var time = $('#time');
  var timeErrMsg = $('#timeErrMsg');
  var phone = $('#phone');
  var phoneErrMsg = $('#phoneErrMsg');
  var name = $('#name');
  var nameErrMsg = $('#nameErrMsg');
  var date = $('#date');
  var dateErrMsg = $('#dateErrMsg');
  date.focusin(function () {
    date.removeClass('uk-form-danger');
    dateErrMsg.hide();
  });
  date.focusout(function () {
    if (date.val() === null) {
      date.addClass('uk-form-danger');
      dateErrMsg.show();
    }
  });
  time.focusin(function () {
    time.removeClass('uk-form-danger');
    timeErrMsg.hide();
  });
  time.focusout(function () {
    if (time.val() === null) {
      time.addClass('uk-form-danger');
      timeErrMsg.show();
    }
  });
  phone.inputmask("+7 (999) 999-99-99", {
    autoclear: false
  });
  phone.focusin(function () {
    phone.removeClass('uk-form-danger');
    phoneErrMsg.hide();
  });
  phone.focusout(function () {
    if (phone.inputmask('unmaskedvalue').length !== 10) {
      phone.addClass('uk-form-danger');
      phoneErrMsg.show();
    }
  });
  name.focusin(function () {
    name.removeClass('uk-form-danger');
    nameErrMsg.hide();
  });
  name.focusout(function () {
    if (name.val() === "") {
      name.addClass('uk-form-danger');
      nameErrMsg.show();
    }
  });
});

function hideAllErrMsg() {
  $('#time').removeClass('uk-form-danger');
  $('#phone').removeClass('uk-form-danger');
  $('#name').removeClass('uk-form-danger');
  $('#date').removeClass('uk-form-danger');
  $('#timeErrMsg').hide();
  $('#phoneErrMsg').hide();
  $('#nameErrMsg').hide();
  $('#dateErrMsg').hide();
}

function getCities() {
  return fetch('https://www.mocky.io/v2/5b34c0d82f00007400376066?mocky-delay=700ms', {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(function (data) {
    return data.json();
  }).then(function (data) {
    return data['cities'];
  });
}

function getAllTime(cityId) {
  return fetch("https://www.mocky.io/v2/".concat(cityId, "?mocky-delay=700ms"), {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(function (data) {
    return data.json();
  }).then(function (data) {
    return data['data'];
  }).then(function (data) {
    if (localStorage.getItem(cityId) === null) {
      localStorage.setItem(cityId, JSON.stringify(data));
    }

    return data;
  });
}

function getAvailableTime(cityId) {
  var dates = JSON.parse(localStorage.getItem(cityId));
  var tmp = {};

  for (var date in dates) {
    for (var time in dates[date]) {
      if (!dates[date][time]['is_not_free']) {
        tmp[date] = _objectSpread({}, tmp[date], _defineProperty({}, time, dates[date][time]));
      }
    }
  }

  return tmp;
}

function formatPhoneNumber(phone) {
  if (phone.length === 10) {
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '+7 ($1) $2 $3-$4');
  } else if (phone.length === 11) {
    return phone.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3 $4-$5');
  } else {
    return phone;
  }
}

function getHtmlCityDescription(info) {
  return "\n        <p class=\"appointment-description\">".concat(info.address, "</p>\n        <p class=\"appointment-description\">").concat(info.phones.map(function (phone) {
    return "<a href=\"tel:".concat(phone, "\" class=\"uk-text-nowrap\">").concat(formatPhoneNumber(phone), "</a>");
  }).join(', '), "</p>\n        <p class=\"appointment-description\">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0443\u0441\u043B\u0443\u0433\u0438 ").concat(info.price.toLocaleString(), " \u20BD</p>\n    ");
}

function refreshCityList() {
  return getCities().then(function (cities) {
    var cityHtml = $('#city');
    cityHtml.empty();
    cities.forEach(function (data) {
      cityHtml.append($("<option value=\"".concat(data.id, "\">").concat(data.name, "</option>")));
    });
    window.cities = cities;
    return cities;
  });
}

function refreshCityDescription() {
  return new Promise(function (resolve) {
    var addressHtml = $('.appointment-address');
    var city = $('#city').val();
    addressHtml.html(getHtmlCityDescription(window.cities.filter(function (el) {
      return el.id === city;
    })[0]));
    resolve();
  });
}

function refreshDateList() {
  var city = $('#city').val();
  var dateHtml = $('#date');
  dateHtml.val('');
  dateHtml.attr('disabled', true);
  return getAllTime(city).then(function () {
    return getAvailableTime(city);
  }).then(function (dates) {
    dateHtml.empty(); // Placeholder

    dateHtml.append('<option value="" disabled selected hidden>Дата</option>');

    for (var el in dates) {
      var formattedDate = moment(el).format('dddd, D MMMM');
      formattedDate = formattedDate[0].toUpperCase() + formattedDate.slice(1);
      dateHtml.append($("<option value=\"".concat(el, "\">").concat(formattedDate, "</option>")));
    }

    dateHtml.attr('disabled', false);
    return dates;
  });
}

function refreshTimeList() {
  var city = $('#city').val();
  var date = $('#date').val();
  var times = getAvailableTime(city)[date];
  var timeHtml = $('#time');
  timeHtml.empty(); // Placeholder

  timeHtml.append($('<option value="" disabled selected hidden>Время</option>'));

  for (var time in times) {
    timeHtml.append($("<option value=\"".concat(time, "\">").concat(times[time]['begin'], " - ").concat(times[time]['end'], "</option>")));
  }

  timeHtml.attr('disabled', false);
}

function loading() {
  var isStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return new Promise(function (resolve) {
    if (isStart) {
      $('#logo').addClass('uk-hidden');
      $('#spinner').removeClass('uk-hidden');
      $('#city').attr('disabled', true);
      $('#date').attr('disabled', true);
      $('#time').attr('disabled', true);
    } else {
      $('#spinner').addClass('uk-hidden');
      $('#logo').removeClass('uk-hidden');
      $('#city').attr('disabled', false);
    }

    resolve();
  });
}

function refreshCityInfo() {
  return new Promise(function (resolve) {
    hideAllErrMsg(); // Reset and blocking time

    var timeHtml = $('#time');
    timeHtml.val('');
    timeHtml.attr('disabled', true);
    loading().then(function () {
      return refreshDateList();
    }).then(function () {
      return refreshCityDescription();
    }).then(function () {
      return loading(false);
    }).then(function () {
      return resolve();
    });
  });
}

function submit(event) {
  var _$$serializeArray = $(this).serializeArray(),
      _$$serializeArray2 = _slicedToArray(_$$serializeArray, 5),
      city = _$$serializeArray2[0],
      date = _$$serializeArray2[1],
      time = _$$serializeArray2[2],
      phone = _$$serializeArray2[3],
      name = _$$serializeArray2[4];

  var dates = JSON.parse(localStorage.getItem(city.value));
  dates[date.value][time.value]['is_not_free'] = true;
  localStorage.setItem(city.value, JSON.stringify(dates));
  UIkit.notification('Вы успешно записались!', 'success'); // Reset form and blocking time

  $("form")[0].reset();
  $('#time').attr('disabled', true);
  event.preventDefault();
}

$(document).ready(function () {
  loading().then(function () {
    return refreshCityList();
  }).then(function () {
    return refreshCityInfo();
  }).then(function () {
    return loading(false);
  });
  $('#city').change(refreshCityInfo);
  $('#date').change(refreshTimeList);
  $('form').submit(submit);
  moment.locale('ru');
});