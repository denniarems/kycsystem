# D.I SYSTEM
> Decentralized Identity Verification Platform By Police
### Description

> We use hyperledger sawtooth for building this project . its a identity system which uses decentralised mechanism . Its similar to the working or how we use aadhar in public scenerios . its mainly focus on the security of every persons personal details which cannot access by others without their permission . Only person who was accepeted by police can get their verified public key .

> By implementing this project , there is no need to carry an hardcopy of idenitfication cards for various purposes , only need the public key which is verified by police and users encryption key


> The existing Kyc system is not secure enough , hackers even get personal data and they try to sell to others . Using blockchain technology we can solve this issue . The data about each persons added to the block which cannot be altered. Its really take lots of times when we reapply aadhar or voter id even if loss , or it maybe damaged .In current scenario paper based works are exists like for aadhar , voter id card what if they were damaged or even loss , By implementing this project all personal data are secured through blockhain technology and there is no need to carry identification cards to various office’s for various purposes only the public key and encryption key is needed so the transparency becomes more .The details only we want to share should be able to see to others. Mainly the details like address , aadhar number and voter id no are in encrypted format to ensure more security. Using blockchain incase of identifications data of peoples we can ensure more security and which is also reliable .The data should not be loss  from the blockchain. 


### INSTRUCTIONS FOR SETTING-UP  APPLICATION Requirements:
    - [X] OS: Ubuntu 18.04 (Recommented)
    - [X] NodeJs version 8.0 stable npm latest
    - [X] Docker

### Steps:
    1.Clone & Navigate into main directory
    2.Run "sudo docker-compose up"
    3.Open Browser & navigate LocalHost- http://localhost:3000 or Ip Address- http://127.0.0.1:3000


### Video Demonstration
 https://drive.google.com/open?id=1ZneSo-9Mj1ERQ5j5XXEwM6lLOfy8wBTh

> There are three clients in this application

    • User
       1. View Data
       2. Change Enc Key 
       3. Add Or Edit Data
    • Police
       1. View Unveried Users
       2. Approve them By giving a Verify Tag
       3. Delete the from chain by Reject Them
    • Client
       1. Only A verifed User can Login
       2. Check User by their Public Key
