const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.download('./Klubovi_Premier_Lige.json', 'Klubovi_Premijer_Lige.json')
  });

  module.exports = router;