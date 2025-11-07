LOGIN 

POST "/login" BODYJSON{email,password} 


REGISTER

POST "/register" BODYJSON{userid,name,email,password}


USER 

GET "/:userid"   COOKIE:bearer={}
GET "/tickets/:userid"     COOKIE:bearer={}
DELETE "/:userid"  COOKIE:bearer={}
PUT "/"   BODYJSON{userid,email,name,pasword}
(ADMIN) GET "/" 


TICKET

GET "/" 
GET "/:ticketid"   
POST "/sell"  BODYJSON{ticketid,userid}
(ADMIN) POST "/create"  BODYJSON{ticketid,origin,destination,date,price}
(ADMIN) PUT "/"   BODYJSON{origin,destination,date,price}
(ADMIN) DELETE "/:ticketid" 


NEWS

GET "/" 
GET "/:newid"   
(ADMIN) POST "/create"  BODYJSON{newid,image,title,content,date}
(ADMIN) PUT "/"   BODYJSON{origin,destination,date,price}
(ADMIN) DELETE "/:newid" 