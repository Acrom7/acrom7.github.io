function getCities() {
    return fetch('https://www.mocky.io/v2/5b34c0d82f00007400376066?mocky-delay=700ms')
        .then(data => data.json())
        .then(data => data['cities']);
}

function renderRow(city, day) {
    return `
        <tr>
            <td data-value="${city.id}">${city.name}</td>
            <td data-value="${day.day}">${day.day}</td>
            <td data-value="${day.date}">${day.begin} - ${day.end}</td>
            <td><button class="uk-button uk-button-primary" onclick="deleteRecord(this)">X</button></td>
        </tr>
    `;
}

function deleteRecord(event) {
    const row = $(event).parent().parent();
    const array = row.children();
    const city = array[0].getAttribute('data-value');
    const date = array[1].getAttribute('data-value');
    const time = array[2].getAttribute('data-value');

    row.addClass('uk-animation-slide-left uk-animation-reverse');
    setTimeout(() => row.remove(), 400)
    let dates = JSON.parse(localStorage.getItem(city));
    dates[date][time]['is_not_free'] = false;
    localStorage.setItem(city, JSON.stringify(dates));
}

function displayRecords() {
    getCities()
        .then(cities => {
            const table = $('table');
            cities.forEach(city => {
                let records = JSON.parse(localStorage.getItem(city['id']));
                if (records !== null) {
                    for (const date in records) {
                        for (const time in records[date]) {
                            if (records[date][time]['is_not_free']) {
                                table.append(renderRow(city, records[date][time]))
                            }
                        }
                    }
                }
            })
        });

}

displayRecords()