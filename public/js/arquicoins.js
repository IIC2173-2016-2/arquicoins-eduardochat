var url = window.location.href
var arr = url.split("/");
var server_url = arr[0] + "//" + arr[2] + "/arquicoins/";

$(document).ready(function() {
    //==========================Load Data=======================================
    $.get(server_url + 'data/arquicoins/', function(data, status) {
      if(status==='success'){
        $('#ArquicoinsFunds').text(data.amount);
      } else {
        $('#ArquicoinsFunds').text('Error');
      }
    });

    //==========================Transfer========================================

    $('#transferForm').submit(function(event) {
        var username = $('#Transfer').val();
        var amount = $('#Amount').val();

        if (username === 'existe') {
            alert('Transferencia exitosa');
            return;
        } else {
            alert('El usuario no existe');
            event.preventDefault();
        }
    });

    //========================Buy Arquicoins====================================

    $('#buyForm').submit(function(event) {
        var amount = $('#Amount_to_buy').val();

        $.ajax({
          type: "POST",
          url: '/data/arquicoins/buy',
          data: amount,
          sucess: function(data, status, jqXHR){
            if (amount === '123') {
                alert('123 transferido');
                return;
            } else {
                alert('Monto rechazado');
                event.preventDefault();
            }
          }
        });
        //
        // if (amount === '123') {
        //     alert('123 transferido');
        //     return;
        // } else {
        //     alert('Monto rechazado');
        //     event.preventDefault();
        // }
    });

    //==========================================================================
});
