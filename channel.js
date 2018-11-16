var vm = new Vue({
    data: {
        //定时器
        timer: null,
        timerScroll: null,

        //栏目
        channelIndex: -1,
        channelIndexing: -1,
        channelContens: null,
        channelContenLen: 0,
        channelContenIndex: -1,
        channelDuration: 0, //单条内容时长

        //滚动内容数据
        scrollData: [],

        //栏目数据
        channelData: []

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
                var startTime = (validstarttime + " " + playstarttime).replace(/-/g, '/');
                var endTime = (validendtime + " " + playendtime).replace(/-/g, '/');
                var start = new Date(startTime).getTime();
                var end = new Date(endTime).getTime();
                //跟当前时间对比时间戳
                if (now > start && now < end) {
                    if (hms >= playstarttime && hms <= playendtime) {
                        isPlayChannel.push(channels); //
                    }
                } else {

                }
            }

            //找到栏目
            if (isPlayChannel.length) {
                var o = this.handleChannelComputed(isPlayChannel)
                if (Object.keys(o).length) {
                    this.channelIndex = o.index;
                    if (this.channelIndexing === this.channelIndex) {
                        //...
                    } else {
                        this.channelIndexing = this.channelIndex;
                        this.playChannelContens(o.showChannels.contents);
                    }
                }
            } else {
                //如果没有找到栏目，则不显示
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
                return elem.priority === priorityMax
            });
            if (Object.keys(resultChannel).length) {
                index = this.channelData.findIndex(function (elem) {
                    return elem.channelname === resultChannel.channelname && elem.priority === resultChannel.priority;
                });
                return {
                    index: index,
                    showChannels: resultChannel
                }
            }
        },
        //播放栏目内容
        playChannelContens: function (contens) {
            console.log(contens);
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
                console.log(this.channelDuration);
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
        //获取数据
        getSchoolData: function () {
            this.channelData = channels.playchannel; //栏目数据
            this.scrollData = channels.scroll; //滚动数据
            this.getPlayChannels();
            this.getScrollContens();
        },
        init: function () {
            this.getSchoolData();
        },
    },
    mounted: function () {
        this.init();
    },
}).$mount("#root");