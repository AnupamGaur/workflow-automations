import { PrismaClient } from "@prisma/client";
const Client = new PrismaClient();

async function main(){
  await Client.availableActions.create({
    data: {
     id: "webhook",
     name: "webhook",
      // image:"https://seeklogo.com/images/W/webhook-logo-CEEEFDB65E-seeklogo.com.png"
  }
}
)

  await Client.availableTriggers.create({
    data:{
      id:"send-sol",
      name:"Send SOL",
      // image:"https://cryptocurrencyjobs.co/startups/assets/logos/solana_hu7832672485539264587.jpg"
    }
  })
}

main();