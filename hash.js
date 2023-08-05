
const bcrypt = require('bcrypt');

async function generateSalt() {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('12345', salt);
    console.log(salt);
    console.log(hashed);
}

generateSalt();
