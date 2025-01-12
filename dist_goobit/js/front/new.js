$(document).ready(function () {
    $('.open-window-map').on('click', function(e) {
        e.preventDefault();

        const mobileImageUrl = 'images/new/09_map_mo.svg';
        const pcImageUrl = 'images/new/09_map_pc.svg';
        const isMobile = window.innerWidth <= 992;

        const selectedImageUrl = isMobile ? mobileImageUrl : pcImageUrl;

        if (isMobile) {
            // const newWindow = window.open(selectedImageUrl, '_blank', 'width=892,height=400');
            // Mobile 
            const modal = `
                <div class="map-modal">
                    <img src="${selectedImageUrl}"">
                    <button class="modal-close">닫기</button>
                </div>`;
            $('body').append(modal);
            $('body').addClass('none-scroll')

            $('.modal-close').on('click', function() {
                $('.map-modal').remove();
                $('body').removeClass('none-scroll')
            });
        } else {
            // PC
            const newWindow = window.open(selectedImageUrl, '_blank', 'width=892,height=400');
        }
    });
});