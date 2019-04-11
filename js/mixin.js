var mixins = {
    data: {
        //打卡
        clockVisible: false,
        //大图查看模式定时器
        maskFullTimer: null,
        //作品定时器
        worksTimer: null,
        //作品
        worksVisible: false,
        worksType: 0,
        maskFull: false,
        worksSmallSwiper: null,
        worksBigSwiper: null,
        //点赞
        praiseVisible: false,
        //点击值
        clickCount: 0,
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
        //定时关闭大图查看模式
        handleCloseFull() {

        },
        //点击作品小图
        handleSlideClick(obj, index) {
            var that = this;
            if ('type' in obj) {
                this.maskFull = true;
                //切换到指定的slide
                this.worksBigSwiper.slideTo(index, 100, false);
            }
            //当停留时间过长时，自动关闭
            this.maskFullTimer = setInterval(function () {
                that.maskFull = false;
            }, 20 * 1000);
            //暂时小图自动播放功能
            this.worksSmallSwiper.autoplay.stop();
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
            var that = this;
            this.$nextTick(function () {
                this.worksSmallSwiper = new Swiper('.works-box .swiper-container', {
                    on: {
                        //到了最后一个slide
                        reachEnd: function () {
                            console.log("到了最后一个slide");
                            that.worksVisible = false;
                            that.queryWorksTerminal(that.mac); //获取学生作品
                        }
                    },
                    autoplay: {
                        delay: 5000,
                    },
                    speed: 1000,
                    noSwiping: true,
                    noSwipingClass: 'stop-swiping',
                    //slidesPerView: 'auto',
                    //centeredSlides: true,
                    spaceBetween: 20,
                    slidesPerView: 5
                });
            });
        },
        //作品大图swiper
        worksBigSwiperInit() {
            var that = this;
            this.$nextTick(function () {
                this.worksBigSwiper = new Swiper('.tab-pane .swiper-container', {
                    on: {
                        slideChangeTransitionStart: function () {
                            clearInterval(that.maskFullTimer);
                            console.log("swiper从当前slide开始过渡到另一个slide时执行");
                        },
                        slideChangeTransitionEnd: function () {
                            //clearTimeout(that.maskFullTimer);
                            that.maskFullTimer = setInterval(function () {
                                that.maskFull = false;
                            }, 20 * 1000);
                            console.log('swiper从一个slide过渡到另一个slide结束时执行');
                        }
                    },
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
                    url: "http://192.168.18.253:8081/qxiao-cms/action/mod-xiaojiao/works/addPraise.do?worksId=" + obj.worksId,
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
                    timeout: 5000, // 添加timeout参数  
                    jsonp: "jsoncallback",
                    jsonpCallback: "success_jsonpCallback",
                    url: "http://192.168.18.253:8081/qxiao-cms/action/mod-xiaojiao/works/queryWorksTerminal.do?mac=" + mac,
                    success: function (res) {
                        var data = res.detail;
                        if (data.length) {
                            console.log("请求成功");
                            //清除定时器
                            clearTimeout(that.worksTimer);
                            that.worksVisible = true;
                            that.worksList = data; //小图列表
                            that.worksBigList = data; //大图列表
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log("网络发生错误");
                        that.worksVisible = false;
                        //清除定时器
                        clearTimeout(that.worksTimer);
                        //重新请求
                        that.worksTimer = setTimeout(function () {
                            that.queryWorksTerminal(that.mac);
                        }, 10 * 1000);
                    }
                });
            } else {
                console.log("mac地址没有传过来");
                //如果没能正确获取到mac地址，也是重新请求
                that.worksVisible = false; //loading
            }
        }
    },
}