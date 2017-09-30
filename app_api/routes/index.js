var express = require('express');
var router = express.Router();
var ctrlPalindromes = require('../controllers/palindrome');

// add routes
router.post('/palindromes', ctrlPalindromes.addPalindrome);
router.get('/palindromes', ctrlPalindromes.retrievePalindromes);

module.exports = router;
