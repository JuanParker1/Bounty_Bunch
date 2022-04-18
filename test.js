basicFreeQuizRegistration: async (req, res) => {
    try {
        let getQuizUserCheck = await BASIC_QUIZ_TABLE.findOne({
            _id: req.body._id
        })
        if (getQuizUserCheck && getQuizUserCheck.tournament_type == "Fixed") {
            getAllTournamentsTables = await BASIC_TOURNAMENTS_TABLES.find({
                tournament_id: req.body._id,
                // tournament_type : "Fixed" 
            })
            checkIsUserRegistered = await BASIC_REGISTERED_USERS.find({
                table_id: {
                    $in: getAllTournamentsTables.map(d => d._id.toString())
                },
                user: req.query.checkUser._id.toString(),
                is_active: true
            })
            if (checkIsUserRegistered && checkIsUserRegistered.length > 0) {
                return responseMessage.responseHandlerWithMessage(res, 501, 'User already registered.');
            }
        }
        if (getQuizUserCheck && getQuizUserCheck.tournament_type == "Multiple") {
            checkIsUserRegistered = await BASIC_REGISTERED_USERS.find({
                tournament_id: req.body._id,
                user: req.query.checkUser._id.toString(),
                // is_active: true 
            })
            // if (checkIsUserRegistered && checkIsUserRegistered.length > 0 && checkIsUserRegistered.length == getQuizUserCheck.no_of_attempts ) { 
            if (checkIsUserRegistered && checkIsUserRegistered.length > 0) {
                return responseMessage.responseHandlerWithMessage(res, 501, 'User already registered.');
            }
        }
        if (getQuizUserCheck && getQuizUserCheck.tournament_type == "Time Period") {
            checkIsUserRegistered = await BASIC_REGISTERED_USERS.find({
                tournament_id: req.body._id,
                user: req.query.checkUser._id.toString(),
                // is_active: true 
            })
            // if (checkIsUserRegistered && checkIsUserRegistered.length > 0 && checkIsUserRegistered.length == getQuizUserCheck.no_of_attempts ) { 
            if (checkIsUserRegistered && checkIsUserRegistered.length > 0) {
                return responseMessage.responseHandlerWithMessage(res, 501, 'User already registered.');
            }
        }
        let getQuizInfo = await BASIC_QUIZ_TABLE.findOne({
            _id: req.body._id
        })
        if (getQuizInfo) {
            if (getQuizInfo.is_autoCreate == false) {
                if (getQuizInfo.registered_users_count >= getQuizInfo.tournament_size) {
                    return responseMessage.responseHandlerWithMessage(res, 501, 'Tournament registration full.');
                } else {
                    if (getQuizInfo.current_table == '') {
                        let save = {
                            tournament_id: req.body._id
                        }
                        const data = new BASIC_TOURNAMENTS_TABLES(save);
                        let createTable = await data.save();
                        if (createTable) {
                            let save = {
                                table_id: createTable._id,
                                user: req.query.checkUser._id.toString(),
                                tournament_id: req.body._id
                            }
                            const data = new BASIC_REGISTERED_USERS(save);
                            let regUser = await data.save();
                            if (regUser) {
                                let tournamentUpdates = await BASIC_QUIZ_TABLE.findOneAndUpdate({
                                    _id: req.body._id
                                }, {
                                    $push: {
                                        table_array: createTable._id
                                    },
                                    $inc: {
                                        registered_users_count: 1
                                    },
                                    current_table: createTable._id
                                });
                                // create leaderboard for user 
                                const leaderboardData = new LEADERBOARD({
                                    user: req.query.checkUser._id.toString(),
                                    tournament_id: req.body._id,
                                    table_id: createTable._id,
                                    mode: getQuizInfo.mode
                                });
                                let createLeaderboard = await leaderboardData.save();
                                var date1 = new Date()
                                let fmt = date.format(date1, 'YYYY-MM-DD hh:mm')
                                PUSH.playGroundNotification({
                                    user: req.query.checkUser._id.toString(),
                                    title: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,
                                    content: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,
                                    type: 'play_ground_notification'
                                })
                                return responseMessage.responseHandlerWithData(res, 200, `Registered for quiz sucessfully`, regUser);
                            }
                        }
                    } else {
                        let save = {
                            table_id: getQuizInfo.current_table,
                            user: req.query.checkUser._id.toString(),
                            tournament_id: req.body._id
                        }
                        const data = new BASIC_REGISTERED_USERS(save);
                        let regUser = await data.save();
                        if (regUser) {
                            let tournamentUpdates = await BASIC_QUIZ_TABLE.findOneAndUpdate({
                                _id: req.body._id
                            }, {
                                $inc: {
                                    registered_users_count: 1
                                },
                            });
                            // create leaderboard for user 
                            const leaderboardData = new LEADERBOARD({
                                user: req.query.checkUser._id.toString(),
                                tournament_id: req.body._id,
                                table_id: getQuizInfo.current_table,
                                mode: getQuizUserCheck.mode
                            });
                            let createLeaderboard = await leaderboardData.save();
                            var date1 = new Date()
                            let fmt = date.format(date1, 'YYYY-MM-DD hh:mm')
                            PUSH.playGroundNotification({
                                user: req.query.checkUser._id.toString(),
                                title: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,
                                content: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,
                                type: 'play_ground_notification'
                            })
                            return responseMessage.responseHandlerWithData(res, 200, `Registered for quiz sucessfully`, regUser);
                        }
                    }
                }
            }
            if (getQuizInfo.is_autoCreate == true) {
                if (getQuizInfo.registered_users_count >= getQuizInfo.tournament_size) {
                    let userCountZero = await BASIC_QUIZ_TABLE.findOneAndUpdate({
                        _id: req.body._id
                    }, {
                        registered_users_count: 0
                    });
                    let save = {
                        tournament_id: req.body._id
                    }
                    const data = new BASIC_TOURNAMENTS_TABLES(save);
                    let createTable = await data.save();
                    if (createTable) {

                        let save = {

                            table_id: createTable._id,

                            user: req.query.checkUser._id.toString(),

                            tournament_id: req.body._id

                        }

                        const data = new BASIC_REGISTERED_USERS(save);

                        let regUser = await data.save();

                        if (regUser) {

                            let tournamentUpdates = await BASIC_QUIZ_TABLE.findOneAndUpdate({

                                _id: req.body._id

                            }, {

                                $push: {
                                    table_array: createTable._id
                                },

                                $inc: {

                                    registered_users_count: 1

                                },

                                current_table: createTable._id

                            });

                            // create leaderboard for user 

                            const leaderboardData = new LEADERBOARD({

                                user: req.query.checkUser._id.toString(),

                                tournament_id: req.body._id,

                                table_id: createTable._id,

                                mode: getQuizInfo.mode

                            });

                            let createLeaderboard = await leaderboardData.save();

                            var date1 = new Date()

                            let fmt = date.format(date1, 'YYYY-MM-DD hh:mm')

                            PUSH.playGroundNotification({
                                user: req.query.checkUser._id.toString(),
                                title: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,
                                content: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,
                                type: 'play_ground_notification'
                            })
                            return responseMessage.responseHandlerWithData(res, 200, `Registered for quiz sucessfully`, regUser);
                        }
                    }
                } else {

                    if (getQuizInfo.current_table == '') {

                        let save = {

                            tournament_id: req.body._id

                        }

                        const data = new BASIC_TOURNAMENTS_TABLES(save);

                        let createTable = await data.save();

                        if (createTable) {

                            let save = {

                                table_id: createTable._id,

                                user: req.query.checkUser._id.toString(),

                                tournament_id: req.body._id

                            }

                            const data = new BASIC_REGISTERED_USERS(save);

                            let regUser = await data.save();

                            if (regUser) {

                                let tournamentUpdates = await BASIC_QUIZ_TABLE.findOneAndUpdate({

                                    _id: req.body._id

                                }, {

                                    $push: {

                                        table_array: createTable._id

                                    },

                                    $inc: {

                                        registered_users_count: 1

                                    },

                                    current_table: createTable._id

                                });

                                // create leaderboard for user 

                                const leaderboardData = new LEADERBOARD({

                                    user: req.query.checkUser._id.toString(),

                                    tournament_id: req.body._id,

                                    table_id: createTable._id,

                                    mode: getQuizInfo.mode

                                });

                                let createLeaderboard = await leaderboardData.save();

                                var date1 = new Date()

                                let fmt = date.format(date1, 'YYYY-MM-DD hh:mm')

                                PUSH.playGroundNotification({

                                    user: req.query.checkUser._id.toString(),

                                    title: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,

                                    content: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,

                                    type: 'play_ground_notification'

                                })

                                return responseMessage.responseHandlerWithData(res, 200, `Registered for quiz sucessfully`, regUser);

                            }

                        }

                    } else {

                        let save = {

                            table_id: getQuizInfo.current_table,

                            user: req.query.checkUser._id.toString(),

                            tournament_id: req.body._id

                        }

                        const data = new BASIC_REGISTERED_USERS(save);

                        let regUser = await data.save();

                        if (regUser) {

                            let tournamentUpdates = await BASIC_QUIZ_TABLE.findOneAndUpdate({

                                _id: req.body._id

                            }, {

                                $inc: {

                                    registered_users_count: 1

                                },

                            });

                            // create leaderboard for user 

                            const leaderboardData = new LEADERBOARD({

                                user: req.query.checkUser._id.toString(),

                                tournament_id: req.body._id,

                                table_id: getQuizInfo.current_table,

                                mode: getQuizInfo.mode

                            });

                            let createLeaderboard = await leaderboardData.save();

                            let fmt = date.format(date1, 'YYYY-MM-DD hh:mm')

                            PUSH.playGroundNotification({

                                user: req.query.checkUser._id.toString(),

                                title: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,

                                content: `Congratulations.! You've been successfully registered for the tournament on ${fmt}. You shall be informed once the table will full.`,

                                type: 'play_ground_notification'

                            })

                            return responseMessage.responseHandlerWithData(res, 200, `Registered for quiz sucessfully`, regUser);

                        }

                    }

                }

            }

        }



    } catch (error) {

        console.log(error)

        return responseMessage.responseHandlerWithMessage(res, 500, error);

    }

},




    basicFreeLiveQuizRegistration: async (req, res) => {
        try {
            getAllTournamentsTables = await BASIC_TOURNAMENTS_TABLES.find({
                tournament_id: req.body._id
            })
            checkIsUserRegistered = await BASIC_REGISTERED_USERS.find({
                table_id: {
                    $in: getAllTournamentsTables.map(d => d._id.toString())
                },
                user: req.query.checkUser._id.toString(),
                is_active: true
            })
            if (checkIsUserRegistered && checkIsUserRegistered.length > 0) {
                return responseMessage.responseHandlerWithMessage(res, 501, 'User already registered.');
            }

            let getQuizInfo = await BASIC_QUIZ_TABLE.findOne({
                _id: req.body._id
            })
            if (getQuizInfo) {
                // if (getQuizInfo.registered_users_count >= getQuizInfo.tournament_size) { 
                //   return responseMessage.responseHandlerWithMessage(res, 501, 'Tournament registration full.'); 
                // } else { 
                //transaction logic 
                // let finalAmount = getQuizInfo.bonus_amount + getQuizInfo.entry_fee 

                let id = `${+new Date()}`
                let save = {
                    tournament_id: req.body._id
                }
                const data = new BASIC_TOURNAMENTS_TABLES(save);
                let createTable = await data.save();
                if (createTable) {
                    let save = {
                        table_id: createTable._id,
                        user: req.query.checkUser._id.toString(),
                        admin: req.query.checkUser._id.toString(),
                        tournament_id: req.body._id,
                        share_access: req.body.share_access,
                        available_invite_registered_user_count: getQuizInfo.tournament_size
                    }
                    const data = new BASIC_REGISTERED_USERS(save);
                    let regUser = await data.save();
                    if (regUser) {
                        let tournamentUpdates = await BASIC_QUIZ_TABLE.findOneAndUpdate({
                            _id: req.body._id
                        }, {
                            $push: {
                                table_array: createTable._id
                            },
                            $inc: {
                                registered_users_count: 1
                            },
                            current_table: createTable._id
                        });

                        // generating question for quiz 
                        let questionBank = []
                        let lifeline = []
                        //logic for fetching questions from filters 
                        let getFilters = await BASIC_QUIZ_TABLE.findOne({
                            _id: req.body._id
                        });
                        if (getFilters) {
                            for (f of getFilters.filter) {
                                if (f.questionCategory == 'Basic') {
                                    let questionsPush
                                    let basicQuestions = await BASIC_QUESTION.find({
                                        // level : f.difficulty_level, 
                                        level: {
                                            $in: f.difficulty_level
                                        },
                                        topic: {
                                            $in: f.topic
                                        },
                                        language: {
                                            $in: f.language
                                        },
                                        // 'question.question_Type' : f.question_type, 
                                        is_active: true
                                    });
                                    if (basicQuestions.length > 0) {
                                        let questionDetail = basicQuestions.map(d => {
                                            return {
                                                _id: d._id,
                                                question: d.question,
                                                optionA: d.optionA,
                                                optionB: d.optionB,
                                                optionC: d.optionC,
                                                optionD: d.optionD,
                                                answer: d.answer
                                            }
                                        })
                                        var randomQuestion = questionDetail.sort(() => Math.radom() - Math.random()).slice(0, f.no_of_question)

                                        let disableQuestion = await BASIC_QUESTION.updateMany({
                                            _id: randomQuestion.map(d => d._id)
                                        }, {
                                            $set: {
                                                is_active: false,
                                                is_question_used: true
                                            }
                                        })
                                        for (r of randomQuestion) {
                                            questionsPush = {
                                                _id: r._id,
                                                question: r.question,
                                                optionA: r.optionA,
                                                optionB: r.optionB,
                                                optionC: r.optionC,
                                                optionD: r.optionD,
                                                answer: r.answer
                                            }
                                            questionBank.push(questionsPush)
                                        }
                                        //for life line question

                                        let basicLifeLineQuestions = await BASIC_QUESTION.findOne({
                                            // level : f.difficulty_level, 
                                            level: {
                                                $in: f.difficulty_level
                                            },
                                            topic: {
                                                $in: f.topic
                                            },
                                            language: {
                                                $in: f.language
                                            },
                                            // 'question.question_Type' : f.question_type, 
                                            is_active: true
                                        }).lean();
                                        if (basicLifeLineQuestions) {
                                            // for (ll of randomQuestion) { 
                                            let lifeLineQuestionsPush = {
                                                _id: basicLifeLineQuestions._id,
                                                question: basicLifeLineQuestions.question,
                                                optionA: basicLifeLineQuestions.optionA,
                                                optionB: basicLifeLineQuestions.optionB,
                                                optionC: basicLifeLineQuestions.optionC,
                                                optionD: basicLifeLineQuestions.optionD,
                                                answer: basicLifeLineQuestions.answer
                                            }
                                            lifeline.push(lifeLineQuestionsPush)
                                            // } 
                                        }
                                    }
                                }
                                if (f.questionCategory == 'Competitive') {
                                    let questionsPush
                                    let competitiveQuestions = await COMPT_QUESTION.find({
                                        // level : f.difficulty_level, 
                                        level: {
                                            $in: f.difficulty_level
                                        },
                                        topic: {
                                            $in: f.topic
                                        },
                                        language: {
                                            $in: f.language
                                        },
                                        // 'question.question_Type' : f.question_type, 
                                        subCategory: {
                                            $in: f.subCategory
                                        },
                                        is_active: true
                                    });
                                    if (competitiveQuestions.length > 0) {
                                        let questionDetail = competitiveQuestions.map(d => {
                                            return {
                                                _id: d._id,
                                                question: d.question,
                                                optionA: d.optionA,
                                                optionB: d.optionB,
                                                optionC: d.optionC,
                                                optionD: d.optionD,
                                                answer: d.answer
                                            }
                                        })
                                        var randomQuestion = questionDetail.sort(() => Math.random() - Math.random()).slice(0, f.no_of_question)
                                        let disableQuestion = await COMPT_QUESTION.updateMany({
                                            _id: randomQuestion.map(d => d._id)
                                        }, {
                                            $set: {
                                                is_active: false,
                                                is_question_used: true
                                            }
                                        })
                                        for (r of randomQuestion) {
                                            questionsPush = {
                                                _id: r._id,
                                                question: r.question,
                                                optionA: r.optionA,
                                                optionB: r.optionB,
                                                optionC: r.optionC,
                                                optionD: r.optionD,
                                                answer: r.answer
                                            }
                                            questionBank.push(questionsPush)
                                        }
                                        //for life line question 
                                        let competitiveLifeLineQuestions = await COMPT_QUESTION.findOne({
                                            // level : f.difficulty_level, 
                                            level: {
                                                $in: f.difficulty_level
                                            },
                                            topic: {
                                                $in: f.topic
                                            },
                                            language: {
                                                $in: f.language
                                            },
                                            // 'question.question_Type' : f.question_type, 
                                            subCategory: {
                                                $in: f.subCategory
                                            },
                                            is_active: true
                                        }).lean();
                                        if (competitiveLifeLineQuestions) {
                                            for (ll of randomQuestion) {
                                                let lifeLineQuestionsPush = {
                                                    _id: ll._id,
                                                    question: ll.question,
                                                    optionA: ll.optionA,
                                                    optionB: ll.optionB,
                                                    optionC: ll.optionC,
                                                    optionD: ll.optionD,
                                                    answer: ll.answer
                                                }
                                                lifeline.push(lifeLineQuestionsPush)
                                            }
                                        }
                                    }
                                }
                                if (f.questionCategory == 'Logo') {
                                    let questionsPush
                                    let logoQuestions = await LOGO_QUESTION.find({
                                        // level : f.difficulty_level, 
                                        level: {
                                            $in: f.difficulty_level
                                        },
                                        topic: {
                                            $in: f.topic
                                        },
                                        language: {
                                            $in: f.language
                                        },
                                        // 'question.question_Type' : f.question_type, 
                                        is_active: true
                                    });
                                    if (logoQuestions.length > 0) {
                                        let questionDetail = logoQuestions.map(d => {
                                            return {
                                                _id: d._id,
                                                question: d.question,
                                                optionA: d.optionA,
                                                optionB: d.optionB,
                                                optionC: d.optionC,
                                                optionD: d.optionD,
                                                answer: d.answer
                                            }
                                        })
                                        var randomQuestion = questionDetail.sort(() => Math.random() - Math.random()).slice(0, f.no_of_question)
                                        let disableQuestion = await LOGO_QUESTION.updateMany({
                                            _id: randomQuestion.map(d => d._id)
                                        }, {
                                            $set: {
                                                is_question_used: true,
                                                is_active: false
                                            }
                                        })
                                        for (r of randomQuestion) {
                                            questionsPush = {
                                                _id: r._id,
                                                question: r.question,
                                                optionA: r.optionA,
                                                optionB: r.optionB,
                                                optionC: r.optionC,
                                                optionD: r.optionD,
                                                answer: r.answer
                                            }
                                            questionBank.push(questionsPush)
                                        }
                                        //for life line question 
                                        let logoLifeLineQuestions = await LOGO_QUESTION.findOne({
                                            // level : f.difficulty_level, 
                                            level: {
                                                $in: f.difficulty_level
                                            },
                                            topic: {
                                                $in: f.topic
                                            },
                                            language: {
                                                $in: f.language
                                            },
                                            // 'question.question_Type' : f.question_type, 
                                            is_active: true
                                        }).lean();
                                        if (logoLifeLineQuestions) {
                                            for (ll of randomQuestion) {
                                                let lifeLineQuestionsPush = {
                                                    _id: ll._id,
                                                    question: ll.question,
                                                    optionA: ll.optionA,
                                                    optionB: ll.optionB,
                                                    optionC: ll.optionC,
                                                    optionD: ll.optionD,
                                                    answer: ll.answer
                                                }
                                                lifeline.push(lifeLineQuestionsPush)
                                            }
                                        }
                                    }
                                }
                                //   //save questions  
                                // // console.log('current_table----------------------------------------------->',getFilters.current_table) 
                                // let saveQUestions = await TOURNAMENT_QUESTIONS.insertMany({ 
                                //   tournament_id: req.body._id, 
                                //   table_id: getFilters.current_table, 
                                //   questionBank: questionBank, 
                                //   lifeline: lifeline 
                                // }) 
                            }
                            //save questions  
                            let saveQUestions = await TOURNAMENT_QUESTIONS.insertMany({
                                tournament_id: req.body._id,
                                table_id: getFilters.current_table,
                                questionBank: questionBank,
                                lifeline: lifeline
                            })
                        }
                        // let disableQuiz = await BASIC_QUIZ_TABLE.findOne({ 
                        //   _id: req.body._id 
                        // }); 
                        // if(disableQuiz && disableQuiz.tournament_size == disableQuiz.registered_users_count){ 
                        //   let disableTournaments = await BASIC_QUIZ_TABLE.findOneAndUpdate({_id: req.body._id}, {is_active : false}); 
                        // } 
                        return responseMessage.responseHandlerWithData(res, 200, `Registered for quiz sucessfully`, regUser);
                    }
                }
                // } 
            }

        } catch (error) {
            console.log(error)
            return responseMessage.responseHandlerWithMessage(res, 500, error);
        }
    }