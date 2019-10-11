function getCities() {
    return fetch('https://www.mocky.io/v2/5b34c0d82f00007400376066?mocky-delay=700ms', {
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(data => data.json())
        .then(data => data['cities']);
}

function getAllTime(cityId) {
    return fetch(`https://www.mocky.io/v2/${cityId}?mocky-delay=700ms`, {
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(data => data.json())
        .then(data => data['data'])
        .then(data => {
            if (localStorage.getItem(cityId) === null) {
                localStorage.setItem(cityId, JSON.stringify(data));
            }
            return data;
        })
}

function getAvailableTime(cityId) {
    const dates = JSON.parse(localStorage.getItem(cityId));
    let tmp = {};
    for (let date in dates) {
        for (let time in dates[date]) {
            if (!dates[date][time]['is_not_free']) {
                tmp[date] = {...tmp[date], [time]: dates[date][time]}
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
    return `
        <p class="appointment-description">${info.address}</p>
        <p class="appointment-description">${info.phones.map(phone => `<a href="tel:${phone}" class="uk-text-nowrap">${formatPhoneNumber(phone)}</a>`).join(', ')}</p>
        <p class="appointment-description">Стоимость услуги ${info.price.toLocaleString()} ₽</p>
    `;
}

function refreshCityList() {
    return getCities()
        .then(cities => {
            const cityHtml = $('#city');
            cityHtml.empty();
            cities.forEach(data => {
                cityHtml.append($(`<option value="${data.id}">${data.name}</option>`));
            });
            window.cities = cities;
            return cities;
        })
}

function refreshCityDescription() {
    return new Promise(resolve => {
        const addressHtml = $('.appointment-address');
        const city = $('#city').val();
        addressHtml.html(getHtmlCityDescription(window.cities.filter(el => el.id === city)[0]));
        resolve();
    });
}

function refreshDateList() {
    const city = $('#city').val();
    const dateHtml = $('#date');
    dateHtml.val('');
    dateHtml.attr('disabled', true);
    return getAllTime(city)
        .then(() => getAvailableTime(city))
        .then(dates => {
            dateHtml.empty();
            // Placeholder
            dateHtml.append('<option value="" disabled selected hidden>Дата</option>');
            for (const el in dates) {
                let formattedDate = moment(el).format('dddd, D MMMM');
                formattedDate = formattedDate[0].toUpperCase() + formattedDate.slice(1);
                dateHtml.append($(`<option value="${el}">${formattedDate}</option>`));
            }
            dateHtml.attr('disabled', false);
            return dates;
        })
}

function refreshTimeList() {
    const city = $('#city').val();
    const date = $('#date').val();
    const times = getAvailableTime(city)[date];
    const timeHtml = $('#time');
    timeHtml.empty();
    // Placeholder
    timeHtml.append($('<option value="" disabled selected hidden>Время</option>'))
    for (const time in times) {
        timeHtml.append($(`<option value="${time}">${times[time]['begin']} - ${times[time]['end']}</option>`))
    }
    timeHtml.attr('disabled', false);
}

function loading(isStart = true) {
    return new Promise(resolve => {
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
    })
}

function refreshCityInfo() {
    return new Promise(resolve => {
        hideAllErrMsg();
        // Reset and blocking time
        const timeHtml = $('#time');
        timeHtml.val('');
        timeHtml.attr('disabled', true);

        loading()
            .then(() => refreshDateList())
            .then(() => refreshCityDescription())
            .then(() => loading(false))
            .then(() => resolve())
    });
}

function submit(event) {
    const [city, date, time, phone, name] = $(this).serializeArray();
    let dates = JSON.parse(localStorage.getItem(city.value));
    dates[date.value][time.value]['is_not_free'] = true;
    localStorage.setItem(city.value, JSON.stringify(dates));
    UIkit.notification('Вы успешно записались!', 'success');
    // Reset form and blocking time
    $("form")[0].reset();
    $('#time').attr('disabled', true);
    event.preventDefault();
}

