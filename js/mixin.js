var mixins = {
    data: {
        //作品
        worksVisible: true,
        worksType: 0,
        maskFull: false,
        worksBigSwiper: null,
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
        //worksList: []
        worksList: [{
                worksId: 1,
                type: 1,
                smallUrl: "./interaction/image/works10.jpg",
                imageUrl: "./interaction/image/works10.jpg"
            },
            {
                worksId: 2,
                type: 1,
                smallUrl: "./interaction/image/works2.jpg",
                imageUrl: "./interaction/image/works2.jpg"
            },
            {
                worksId: 3,
                type: 1,
                smallUrl: "./interaction/image/works3.jpg",
                imageUrl: "./interaction/image/works3.jpg"
            },
            {
                worksId: 4,
                type: 2,
                smallUrl: "./interaction/image/works4.jpg",
                imageUrl: "./interaction/image/works4.jpg"
            },
            {
                worksId: 5,
                type: 2,
                smallUrl: "./interaction/image/works5.jpg",
                imageUrl: "./interaction/image/works5.jpg"
            },
            {
                worksId: 6,
                type: 2,
                smallUrl: "./interaction/image/works6.jpg",
                imageUrl: "./interaction/image/works6.jpg"
            },
            {
                worksId: 7,
                type: 2,
                smallUrl: "./interaction/image/works7.jpg",
                imageUrl: "./interaction/image/works7.jpg"
            },
            {
                worksId: 8,
                type: 2,
                smallUrl: "./interaction/image/works8.jpg",
                imageUrl: "./interaction/image/works8.jpg"
            },
            {
                worksId: 9,
                type: 3,
                smallUrl: "./interaction/image/works9.jpg",
                imageUrl: "./interaction/image/works9.jpg"
            },
            {
                worksId: 10,
                type: 3,
                smallUrl: "./interaction/image/works10.jpg",
                imageUrl: "./interaction/image/works10.jpg"
            },
            {
                worksId: 11,
                type: 3,
                smallUrl: "./interaction/image/works11.jpg",
                imageUrl: "./interaction/image/works11.jpg"
            },
            {
                worksId: 12,
                type: 3,
                smallUrl: "./interaction/image/works12.jpg",
                imageUrl: "./interaction/image/works12.jpg"
            },
            {
                worksId: 13,
                type: 3,
                smallUrl: "./interaction/image/works13.jpg",
                imageUrl: "./interaction/image/works13.jpg"
            },
            {
                worksId: 14,
                type: 3,
                smallUrl: "./interaction/image/works14.jpg",
                imageUrl: "./interaction/image/works14.jpg"
            },
            {
                worksId: 15,
                type: 3,
                smallUrl: "./interaction/image/works15.jpg",
                imageUrl: "./interaction/image/works15.jpg"
            },
            {
                worksId: 16,
                type: 3,
                smallUrl: "./interaction/image/works16.jpg",
                imageUrl: "./interaction/image/works16.jpg"
            },
        ]
    },
    methods: {
        //点击作品小图
        handleSlideClick(obj, index) {
            if ('type' in obj) {
                //this.worksType = obj.type;
                this.maskFull = true;
                this.worksBigSwiper.slideTo(index, 100, false); //切换到点击的slide
            }
        },
        //点击蒙版
        handleCloseMask() {
            return this.maskFull = this.maskFull ? false : true;
        },
        handleTabClick(type) {
            this.worksType = type;
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
                    //freeMode: true
                });
            });
        },
        //作品大图swiper
        worksBigSwiperInit() {
            this.$nextTick(function () {
                this.worksBigSwiper = new Swiper('.tab-pane .swiper-container', {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                });
            });
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
                        console.log(data);
                        if (data.length) {
                            //1-美术，2-书法，3-作业
                            var finearts = [],
                                calligraphy = [],
                                homework = [];
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].type === 1) {
                                    finearts.push(data[i]);
                                } else if (data[i].type === 2) {
                                    calligraphy.push(data[i]);
                                } else {
                                    homework.push(data[i]);
                                }
                            }
                            that.worksVisible = true;
                            that.worksList = data;
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