var vm = new Vue({
    el: "#root",
    mixins: [mixins],
    data: {
        student: {}, //学生信息
        protalUrl: "",
        frameVisible: true,
        swiper: null,
        //每一分钟刷新一次
        minutes: 30000,

        //定时器
        timer: null,
        timerScroll: null,

        //学校名称
        schoolname: "",
        //学校mac地址
        mac: "",

        //栏目
        channelIndex: -1,
        channelIndexing: -1,
        channelContens: null,
        channelContenLen: 0,
        channelContenIndex: -1,
        channelDuration: 0, //单条内容时长

        //滚动内容数据
        scrollData: [],
        marquee: [],

        //栏目数据
        channelData: []
    },
    watch: {
        //这里watch当前在显示的内容索引，从而初始化swiper
        channelContenIndex: function (newVal, oldVal) {
            this.swiperInit();
        },
        local: function (newVal, oldVal) {
            this.swiperLocalInit();
        },
        worksVisible(newVal, oldVal) {
            this.worksSmallSwiperInit();
            this.worksBigSwiperInit();
        },
        maskFull(newVal, oldVal) {
            if (newVal === false) {
                //用户点了作品类别，关闭大图模式查看后重新初始化列表
                if (this.worksType !== 0) {
                    this.worksType = 0;
                    this.worksBigList = this.worksList;
                }
                //清除定时器
                clearInterval(this.maskFullTimer);
                //开启小图的自己播放功能
                this.worksSmallSwiper.autoplay.start();
            }
        }
    },
    methods: {
        //添加补0操作
        fill: function (i) {
            if (i >= 1 && i <= 9) {
                i = "0" + i;
            }
            return i;
        },
        //获取本地年月日时分秒
        getNowDate: function () {
            var d = new Date();
            var year = d.getFullYear(), //年
                mouth = this.fill(d.getMonth() + 1), //月
                day = this.fill(d.getDate()), //日
                hours = this.fill(d.getHours()), //时
                minutes = this.fill(d.getMinutes()), //分
                seconds = this.fill(d.getSeconds()); //秒

            if (arguments.length) {
                return year + "-" + mouth + "-" + day;
            } else {
                return hours + ":" + minutes + ":" + seconds;
            }
        },
        //根据日期时间获取需要播放的滚动内容
        getScrollContens: function () {
            var that = this;
            var scrollData = this.scrollData;
            var now = new Date().getTime();
            var isPlayScroll = [];
            for (var s = 0; s < scrollData.length; s++) {
                var scrolls = scrollData[s];
                var validstarttime = scrolls.playTime + " " + "00:00:00"; //滚动开始时间
                var validendtime = scrolls.endTime + " " + "23:59:59"; //滚动结束时间
                //字符串转时间戳
                var start = new Date(validstarttime.replace(/-/g, "/")).getTime();
                var end = new Date(validendtime.replace(/-/g, "/")).getTime();
                //跟当前时间对比时间戳
                if (now > start && now <= end) {
                    isPlayScroll.push(scrolls);
                } else {}
            }
            //找到滚动内容
            if (isPlayScroll.length) {
                //console.log(isPlayScroll);
                this.marquee = isPlayScroll;
            }
        },
        //根据日期时间获取需要播放的栏目
        getPlayChannels: function () {
            var that = this;
            var channelData = this.channelData;
            var hms = this.getNowDate();
            var now = new Date().getTime();
            var isPlayChannel = []; //保存要播放的栏目
            for (var i = 0; i < channelData.length; i++) {
                var channels = channelData[i]; //每个栏目
                var validstarttime = channels.validstarttime;
                var validendtime = channels.validendtime;
                var playstarttime = channels.playstarttime;
                var playendtime = channels.playendtime;
                //字符串转时间戳
                var startTime = (validstarttime + " " + playstarttime).replace(
                    /-/g,
                    "/"
                );
                var endTime = (validendtime + " " + playendtime).replace(/-/g, "/");
                var start = new Date(startTime).getTime();
                var end = new Date(endTime).getTime();
                //跟当前时间对比时间戳
                if (now > start && now < end) {
                    if (hms >= playstarttime && hms <= playendtime) {
                        isPlayChannel.push(channels); //
                    }
                } else {
                    //...
                }
            }
            //找到栏目
            if (isPlayChannel.length) {
                //浏览器是否在线
                var o = this.handleChannelComputed(isPlayChannel);
                //如果找到的栏目里面没有内容
                if (!o.showChannels.contents.length) {
                    this.local = true;
                    //设置栏目不显示
                    this.channelIndex = -1;
                } else {
                    this.local = false;
                    if (Object.keys(o).length) {
                        this.channelIndex = o.index;
                        if (this.channelIndexing === this.channelIndex) {
                            //...
                        } else {
                            this.channelIndexing = this.channelIndex;
                            this.playChannelContens(o.showChannels.contents);
                        }
                    }
                }
            } else {
                //如果没有找到栏目，则不显示，显示缺省的
                this.local = true;
                this.channelIndex = -1;
            }
        },
        //处理栏目并返回需要显示的栏目
        handleChannelComputed: function (channels) {
            var index;
            var priorityArr = []; //栏目等级
            for (var c = 0; c < channels.length; c++) {
                priorityArr.push(channels[c].priority);
            }
            var prioritySort = priorityArr.sort(); //简单的排序
            var priorityMax = prioritySort[prioritySort.length - 1]; //栏目等级最高
            var resultChannel = channels.find(function (elem) {
                return elem.priority === priorityMax;
            });
            //这里找出栏目名称相同的 播放等级相同的  (还有就是播放开始时间相同的)
            if (Object.keys(resultChannel).length) {
                index = this.channelData.findIndex(function (elem) {
                    return (
                        elem.channelname === resultChannel.channelname &&
                        elem.priority === resultChannel.priority &&
                        resultChannel.playstarttime === elem.playstarttime
                    );
                });
                return {
                    index: index,
                    showChannels: resultChannel
                };
            }
        },
        //播放栏目内容
        playChannelContens: function (contens) {
            var that = this;
            var durationArr = []; //时长
            if (Array.isArray(contens)) {
                for (var i = 0; i < contens.length; i++) {
                    durationArr.push(contens[i].duration); //保存每条内容的时长
                }
                this.channelContenLen = durationArr.length;
                this.channelContens = contens;
                if (durationArr.length > 0) {
                    this.channelContenIndex = 0;
                    this.channelDuration = durationArr[this.channelContenIndex];
                    if (this.timer != null) {
                        clearInterval(this.timer);
                        this.channelContenIndex = 0;
                    }
                    this.timer = setInterval(function () {
                        that.handleCheckContents(durationArr);
                    }, 1000);
                }
            }
        },
        //根据时长定时切换内容
        handleCheckContents: function (durationArr) {
            if (this.channelDuration > 0) {
                this.channelDuration = this.channelDuration - 1;
            } else {
                if (this.channelContenIndex < this.channelContenLen) {
                    this.channelContenIndex++;
                    this.channelDuration = durationArr[this.channelContenIndex];
                } else {
                    this.channelContenIndex = 0;
                    this.channelDuration = durationArr[this.channelContenIndex];
                }
            }
        },
        //提供给APP调用接口
        ikepu_js(json_str) {
            var req = JSON.parse(json_str);
            var that = this;
            //打卡类别 0-NFC打卡 1-ibeacon打卡
            if (req.action === "nfc_login") {
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "jsoncallback",
                    jsonpCallback: "success_jsonpCallback",
                    url: "http://zc.qxiao.net/qxiao-mp/action/mod-xiaojiao/clock/punchClock.do?nfcId=" +
                        req.data.nfcid,
                    success: function (res) {
                        if (res.studentName) {
                            that.clockVisible = true;
                            that.student = res;
                            setTimeout(function () {
                                that.clockVisible = false;
                            }, 4000);
                        }
                    },
                    error: function (res) {
                        that.clockVisible = false;
                        //layer.msg("打卡不正常，请重新打卡");
                        console.log(JSON.stringify(res));
                    }
                });
            }
        },
        //获取数据
        getSchoolData: function () {
            this.schoolname = channels.schoolname; //学校名称
            this.mac = channels.mac; //学校mac地址
            this.channelData = channels.playchannel; //栏目数据
            this.scrollData = channels.scrollContents || []; //滚动数据
            this.getPlayChannels();
            this.getScrollContens();
            this.handleGetPortalUrl(); //获取门户网站地址
        },
        //初始化本地swiper 播放缺省内容
        swiperLocalInit() {
            this.$nextTick(function () {
                new Swiper("#localImg", {
                    autoplay: {
                        delay: 30000
                    },
                    speed: 800,
                    loop: true,
                    noSwiping: true,
                    noSwipingClass: "stop-swiping"
                });
            });
        },
        //初始化swiper
        swiperInit: function () {
            this.$nextTick(function () {
                this.swiper = new Swiper(".channel .swiper-container", {
                    autoplay: {
                        delay: 30000
                    },
                    speed: 800,
                    loop: true,
                    noSwiping: true,
                    noSwipingClass: "stop-swiping"
                });
            });
        },
        //获取门户url
        handleGetPortalUrl() {
            var url = "";
            var channelData = this.channelData;
            for (var i = 0; i < channelData.length; i++) {
                var contents = channelData[i].contents; //每个栏目
                for (var j = 0; j < contents.length; j++) {
                    if (contents[j].showtype === 6 && contents[j].webUrl) {
                        url = contents[j].webUrl;
                        break;
                    }
                }
            }
            this.protalUrl = url.substring(0, url.lastIndexOf("index"));
        },
        init: function () {
            this.getSchoolData();
        },
        //当网络访问不到时，加载图片出错事件
        handleError() {
            this.frameVisible = false;
        }
    },
    mounted: function () {
        var that = this;
        this.init();
        //"mac": "44:45:53:54:00:08",
        this.queryWorksTerminal(this.mac); //获取学生作品
        setInterval(function () {
            console.log("30秒刷新数据!");
            that.init();
        }, that.minutes);
    }
});