require('typescript-require');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: __dirname+'/./../../.env'}); //importo le variabili d'ambiente

function verifica (req, res, next)
{
    let token = req.cookies["jwt"];
    
    

    if (token)
    {
        try
        {
            token = token.replace('"', ''); //rimuovo le virgolette dal token
            token = token.replace('"', '');
        }
        catch (err)
        {
            res.status(301).json(JSON.stringify({"ridirezione": true}));
        }

        jwt.verify(token, process.env.SEGRETA, (err, user) => {
            if (!err)
            {
                next();
            }
            else
            {
                //res.redirect(301, 'http://imac-di-mauro.lan:3000/');
                res.status(200).json(JSON.stringify({"ridirezione": true}));
            }
        });
    }
    else
    {
        res.status(200).json(JSON.stringify({"ridirezione": true}));
    }
}

export = verifica;