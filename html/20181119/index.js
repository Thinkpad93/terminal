var vm = new top.Vue({
    el: "#main",
    data: {
        swiper: null
    },
    methods: {
        //初始化swiper
        swiperInit: function () {
            this.$nextTick(function () {
                this.swiper = new Swiper('#portal', {
                    autoplay: {
                        delay: 30000,
                    },
                    speed: 1000,
                    loop: true,
                    noSwiping: true,
                    noSwipingClass: 'stop-swiping'
                });
            });
        },
        init: function () {
            this.swiperInit();
        }
    },
    mounted: function () {
        this.init();
        console.log("门户数据");
    }
});
console.log(vm);