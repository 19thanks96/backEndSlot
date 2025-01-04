const { neon } = require("@neondatabase/serverless");
const http = require("http");
const {PrismaClient} = require("@prisma/client");

 class Prisma {
    client
    #instance;


    static getInstance() {
        if (!Prisma.instance) {
            Prisma.instance = new Prisma();
        }
        return Prisma.instance;
    }

      async connect (){
         this.client = new PrismaClient();
         console.log('Новое подключение to prisma');
         const sql = neon(process.env.DATABASE_URL);

         const requestHandler = async (req, res) => {
             const result = await sql`SELECT version()`;
             const { version } = result[0];
             res.writeHead(200, { "Content-Type": "text/plain" });
             res.end(version);
         };

         http.createServer(requestHandler).listen(3000, () => {
             console.log("Server of prisma running at http://localhost:3000");
         });
    }


     createNewUser = async () => {
        // Create a new user
         if (!this.client) {
             const {PrismaClient} = require('@prisma/client');
             this.client = new PrismaClient();
         }


         return this.client.user.create({
            data: {
                balance: 1000,
                isAdmin: false,
                createdAt : new Date(),

                isVerified: false,
            },
        });
    }

    getUserById = async (id) => {

        return  await this.client.user.findFirst(
            {where: {id: id}},
        )
    }

    setBalance = async (id, balance) => {
        return  await this.client.user.update(
            {where: {id: id}, data: {balance: balance}},
        )
    }

    getReelsById = async (id) => {
        
        return  await this.client.allReels.findFirst(
            {where: {id: id}},
        )
    }

    walletChangeHandler = async (id, balance) => {
        const user = await this.client.user.update({
            where: {id: id},        // Specify the user by ID
            data: {
                balance: balance,
                updatedAt: new Date(),
            } // Update the balance
        });
    }

     handleCreateNewUser = async () => {
        console.log('handleCreateNewUser');
        return this.createNewUser()
            .catch(e => {
                console.log(e);
                throw e;
            })
            .finally(async () => {
                // await this.prisma.$disconnect();
            });
    }


}

module.exports = { Prisma };