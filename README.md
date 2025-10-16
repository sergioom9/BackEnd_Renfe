GET /user (Need Auth Header)

GET /user/:id 

GET /user/tickets/:userid

POST /login   body:{email,password}

POST /register  body:{userid,name,email,password}

GET /ticket  (Needs Auth Header)

GET /ticket/:id 

POST /ticket/create  body:{ticketid,origin,destination,date,price}

POST /ticket/sell    body:{ticketid,userid}

