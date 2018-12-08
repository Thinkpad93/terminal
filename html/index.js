var vm = new Vue({
    el: "#main",
    data: {
        url: "http://192.168.18.113:8080/qxiao-cms/action/mod-xiaojiao/portal/queryProtalWebAllInfo.do",
        swiper: null,
        portalList: []
    },
    watch: {
        portalList: function (newValue, oldValue) {
            this.swiperInit();
        }
    },
    methods: {
        getPortalWebInfo(schoolId) {
            var that = this;
            axios.post(this.url, {
                schoolId: schoolId
            }).then(function (res) {
                if (res.data.errorCode === 0) {
                    that.portalList = res.data.data;
                } else {
                    that.portalList = [];
                }
            }).catch(function (error) {

            });
        },
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
            this.getPortalWebInfo(top.schoolId);
            //
        }
    },
    mounted: function () {
        this.init();
        console.log("门户数据");
    }
});
console.log(vm);