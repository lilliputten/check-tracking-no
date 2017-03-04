
var firstLetterCodes = {
    C : 'Regular parcel less 2kg', // обычная посылка, посылки более 2кг
    R : 'Registred tracked letter or parcel less 2kg', // регистрируемое письмо, посылки менее 2 кг
    L : 'Regular not tracked letter', // обычное(экспресс) письмо, треки начинающиеся с этой буквы не отслеживаются
    E : 'EMS mailing', // экспресс отправление(EMS),вторая буква является порядковой
    V : 'Insured letter', // застрахованное письмо
    А : 'Not insured not tracked letter', // письмо, не отслеживается и не застрахованное
};

module.exports = function parseServiceCode (code) {
    return new Promise ((resolve, reject) => {
        
        var

            firstLetter = code.charAt(0),
            secondLetter = code.charAt(1),

            data = {
                type : firstLetter,
                code : secondLetter,
            },

            undef
        ;

        if ( firstLetterCodes[firstLetter] ) {
            data.explained = firstLetterCodes[firstLetter];
            data.typeExplained = firstLetterCodes[firstLetter];
        }

        return resolve(data);
        
    });
};

