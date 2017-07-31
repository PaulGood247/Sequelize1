var express = require('express');
var router = express.Router();
var models = require('../models/index');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt =  require('jsonwebtoken');
var token_secret = require('../config/config.json').secret;

router.use(bodyParser.json());

router.use(expressJWT({
  secret: token_secret,
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      let token = req.headers.authorization.split(' ')[1];
      if(jwt.verify(token, token_secret))
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      if(jwt.verify(token, token_secret))
        return req.query.token;
    }
    return null;
  }
}).unless({path: ['/user/login']}));


function createJudges() {
  models.Judge.create({
   name: "Judge 1",
   room: 1,
   ext : "ext1"
  }).then(function(judge){
   console.log(judge.dataValues);
  });

  models.Judge.create({
   name: "Judge 2",
   room: 2,
   ext : "ext2"
  }).then(function(judge){
   console.log(judge.dataValues);
  });

  models.Judge.create({
   name: "Judge 3",
   room: 3,
   ext : "ext3"
  }).then(function(judge){
   console.log(judge.dataValues);
  });

}

function createCourtrooms() {
  models.Courtroom.create({
   number: 1
  }).then(function(courtroom){
   console.log(courtroom.dataValues);
  });

  models.Courtroom.create({
   number: 2
  }).then(function(courtroom){
   console.log(courtroom.dataValues);
  });

  models.Courtroom.create({
   number: 3
  }).then(function(courtroom){
   console.log(courtroom.dataValues);
  });

}

function createParticipant() {
  models.Participant.create({
   name: "Claimant 1",
   address: "address 1",
   type : "Claimant"
  }).then(function(participant){
   console.log(participant.dataValues);
  });

  models.Participant.create({
   name: "Claimant 2",
   address: "address 2",
   type : "Claimant"
  }).then(function(participant){
   console.log(participant.dataValues);
  });

  models.Participant.create({
   name: "Claimant 3",
   address: "address 3",
   type : "Claimant"
  }).then(function(participant){
   console.log(participant.dataValues);
  });


  models.Participant.create({
   name: "Respondant 1",
   address: "address 4",
   type : "Respondant"
  }).then(function(participant){
   console.log(participant.dataValues);
  });

  models.Participant.create({
   name: "Respondant 2",
   address: "address 5",
   type : "Respondant"
  }).then(function(participant){
   console.log(participant.dataValues);
  });

  models.Participant.create({
   name: "Respondant 3",
   address: "address 6",
   type : "Respondant"
  }).then(function(participant){
   console.log(participant.dataValues);
  });

}

function createCases() {
  models.Case.create({
   judge_id : 1,
   courtroom_id : 1,
   claimant_id: 1,
   respondant_id: 1,
   start_date: "01/01/2017",
   duration: 1,
   result: false
  }).then(function(result){
   console.log(result);
  });

  models.Case.create({
   judge_id : 2,
   courtroom_id : 2,
   claimant_id: 2,
   respondant_id: 2,
   start_date: "02/02/2017",
   duration: 2,
   result: true
  }).then(function(result){
   console.log(result);
  });

  models.Case.create({
   judge_id : 3,
   courtroom_id : 3,
   claimant_id: 3,
   respondant_id: 3,
   start_date: "03/03/2017",
   duration: 3,
   result: false
  }).then(function(result){
   console.log(result);
  });

}

//createUsers();
//createJudges();
//createCourtrooms();
//createParticipant();
//createCases();



// add new user
router.post('/user', function(req, res) {
  models.user.create({
    username: req.query.username,
    password: req.query.password
  }).then(function(user) {
    res.json(user);
  });
});

//login -------------------------------------------
router.post('/user/login', function(req, res) {
  console.log(req.body);

  models.sequelize.query('SELECT password FROM users WHERE username = :username;', {
    replacements: {
      password: req.query.password,
      username: req.query.username
    }
  }).then(function(authenticated) {

    if(models.user.compareHash(req.query.password)){
      let token = jwt.sign({
        data: authenticated },
        token_secret, { expiresIn: '1h' });
      res.status(200).json(token);
    }else{
      res.status(401).json('ERROR');
    }

  });
});

//judges --------------------------------------
router.post('/judge', function(req, res) {
  models.Judge.create({

    name: req.query.name,
    room: req.query.room,
    ext : req.query.ext
  }).then(function(judge) {
    res.json(judge);
  });
});

router.get('/judges', function(req, res) {
  models.Judge.findAll({}).then(function(judges) {
    res.json(judges);
  });
});

router.get('/judge/:id', function(req, res) {
  models.Judge.find({
    where: {
      id: req.params.id
    }
  }).then(function(judges) {
    res.json(judges);
  });
});

