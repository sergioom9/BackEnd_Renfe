export type UserType = {
    userid:string,
    name:string,
    email:string,
    password:string,
    coins:string
}

export type TicketType = {
    ticketid:string,
    origin:string,  
    destination:string,
    date:string,
    price:string,
    available:number
}


export type NewsType = {
    newid:string,
    title:string,
    image?:string
    content:string,
    date:string
}