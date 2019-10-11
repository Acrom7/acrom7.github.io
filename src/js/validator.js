$(document).ready(function () {
        const time = $('#time');
        const timeErrMsg = $('#timeErrMsg');
        const phone = $('#phone');
        const phoneErrMsg = $('#phoneErrMsg');
        const name = $('#name');
        const nameErrMsg = $('#nameErrMsg');
        const date = $('#date');
        const dateErrMsg = $('#dateErrMsg');

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

        phone.inputmask("+7 (999) 999-99-99", {autoclear: false});
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
    }
);

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