router.put('/judge/:id', function(req, res) {
  models.Judge.find({
    where: {
      id: req.params.id
    }
  }).then(function(judge) {
    if(judge){
      judge.updateAttributes({
        name: req.body.name,
        address: req.body.address,
        type: req.body.type

        }).then(function(judge){
          res.send(judge)

      });
    }
  });
});

router.delete('/judge/:id', function(req,res){
  models.Judge.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(judge){
    res.json(judge);
  });
});

//courtrooms ------------------------------
router.post('/coutroom', function(req, res) {
  models.Courtroom.create({

    number: req.query.number
  }).then(function(courtroom) {
    res.json(courtroom);
  });
});

router.get('/courtrooms', function(req, res) {
  models.Courtroom.findAll({}).then(function(courtroom) {
    res.json(courtroom);
  });
});

router.get('/courtroom/:id', function(req, res) {
  models.Courtroom.find({
    where: {
      id: req.params.id
    }
  }).then(function(courtroom) {
    res.json(courtroom);
  });
});

router.put('/courtroom/:id', function(req, res) {
  models.Courtroom.find({
    where: {
      id: req.params.id
    }
  }).then(function(courtroom) {
    if(courtroom){
      courtroom.updateAttributes({
        number: req.body.number

        }).then(function(courtroom){
          res.send(courtroom)

      });
    }
  });
});

router.delete('/courtroom/:id', function(req,res){
  models.Courtroom.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(courtroom){
    res.json(courtroom);
  });
});


//participants ----------------------------------
router.post('/participant', function(req, res) {
  models.Participant.create({

    name: req.query.name,
    address: req.query.address,
    type: req.query.type
  }).then(function(participants) {
    res.json(participants);
  });
});

router.get('/participants', function(req, res) {
  models.Participant.findAll({}).then(function(participants) {
    res.json(participants);
  });
});

router.get('/participant/:id', function(req, res) {
  models.Participant.find({
    where: {
      id: req.params.id
    }
  }).then(function(participants) {
    res.json(participants);
  });
});

router.put('/participant/:id', function(req, res) {
  models.Participant.find({
    where: {
      id: req.params.id
    }
  }).then(function(participants) {
    if(participants){
      participants.updateAttributes({
        name: req.body.name,
        address: req.body.address,
        type: req.body.type

        }).then(function(participants){
          res.send(participants)

      });
    }
  });
});

router.delete('/participant/:id', function(req,res){
  models.Participant.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(participants){
    res.json(participants);
  });
});

//cases -----------------------------------------
router.post('/case', function(req, res) {
  models.Case.create({

    judge_id: req.query.judge_id,
    courtroom_id: req.query.courtroom_id,
    claimant_id: req.query.claimant_id,
    respondant_id: req.query.respondant_ids,
    start_date: req.query.start_date,
    duration: req.query.duration,
    result: req.query.result
  }).then(function(result) {
    res.json(result);
  });
});

router.get('/cases', function(req, res) {
  models.Case.findAll({}).then(function(cases) {
    res.json(cases);
  });
});

router.get('/case/:id', function(req, res) {
  models.Case.find({
    where: {
      id: req.params.id
    }
  }).then(function(cases) {
    res.json(cases);
  });
});

router.put('/case/:id', function(req, res) {
  models.Case.find({
    where: {
      id: req.params.id
    }
  }).then(function(cases) {
    if(cases){
      cases.updateAttributes({
        judge_id: req.body.judge_id,
        courtroom_id: req.body.courtroom_id,
        claimant_id: req.body.claimant_id,
        respondant_id: req.body.respondant_ids,
        start_date: req.body.start_date,
        duration: req.body.duration,
        result: req.body.result

        }).then(function(cases){
          res.send(cases)

      });
    }
  });
});

router.delete('/case/:id', function(req,res){
  models.Case.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(cases){
    res.json(cases);
  });
});









router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// get all todos
router.get('/todos', function(req, res) {
  models.Todo.findAll({}).then(function(todos) {
    res.json(todos);
  });
});

// get single todo
router.get('/todo/:id', function(req, res) {
  models.Todo.find({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    res.json(todo);
  });
});

// add new todo
router.post('/todos', function(req, res) {
  models.Todo.create({
    title: req.body.title,
    UserId: req.body.user_id
  }).then(function(todo) {
    res.json(todo);
  });
});

// update single todo
router.put('/todo/:id', function(req, res) {
  models.Todo.find({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    if(todo){
      todo.updateAttributes({
        title: req.body.title,
        complete: req.body.complete
      }).then(function(todo) {
        res.send(todo);
      });
    }
  });
});

// delete a single todo
router.delete('/todo/:id', function(req, res) {
  models.Todo.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    res.json(todo);
  });
});

module.exports = router;
