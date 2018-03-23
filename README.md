# PassportJWTMEAN
Simple authentication example using Passport.js and JWT

# Init
npm install

cat > config.js

in config.js file add ( never share this secret key in public):
module.exports = {  
    jwtSecret: "MYSECRETSTRING",
    jwtSession: {
        session: false
    }
};

npm start
