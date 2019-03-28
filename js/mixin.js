var mixins = {
    data: {
        //打卡
        clockVisible: false,
        //作品
        worksVisible: false,
        worksType: 0,
        maskFull: false,
        worksBigSwiper: null,
        //点赞
        praiseVisible: false,
        //缺省的内容
        local: false,
        localImgList: [{
                image: "./local/slide1.jpg"
            },
            {
                image: "./local/slide2.jpg"
            },
            {
                image: "./local/slide3.jpg"
            },
            {
                image: "./local/slide4.jpg"
            },
            {
                image: "./local/slide5.jpg"
            },
            {
                image: "./local/slide6.jpg"
            },
            {
                image: "./local/slide7.jpg"
            },
            {
                image: "./local/slide8.jpg"
            },
            {
                image: "./local/slide9.jpg"
            },
            {
                image: "./local/slide10.jpg"
            },
            {
                image: "./local/slide11.jpg"
            },
            {
                image: "./local/slide12.jpg"
            },
            {
                image: "./local/slide13.jpg"
            },
        ],
        worksList: [],
        worksBigList: [],
    },
    methods: {
        //点击作品小图
        handleSlideClick(obj, index) {
            if ('type' in obj) {
                this.maskFull = true;
                //切换到指定的slide
                this.worksBigSwiper.slideTo(index, 100, false);
            }
        },
        //点击作品类别
        handleTabClick(type) {
            var filter = [];
            this.worksType = type;
            this.worksList.forEach(function (elem, index) {
                if (elem.type === type) {
                    filter.push(elem);
                }
            });
            //重新赋值
            this.worksBigList = filter;
        },
        //作品点赞
        handlePraise(obj) {
            this.addPraise(obj);
        },
        //作品小图swiper
        worksSmallSwiperInit() {
            this.$nextTick(function () {
                new Swiper('.works-box .swiper-container', {
                    autoplay: {
                        delay: 5000,
                    },
                    speed: 800,
                    //loop: true,
                    noSwiping: true,
                    noSwipingClass: 'stop-swiping',
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    spaceBetween: 20,
                });
            });
        },
        //作品大图swiper
        worksBigSwiperInit() {
            this.$nextTick(function () {
                this.worksBigSwiper = new Swiper('.tab-pane .swiper-container', {
                    slidesPerView: 1,
                    //真正的核心部分在
                    //修改swiper自己或子元素时，自动初始化swiper 
                    observer: true,
                });
            });
        },
        //作品点赞
        addPraise(obj) {
            var that = this;
            if (obj) {
                $.ajax({
                    type: 'GET',
                    dataType: "jsonp",
                    jsonp: "jsoncallback",
                    jsonpCallback: "success_jsonpCallback",
                    url: "http://192.168.18.113:8081/qxiao-cms/action/mod-xiaojiao/works/addPraise.do?worksId=" + obj.worksId,
                    success: function (res) {
                        if (res.parise || res.worksId) {
                            obj.praise = res.parise;
                            that.praiseVisible = true;
                            setTimeout(function () {
                                that.praiseVisible = false;
                            }, 2000);
                        }
                    },
                    error: function (res) {
                        that.praiseVisible = false;
                    }
                });
            }
        },
        //作品屏端播放查询
        queryWorksTerminal: function (mac) {
            var that = this;
            if (mac) {
                $.ajax({
                    type: 'GET',
                    dataType: "jsonp",
                    jsonp: "jsoncallback",
                    jsonpCallback: "success_jsonpCallback",
                    url: "http://192.168.18.113:8081/qxiao-cms/action/mod-xiaojiao/works/queryWorksTerminal.do?mac=" + mac,
                    success: function (res) {
                        var data = res.detail;
                        if (data.length) {
                            that.worksVisible = true;
                            that.worksList = data; //小图列表
                            that.worksBigList = data; //大图列表
                        }
                    },
                    error: function (res) {
                        that.worksVisible = false;
                        console.log(JSON.stringify(res));
                    }
                });
            }
        }
    },
}