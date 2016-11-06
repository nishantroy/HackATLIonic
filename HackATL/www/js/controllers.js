angular.module('starter.controllers', [])

    .controller('DiagnosisController', function ($scope, $http) {
        // Diagnosis functionality
    })

    .controller('HomeController', function ($scope, $http) {

        $scope.concussioned = function () {
            swal({
                title: "Congretz! u hv conkushen",
                text: "u ded",
                type: "info"
            });
        }
    })

    .controller('WebgazerController', function ($scope, usSpinnerService, $rootScope) {
        $scope.startcounter = 0;
        $scope.startSpin = function () {
            if (!$scope.spinneractive) {
                usSpinnerService.spin('spinner-1');
                $scope.startcounter++;
            }
        };

        $scope.stopSpin = function () {
            if ($scope.spinneractive) {
                usSpinnerService.stop('spinner-1');
            }
        };
        $scope.spinneractive = false;
        $rootScope.$on('us-spinner:spin', function (event, key) {
            $scope.spinneractive = true;
        });

        // $scope.setup = function () {
        //     var width = 320;
        //     var height = 240;
        //     var topDist = '0px';
        //     var leftDist = '0px';
        //
        //     var video = document.getElementById('webgazerVideoFeed');
        //     video.style.display = 'block';
        //     video.style.position = 'absolute';
        //     video.style.top = topDist;
        //     video.style.left = leftDist;
        //     video.width = width;
        //     video.height = height;
        //     video.style.margin = '0px';
        //
        //     webgazer.params.imgWidth = width;
        //     webgazer.params.imgHeight = height;
        //
        //     var overlay = document.getElementById('overlay');
        //     overlay.style.position = 'absolute';
        //     overlay.width = width;
        //     overlay.height = height;
        //     overlay.style.top = topDist;
        //     overlay.style.left = leftDist;
        //     overlay.style.margin = '0px';
        //
        //     document.body.appendChild(overlay);
        //
        //     var cl = webgazer.getTracker().clm;
        //
        //     function drawLoop() {
        //         requestAnimFrame(drawLoop);
        //         overlay.getContext('2d').clearRect(0, 0, width, height);
        //         if (cl.getCurrentPosition()) {
        //             cl.draw(overlay);
        //         }
        //     }
        //
        //     drawLoop();
        // };

        $scope.checkReady = function () {
            if (webgazer.isReady()) {
                console.log("running setup");
                // $scope.setup();
            } else {
                console.log("timeout");
                setTimeout($scope.checkReady, 100);
            }
        };

        $scope.startWebgaze = function () {
            console.log("Start");
            var averagex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var averagey = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var count = 0;
            webgazer
                .setGazeListener(function (prediction, elapsedTime) {
                    if (prediction) {
                        //console.log("X : " + prediction.x + ", Y : " + prediction.y);
                        averagex[count] = prediction.x;
                        averagey[count] = prediction.y;
                        count += 1;
                        if (count == averagex.length) {
                            var sumx = 0;
                            var sumy = 0;
                            for (var i = 0; i < averagex.length; i += 1) {
                                sumx += averagex[i];
                                sumy += averagey[i];
                                averagex[i] = 0;
                                averagey[i] = 0;
                            }
                            var avgX = sumx / averagex.length;
                            var avgY = sumy / averagey.length;
                            console.log("X : " + avgX + ", Y : " + avgY);
                            count = 0;
                        }
                    }
                    // console.log(elapsedTime);
                })
                .begin()
                .setTracker("clmtrackr")
                .setRegression("ridge")
                .showPredictionPoints(true);
            // $scope.checkReady();
        }
    })


    .controller('QuestionsController', function ($scope, $http) {
        //quiz thing
        $scope.startQuiz = function () {
            $scope.inProgress = true;
            $scope.quizOver = false;
            $scope.id = 0;
            $scope.score = 0;
            $scope.answers = [];
            $scope.questions = [
                {
                    question: "Was the athlete able to recall their location?",
                    options: ["Yes", "No"],
                    answer: 0
                },
                {
                    question: "Was the athlete able to recall the current date?",
                    options: ["Yes", "No"],
                    answer: 0
                },
                {
                    question: "Was the athlete able to recall the opposing team's name?",
                    options: ["Yes", "No"],
                    answer: 0
                },
                {
                    question: "Did the athlete correctly recall if their team scored this game?",
                    options: ["Yes", "No"],
                    answer: 0
                },
                {
                    question: "Is the athlete experiencing headaches, nausea, or dizziness?",
                    options: ["Yes", "No"],
                    answer: 1
                },
                {
                    question: "Have the athlete walk along a line, alternating their foot along the line on each step.\n" +
                    "Does the athlete step off the line or have any visible balance problems?",
                    options: ["Yes", "No"],
                    answer: 1
                },
                {
                    question: "Have the athlete sit comfortably on a chair and use his index finger to touch his nose five times, alternating hands.\n" +
                    "Does the athlete report any neck and spine pain, have trouble touching his nose, or fail to correctly touch his nose five times?",
                    options: ["Yes", "No"],
                    answer: 1
                },
                {
                    question: "Does the athlete have double vision or have trouble reading?",
                    options: ["Yes", "No"],
                    answer: 1
                },
                {
                    question: "Who invented telephone?",
                    options: ["Albert Einstein", "Alexander Graham Bell", "Isaac Newton", "Marie Curie"],
                    answer: 1
                }
            ];
            $scope.nextQuestion();
        };

        $scope.nextQuestion = function () {
            var $q = false;
            if ($scope.id < $scope.questions.length) {
                $q = $scope.questions[$scope.id];
            }
            if ($q) {
                $scope.question = $q.question;
                $scope.options = $q.options;
                $scope.answer = $q.answer;
            } else {
                $scope.quizOver = true;
                $scope.calcResults();
            }
        };

        $scope.checkAnswer = function () {
            var ans = $('input[name=answer]:checked').val();

            if (ans) {
                if (ans != $scope.options[$scope.answer]) {
                    $scope.score++;
                }
                $scope.answers.push(ans);
                $scope.id++;
                $scope.nextQuestion();
            }
        };

        $scope.calcResults = function () {
            console.log($scope.answers);
            if ($scope.score > 0) {
                $scope.result = "The athlete has shown at least one symptom. They should stay off the field.\n Take the test to diagnose severity.";
            } else {
                $scope.result = "The athlete has not admitted to any symptom. Take the test to verify.";
            }
        };
    })


    .controller('DashCtrl', function ($scope) {
    })

    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
