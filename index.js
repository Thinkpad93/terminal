var vm = new Vue({
    el: "#root",
    data: {

        minutes: 30000, //每一分钟刷新一次
        timer: null, //内容定时器
        timerScroll: null,

        delay: 0, //多少秒之后切换图片
        currChannelPlay: -1, //正在播放的非滚动栏目
        currChannelPlaying: -1,
        duration: 0, //单条内容时长
        contents: null,
        contentsLen: 0, //每个栏目下有多少条内容
        currContentIndex: 0, //当前正在显示的内容索引


        currScrollChannelPlay: -1, //正在播放的滚动栏目
        currScrollChannelPlaying: -1,
        durationScroll: 0,
        contentsScroll: null,
        contentsScrollLen: 0,
        currContentScrollIndex: 0,


        channelData: [] //栏目数据


    },
    methods: {
        //补0操作
        fill: function (i) {
            if (i >= 1 && i <= 9) {
                i = "0" + i;
            }
            return i;
        },
        //获取本地年月日时分秒
        getNowDate: function (arg) {
            var d = new Date();
            //年
            var year = d.getFullYear();
            //月
            var mouth = this.fill(d.getMonth() + 1);
            //日
            var day = this.fill(d.getDate());
            //时
            var hours = this.fill(d.getHours());
            //分
            var minutes = this.fill(d.getMinutes());
            //秒
            var seconds = this.fill(d.getSeconds());

            if (arguments.length) {
                return year + "-" + mouth + "-" + day;
            } else {
                return hours + ":" + minutes + ":" + seconds;
            }
        },
        //根据日期时间获取需要播放的栏目
        getRunPlayChannel: function () {
            var that = this;
            var channelData = this.channelData;
            var hms = this.getNowDate();
            var now = new Date().getTime();
            var isPlayChannel = [];
            for (var i = 0; i < channelData.length; i++) {
                var channels = channelData[i]; //每个栏目
                var validstarttime = channels.validstarttime;
                var validendtime = channels.validendtime;
                var playstarttime = channels.playstarttime;
                var playendtime = channels.playendtime;

                var start = new Date(validstarttime + " " + playstarttime).getTime();
                var end = new Date(validendtime + " " + playendtime).getTime();

                if (now > start && now < end) {
                    if (hms >= playstarttime && hms <= playendtime) {
                        isPlayChannel.push(channels);
                    }
                } else {}
            }
            if (isPlayChannel.length) {
                var noScrollChannel = [];
                var scrollChannel = [];
                //检查栏目属性 非滚动和滚动
                for (var c = 0; c < isPlayChannel.length; c++) {
                    if (isPlayChannel[c].scrolltype === 1) {
                        scrollChannel.push(isPlayChannel[c]);
                    } else {
                        noScrollChannel.push(isPlayChannel[c]);
                    }
                }
                //非滚动的栏目内容
                if (noScrollChannel.length) {
                    var channelObj = this.handleComputed(isPlayChannel, noScrollChannel);
                    if (Object.keys(channelObj).length) {
                        this.currChannelPlay = channelObj.index;
                        if (this.currChannelPlaying == this.currChannelPlay) {
                            //return false;
                        } else {
                            this.currChannelPlaying = this.currChannelPlay;
                            this.runPlayChannelContents(channelObj.channel.contents); //播放内容
                        }
                    }
                } else {
                    this.currChannelPlay = -1;
                }
                //滚动的栏目内容
                if (scrollChannel.length) {
                    var scrollChannelObj = this.handleComputed(isPlayChannel, scrollChannel);
                    if (Object.keys(scrollChannelObj).length) {
                        this.currScrollChannelPlay = scrollChannelObj.index;
                        if (this.currScrollChannelPlaying == this.currScrollChannelPlay) {
                            //return false;
                        } else {
                            this.currScrollChannelPlaying = this.currScrollChannelPlay;
                            this.runPlayScrollChannelContents(scrollChannelObj.channel.scrollContents);
                        }
                    }
                } else {
                    this.currScrollChannelPlay = -1;
                }

            }
        },
        //处理栏目并显示
        handleComputed: function (isPlayChannel, channels) {
            var scrolltype;
            var priorityArr = [];
            var index = null;
            for (var c = 0; c < channels.length; c++) {
                priorityArr.push(channels[c].priority);
                if (channels[c].scrolltype === 1) {
                    scrolltype = 1;
                } else {
                    scrolltype = 0;
                }
            }
            //简单的排序
            var prioritySort = priorityArr.sort();
            var copyChannel = [];
            var priorityMax = prioritySort[prioritySort.length - 1];
            var getChannel = {};
            channels.forEach(function (elem, index) {
                if (elem.priority === priorityMax) {
                    copyChannel.push(elem);
                }
            });
            copyChannel.length > 1 ? getChannel = copyChannel[0] : getChannel = copyChannel[0];
            index = this.channelData.findIndex(function (elem) {
                //找出相同的栏目名称
                return elem.scrolltype === scrolltype && elem.channelname === getChannel.channelname;
            });
            return {
                index: index,
                channel: getChannel
            };
        },
        //播放滚动栏目的内容
        runPlayScrollChannelContents(contents) {
            var that = this;
            var durationArr = []; //时长
            if (Array.isArray(contents)) {
                for (var i = 0; i < contents.length; i++) {
                    durationArr.push(contents[i].duration); //保存每条内容的时长
                }
                this.contentsScrollLen = durationArr.length;
                this.contentsScroll = contents;
                if (durationArr.length > 0) {
                    this.currContentScrollIndex = 0;
                    this.durationScroll = durationArr[this.currContentScrollIndex];
                    if (this.timerScroll != null) {
                        clearInterval(this.timerScroll);
                        this.currContentScrollIndex = 0;
                    }
                    this.timerScroll = setInterval(function () {
                        that.handleCheckScrollContents(durationArr);
                    }, 1000);
                }
            }
        },
        //播放非滚动栏目的内容
        runPlayChannelContents: function (contents) {
            var that = this;
            var durationArr = []; //时长
            if (Array.isArray(contents)) {
                for (var i = 0; i < contents.length; i++) {
                    durationArr.push(contents[i].duration); //保存每条内容的时长
                }
                this.contentsLen = durationArr.length;
                this.contents = contents;
                if (durationArr.length > 0) {
                    this.currContentIndex = 0;
                    this.duration = durationArr[this.currContentIndex];
                    if (this.timer != null) {
                        clearInterval(this.timer);
                        this.currContentIndex = 0;
                    }
                    this.timer = setInterval(function () {
                        that.handleCheckContents(durationArr); // 传入内容时长
                    }, 1000);
                    //console.log("timer:" + this.timer);
                    this.handleImgdelay(this.contents[this.currContentIndex]);
                }
            }
        },
        //切换滚动内容
        handleCheckScrollContents(durationArr) {
            if (this.durationScroll > 0) {
                this.durationScroll = this.durationScroll - 1;
                console.log(this.durationScroll);
            } else {
                if (this.currContentScrollIndex < this.contentsScrollLen) {
                    this.currContentScrollIndex++;
                    if (this.currContentScrollIndex == this.contentsScrollLen) {
                        this.currContentScrollIndex = 0;
                    }
                    this.durationScroll = durationArr[this.currContentScrollIndex];
                } else {
                    this.currContentScrollIndex = 0;
                    this.durationScroll = durationArr[this.currContentScrollIndex];
                }
            }
        },
        //切换非滚动内容
        handleCheckContents: function (durationArr) {
            //时长还在走
            if (this.duration > 0) {
                this.duration = this.duration - 1;
                console.log(this.duration);
            } else {
                if (this.currContentIndex < this.contentsLen) {
                    this.currContentIndex++;
                    if (this.currContentIndex == this.contentsLen) {
                        this.currContentIndex = 0;
                    }
                    this.duration = durationArr[this.currContentIndex];
                    this.handleImgdelay(this.contents[this.currContentIndex]);
                } else {
                    //clearInterval(this.timerC);
                    this.currContentIndex = 0;
                    this.duration = durationArr[this.currContentIndex];
                }
            }
        },
        //获取图片需要播放的时长
        handleImgdelay(singleContents) {
            var duration = singleContents.duration;
            var len = singleContents.images.length;
            this.delay = Math.floor(duration / len) * 1000;
        },
        //获取学校播放列表
        getPlayChannel: function () {
            var that = this;
            axios.get('./channels.json', {}).then(function (response) {
                that.$nextTick(function () {
                    this.channelData = response.data.playchannel;
                    this.getRunPlayChannel();
                });
            }).catch(function (error) {
                return error;
            })
        },
        swiperInit: function () {
            var that = this;
            var mySwiper = new Swiper('.swiper-container', {
                autoplay: {
                    delay: that.delay,
                },
                speed: 1000,
                loop: true,
                noSwiping: true,
                noSwipingClass: 'stop-swiping',
            })
        },
    },
    mounted: function () {
        var that = this;
        this.getPlayChannel();
        //定时器
        setInterval(function () {
            console.log("10")
            that.getPlayChannel()
        }, that.minutes);
    },
    updated: function () {
        this.swiperInit();
    }
});