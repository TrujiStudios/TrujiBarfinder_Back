import 'dotenv/config'

export const environment = {
    port: process.env.PORT || 3000,
    databaseURL: process.env.DATABASE_URL,
    databaseName: process.env.DATABASE_NAME,
    jetSecret: process.env.JWT_SECRET,

}


// export default environment;