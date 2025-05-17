const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient()

const insertUser = async (name, email, password) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
        console.log('User created:', newUser);
        return { success: true };
    } catch (err) {
        if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
            console.log('Email already exists.');
            return { success: false, message: 'Email already exists' };
        } else {
            console.error('Error inserting user:', err);
            return { success: false, message: 'Unexpected error occurred' };
        }
    }
};
module.exports = {
    insertUser,
}