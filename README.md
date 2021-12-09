# crowdfunding-dapp
Decentralized web application for crowdfunding that utilizes the Ethereum Virtual Machine (EVM).

### Funding deployment
User submits and gets prompted for their email address -> 
    Submission gets added to redis ->
        Submission gets approved by mods ->
            Submission shows up in the user account so that the user can sign the final transaction. ->
                Submission gets removed from redis.