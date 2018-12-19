var vm = new Vue({
    el: "#main",
    data: {
        url: "http://192.168.18.113:8080/qxiao-cms/action/mod-xiaojiao/portal/queryProtalWebAllInfo.do",
        view: false,
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
                    if (!res.data.data.length) {
                        that.view = true;
                    } else {
                        that.view = false;
                        that.portalList = res.data.data;
                    }
                } else {
                    //处理没有审核通过的
                    that.view = true;
                    that.portalList = [];
                }
            }).catch(function (error) {
                //当网络出现问题时
                that.view = true;
                that.portalList = [];
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
            var href = window.location.href;
            var schoolId = href.substring(href.lastIndexOf('=') + 1);
            this.getPortalWebInfo(schoolId);
        }
    },
    mounted: function () {
        this.init();
    }
});
console.log(vm);