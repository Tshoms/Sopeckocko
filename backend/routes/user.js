const express = require('express'); // importer "express" .
const router  = express.Router(); // créer le router avec la fonction express. router .

const userCtrl = require('../controllers/user'); // les fonction pour associer les fonctions aux différentes routes .

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
