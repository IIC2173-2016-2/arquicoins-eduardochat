var url = window.location.href;
var arr = url.split("/");
var server_url = arr[0] + "//" + arr[2] + "/arquicoins/";

$(document).ready(function () {
    //==========================Load Data=======================================
    $.get(server_url + 'data/arquicoins/', function (data, status) {
        if (status === 'success') {
            $('#ArquicoinsFunds').text(data.amount);
        } else {
            $('#ArquicoinsFunds').text('Error');
        }
    }).fail(function () {
        $('#ArquicoinsFunds').text('Error');
    });

    $.get(server_url + 'data/paymentinfo/', function (data, status) {
        if (status === 'success') {
            $('#account_type').val(data.accountType);
            $('#credit_number').val(data.creditNumber);
            $('#csv_number').val(data.csvNumber);
        }
    }).fail(function () {
        alert('No se pudo obtener la información de pago del usuario.');
    });

    //==========================Transfer========================================

    $('#transferForm').submit(function (event) {
        var toUsername = $('#Transfer').val();
        var amount = $('#Amount').val();

        $.ajax({
            type: "POST",
            url: server_url + 'data/arquicoins/transfer',
            data: {
                toUsername: toUsername,
                amount: amount
            },
            success: function (data, status, jqXHR) {
                if (status === 'success') {
                    $('#ArquicoinsFunds').text(data.amount);
                    $('#Amount_to_buy').val(0);
                }
            },
            error: function (jqXHR, status, errorThrown) {
                alert(jqXHR.statusText + ': ' + jqXHR.responseText);
            }
        });
        event.preventDefault();
    });

    //==========================PaymentInfo========================================

    $('#paymentInfoForm').submit(function (event) {
        var accountType = $('#account_type').val();
        var creditNumber = $('#credit_number').val();
        var csvNumber = $('#csv_number').val();

        if(accountType && creditNumber && csvNumber) {
            $.ajax({
                type: "PATCH",
                url: server_url + 'data/paymentinfo',
                data: {
                    accountType: accountType,
                    creditNumber: creditNumber,
                    csvNumber: csvNumber
                },
                success: function (data, status, jqXHR) {
                    if (status === 'success') {
                        alert('Información de Pago Actualizada');
                    }
                },
                error: function (jqXHR, status, errorThrown) {
                    if(errorThrown) {
                        alert(errorThrown);
                    } else {
                        alert('No se pudo actualizar la información de pago');
                    }
                }
            });
        } else {
            alert('Falta información de pago por rellenar.');
        }

        event.preventDefault();
    });


    //========================Buy Arquicoins====================================

    $('#buyForm').submit(function (event) {
        var amount = $('#Amount_to_buy').val();

        $.ajax({
            type: "POST",
            url: server_url + 'data/arquicoins/buy',
            data: {
                amount: amount
            },
            success: function (data, status, jqXHR) {
                if (status === 'success') {
                    $('#ArquicoinsFunds').text(data.amount);
                    $('#Amount_to_buy').val(0);
                }
            },
            error: function (jqXHR, status, errorThrown) {
                alert(jqXHR.statusText + ': ' + jqXHR.responseText);
            }
        });
        event.preventDefault();
    });

    //==========================================================================
});
