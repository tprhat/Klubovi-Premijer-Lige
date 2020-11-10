const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.download('./Klubovi_Premier_Lige.csv', 'Klubovi_Premijer_Lige.csv')
  });

  module.exports = router;