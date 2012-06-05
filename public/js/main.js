var socket = io.connect('http://localhost');

socket.on('status', function (data) {
    $('#status').html(data.status);
});

$('#reset').click(function() {
    socket.emit('reset');
});