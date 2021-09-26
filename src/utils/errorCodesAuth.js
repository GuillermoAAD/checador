module.exports = {
	getError: function(errorCode) {
	const errorCodesAuth = new Map([
		["auth/email-already-in-use", "La dirección de correo electrónico ya está siendo utilizada por otra cuenta."],
	]);
   return errorCodesAuth.get(errorCode);
	}

}

