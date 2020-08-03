const express = require('express'); // exporte "express" .
const router  = express.Router(); // exporte les routers .

const sauceCtrl = require('../controllers/sauces'); // le controlleur importer depuis le dossier controlleur ***.
const auth      = require('../middleware/auth'); // importer notre middleware pour l'authentification .
const multer    = require('../middleware/multer-config'); // pour importer "multer" .


router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.reactToSauce);  // Route où vous pouvez réagir à l'une des sauces existantes

module.exports = router; // exporter les routers .
