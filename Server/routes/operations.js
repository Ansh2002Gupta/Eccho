const express = require('express');
const { newContactController, getContactList } = require('../controllers/operationController');

router = express.Router();

router.route('/add-new-contact').post(newContactController);
router.route('/fetch-contact-list').get(getContactList);

module.exports = router;
