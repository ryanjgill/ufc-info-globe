$(function () {
	// Globe project
	var $container = $('#globe');  // Where to put the globe?
	var globe = new ORBITAL.Globe( $container );  // Make the globe
    var $loader = $('.loading');
    var $counter = $('.counter');

    window.odometerOptions = {
        auto: false
    };

	$.get('/ufc-info-visits', function (data) {
        var sessions = JSON.parse(data);
		var opts = { format: 'magnitude' };
        var houston = { lat: 29.76, lng: -95.36, mag: 3 };

        initCounter();
        //globe.addPoint(lat, lng, mag);
        //globe.addData([{p.lat, p.lng, p.mag}])

        globe.addData(sessions);
        globe.animate();

        hideLoading();
        updateCounter(sessions.length);
	});

    function initCounter() {
        od = new Odometer({
            el: $counter[0],
            value: 0,
            format: '(,ddd)',
            theme: 'digital'
        });
    }

	function updateCounter(total) {
        od.update(total);
	}

    function hideLoading() {
        $loader.addClass('hide');
    }
	
});