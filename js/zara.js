function toggleSearch() {
    document.querySelector('body').classList.toggle('search-in');
}

document.querySelector('.search-btn').addEventListener('click', function () {
    toggleSearch();

    document.querySelector('.search-input').focus();
});
var slideWrapper = $('.main-slider'),
    iframes = slideWrapper.find('.embed-player'),
    lazyImages = slideWrapper.find('.slide-image'),
    lazyCounter = 0;

// POST commands to YouTube or Vimeo API
function postMessageToPlayer(player, command) {
    if (player == null || command == null) return;
    player.contentWindow.postMessage(JSON.stringify(command), '*');
}

// When the slide is changing
function playPauseVideo(slick, control) {
    var currentSlide, slideType, startTime, player, video;

    currentSlide = slick.find('.slick-current');
    slideType = currentSlide.attr('class').split(' ')[1];
    player = currentSlide.find('iframe').get(0);
    startTime = currentSlide.data('video-start');

    if (slideType === 'vimeo') {
        switch (control) {
            case 'play':
                if (startTime != null && startTime > 0 && !currentSlide.hasClass('started')) {
                    currentSlide.addClass('started');
                    postMessageToPlayer(player, {
                        method: 'setCurrentTime',
                        value: startTime,
                    });
                }
                postMessageToPlayer(player, {
                    method: 'play',
                    value: 1,
                });
                break;
            case 'pause':
                postMessageToPlayer(player, {
                    method: 'pause',
                    value: 1,
                });
                break;
        }
    } else if (slideType === 'youtube') {
        switch (control) {
            case 'play':
                postMessageToPlayer(player, {
                    event: 'command',
                    func: 'mute',
                });
                postMessageToPlayer(player, {
                    event: 'command',
                    func: 'playVideo',
                });
                break;
            case 'pause':
                postMessageToPlayer(player, {
                    event: 'command',
                    func: 'pauseVideo',
                });
                break;
        }
    } else if (slideType === 'video') {
        video = currentSlide.children('video').get(0);
        if (video != null) {
            if (control === 'play') {
                video.play();
            } else {
                video.pause();
            }
        }
    }
}

// Resize player
function resizePlayer(iframes, ratio) {
    if (!iframes[0]) return;
    var win = $('.main-slider'),
        width = win.width(),
        playerWidth,
        height = win.height(),
        playerHeight,
        ratio = ratio || 16 / 9;

    iframes.each(function () {
        var current = $(this);
        if (width / ratio < height) {
            playerWidth = Math.ceil(height * ratio);
            current
                .width(playerWidth)
                .height(height)
                .css({
                    left: (width - playerWidth) / 2,
                    top: 0,
                });
        } else {
            playerHeight = Math.ceil(width / ratio);
            current
                .width(width)
                .height(playerHeight)
                .css({
                    left: 0,
                    top: (height - playerHeight) / 2,
                });
        }
    });
}

// DOM Ready
$(function () {
    // Initialize
    slideWrapper.on('init', function (slick) {
        slick = $(slick.currentTarget);
        setTimeout(function () {
            playPauseVideo(slick, 'play');
        }, 1000);
        resizePlayer(iframes, 16 / 9);
    });
    slideWrapper.on('beforeChange', function (event, slick) {
        slick = $(slick.$slider);
        playPauseVideo(slick, 'pause');
    });
    slideWrapper.on('afterChange', function (event, slick) {
        slick = $(slick.$slider);
        playPauseVideo(slick, 'play');
    });
    slideWrapper.on('lazyLoaded', function (event, slick, image, imageSource) {
        lazyCounter++;
        if (lazyCounter === lazyImages.length) {
            lazyImages.addClass('show');
            // slideWrapper.slick("slickPlay");
        }
    });

    //start the slider
    slideWrapper.slick({
        // fade:true,
        autoplaySpeed: 4000,
        lazyLoad: 'progressive',
        speed: 600,
        arrows: false,
        dots: true,
        cssEase: 'cubic-bezier(0.87, 0.03, 0.41, 0.9)',
    });
});

// Resize event
$(window).on('resize.slickVideoPlayer', function () {
    resizePlayer(iframes, 16 / 9);
});
// swiper
var swiper = new Swiper('.mySwiper', {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 30,
    mousewheel: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});
const parentDiv = document.querySelector('.swiper-wrapper');
const childDiv = document.querySelector('.kakaochat');

// 다른 div 요소의 translate3d 값에 따라 변화를 감지하는 함수
function checkTranslate3dValue() {
    const computedStyle = getComputedStyle(parentDiv); // 부모 요소의 계산된 스타일 가져오기
    const transformValue = computedStyle.transform; // transform 스타일 값 가져오기

    // translate3d 값이 변했을 때, display 속성 변경
    if (transformValue !== 'matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1)') {
        childDiv.style.display = 'block';
    } else {
        childDiv.style.display = 'none';
    }
}

// 변화를 감지하기 위해 resize 이벤트 리스너 등록
window.addEventListener('resize', checkTranslate3dValue);

// 초기에도 한 번 실행하여 초기 위치에 따라 display 속성 설정
checkTranslate3dValue();
