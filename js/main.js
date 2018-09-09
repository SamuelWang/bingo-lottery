(function (window, document, Math, Vue) {

    var colors = ['FFB7DD', 'FF88C2', 'FF44AA', 'FF0088', 'C10066', 'A20055', '8C0044',
                  'FFCCCC', 'FF8888', 'FF3333', 'FF0000', 'CC0000', 'AA0000', '880000',
                  'FFC8B4', 'FFA488', 'FF7744', 'FF5511', 'E63F00', 'C63300', 'A42D00',
                  'FFDDAA', 'FFBB66', 'FFAA33', 'FF8800', 'EE7700', 'CC6600', 'BB5500'];

    var randoming = false,
        maxBallCount = 75,
        usedColor = [];

    var app = new Vue({
        el: '#app',
        data: {
            num: '',
            nums: [],
            numUpperBound: 75,
            stageBallColor: '',
            nextBtnClass: 'btn-success',
            showNum: false,
            showNextBtn: false,
            countingAnimate: false,
            completeAnimate: false
        },
        methods: {
            next: function () {
                var context = this,
                    isDone = false,
                    i = 0,
                    interval;

                if (randoming || context.nums.length === maxBallCount) return;

                randoming = true;
                document.getElementById('audio-lottery-end').pause();
                document.getElementById('audio-lottery').load();
                document.getElementById('audio-lottery').play();
                
                var ballColor = getColor();
                context.stageBallColor = ballColor;

                var newNum = findUniqueRandom(context.numUpperBound, function (randomNum) {
                    return !context.nums.some(function (item) { return item.num === randomNum });
                });
                var forRandomNum = findUniqueRandom(context.numUpperBound, function (randomNum) {
                    return randomNum > 30;
                });

                interval = window.setInterval(function () {
                    if (i === forRandomNum) {
                        context.completeAnimate = true;
                        context.num = (newNum.toString().length === 1) ? '0' + newNum : newNum.toString();
                        context.showNextBtn = true;
                        context.nums.push({ num: newNum, ballColor: ballColor });

                        if (context.nums.length === maxBallCount) {
                            context.nextBtnClass = 'btn-secondary';

                            window.setTimeout(function () {
                                window.alert('此局結束');
                                document.getElementById('audio-start').load();
                                document.getElementById('audio-start').play();
                            }, 1000);
                        }

                        window.setTimeout(function () {
                            context.completeAnimate = false;
                        }, 1000);

                        document.getElementById('audio-lottery').pause();
                        document.getElementById('audio-lottery-end').load();
                        document.getElementById('audio-lottery-end').play();
                        randoming = false;
                        clearInterval(interval);
                    } else {
                        var randomNum = Math.floor(Math.random() * context.numUpperBound) + 1;
                        context.num = (randomNum.toString().length === 1) ? '0' + randomNum : randomNum.toString();
                    }

                    i++;
                }, 100);
            },
            startNew: function () {
                var context = this,
                    i = 3,
                    interval,
                    countDownFn = function () {
                        if (i === 0) {
                            window.clearInterval(interval);
                            context.next();
                        } else {
                            var randomNum = Math.floor(Math.random() * 25) + 1;

                            context.stageBallColor = getColor();
                            context.num = '0' + i.toString();
                            context.countingAnimate = true;
                            i--;

                            window.setTimeout(function () {
                                context.countingAnimate = false;
                            }, 950);
                        }
                    };

                context.showNextBtn = false;
                context.nums = [];
                usedColor = [];

                document.getElementById('audio-lottery-end').pause();
                document.getElementById('audio-start').pause();
                document.getElementById('audio-start-beeps').play();
    
                countDownFn();
                interval = window.setInterval(countDownFn, 1000);
            }
        }
    });

    function findUniqueRandom(upper, condition) {
        var isFound = false,
            randomNum = 0;

        do {
            randomNum = Math.floor(Math.random() * upper) + 1;

            isFound = condition(randomNum);
        } while (!isFound);

        return randomNum;
    }

    function getColor() {
        var letters = '0123456789ABCDEF',
            isUnique = false,
            color;
        
        do {
            color = getColorHex();

            if (usedColor.indexOf(color) === -1) {
                isUnique = true;
                usedColor.push(color);
            }
        } while (!isUnique);
        
        return color;
    }

    function getColorHex() {
        var letters = '0123456789ABCDEF';
        var color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }

}(window, document, Math, Vue));