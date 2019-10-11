$(document).ready(function () {
        loading()
            .then(() => refreshCityList())
            .then(() => refreshCityInfo())
            .then(() => loading(false));

        $('#city').change(refreshCityInfo);
        $('#date').change(refreshTimeList);
        $('form').submit(submit);
        moment.locale('ru');
    }
);