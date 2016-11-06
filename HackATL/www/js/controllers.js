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

        $scope.countDown = function () {
            $scope.ExperimentInProgress = true;
            $scope.countdown = true;
            $scope.seconds = 50000; //ms? ns?
            $scope.startWebgaze();
            $scope.startSpin();
        };

        $scope.startcounter = 0;

        $scope.startSpin = function () {
            console.log("start spin");
            if (!$scope.spinneractive) {
                console.log("if block");
                usSpinnerService.spin('spinner-1');
                $scope.startcounter++;
            }
        };

        $scope.stopSpin = function () {
            console.log("Stop spinner");
            if ($scope.spinneractive) {
                console.log("If Block");
                usSpinnerService.stop('spinner-1');
            }
        };
        $scope.spinneractive = false;
        $rootScope.$on('us-spinner:spin', function (event, key) {
            $scope.spinneractive = true;
        });

        $rootScope.$on('us-spinner:stop', function(event, key) {
            $scope.spinneractive = false;
        });



        $scope.startWebgaze = function () {
            console.log("Start");
            var overallCount = 0;
            var averagex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var averagey = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var count = 0;
            webgazer
                .setGazeListener(function (prediction, elapsedTime) {
                    if (prediction) {
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
                            if (avgX > 1400 || avgX < 500 || avgY > 700 || avgY < 100) {
                                console.log("looked too far");
                            }
                            count = 0;
                            overallCount++;
                        }
                    }

                    if (overallCount == 4) {
                        swal({
                                title: "No Concussion Detected",
                                text: "Athlete is safe for physical activity",
                                type: "info"
                                //closeOnConfirm: false
                            },
                            function () {
                                webgazer.end();
                                $scope.stopSpin();
                            });
                    }
                })
                .begin()
                .setTracker("clmtrackr")
                .setRegression("ridge")
                .showPredictionPoints(true);
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
            $scope.chosenAnswer = "";
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
                }
            ];
            $scope.nextQuestion();
        };

        $scope.nextQuestion = function () {
            if ($scope.id < $scope.questions.length) {
                $scope.question = $scope.questions[$scope.id].question;
                $scope.options = $scope.questions[$scope.id].options;
                $scope.answer = $scope.questions[$scope.id].answer;
            } else {
                $scope.quizOver = true;
                $scope.calcResults();
            }

        };

        $scope.checkAnswer = function (ans) {
            console.log(ans);
            if (ans != $scope.options[$scope.answer]) {
                $scope.score++;
            }
            $scope.answers.push(ans);
            $scope.id++;
            $scope.nextQuestion();
        };

        $scope.calcResults = function () {
            console.log($scope.answers);
            if ($scope.score > 0) {

                if ($scope.score == 1) {
                    $scope.result = "The athlete has shown 1 symptom of concussion. " +
                        "They should refrain from activity.\n Take the test to diagnose severity.";
                } else {
                    $scope.result = "The athlete has shown " + $scope.score + " symptoms of concussion. " +
                        "They should refrain from activity.\n Take the test to diagnose severity.";
                }
            } else {
                $scope.result = "The athlete has not admitted to any symptoms of concussion. Take the test to verify.";
            }
        };
    });



