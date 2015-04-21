$(function () {

    $('#post-comment').hide();
    $('#btn-comment').on('click', function (event) {

        event.preventDefault();
        $('#post-comment').show();
    });

    $('#btn-like').on('click', function (event) {

        event.preventDefault();

        var imgId = $(this).data('id');
        var url = '/images/' + imgId + '/like';

        $.post(url).done(function (data) {

            $('.likes-count').text(data.likes);
        });
    });

    $('#btn-delete').on('click', function (event) {

        event.preventDefault();
        var $this = $(this);
        var remove = confirm('Are you sure you want to remove this image?');
        
        if (remove) {
            var imageId = $this.data('id');
            $.ajax({
                url: '/images/' + imageId + '/remove',
                type: 'DELETE',
                success: function (result) {
                    console.log('here');
                    if (result.removed) {
                        console.log($this);
                        $this.removeClass('btn-danger').addClass('btn-success');
                        $this.find('i').removeClass('fa-times').addClass('fa-check');
                        $this.append('<span> Deleted!</span>');
                    }
                },
                done: function (result) {
                    console.log('xhr done');
                }
            });
        }
    });
});
