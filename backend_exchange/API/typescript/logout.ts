function logout (req, res)
{
    //res.clearCookie("jwt");
    //res.clearCookie("utente");

    res.cookie('jwt', '""', {httpOnly: true, secure: true, sameSite: "none"});
    res.cookie('utente', '""', {httpOnly: true, secure: true, sameSite: "none"});
    //res.cookie('pippo', '"logout"', {httpOnly: true, maxAge: 900000, secure: true, sameSite: "none"});

    //res.redirect('http://imac-di-mauro.lan:3000/');
    res.status(200).json("logout effettuato"); //restituisco il nuovo token
}

export = logout;