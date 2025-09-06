import mongoosh from "mongoose"

const ConnectDb = async() => {
    try {
        const connect = await mongoosh.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log(`\nMongoDB connected!! DB Host ${connect.connection.host}`)
    } catch (error) {
        console.log("Error while connection DB : ",error)
        process.exit(1);
    }

}

export default ConnectDb;