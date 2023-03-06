
const { MongoClient, ServerApiVersion } = require('mongodb');
const express=require('express');
const cors=require('cors');
 const app=express();
 require('dotenv').config();
 const port=process.env.PORT || 5000;


//  middleware
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mjqzqbo.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
 try{
const categoryCollection=client.db('bookshop').collection('bookcategory');
const booksCollection=client.db('bookshop').collection('bookcollection');
const bookingCollection=client.db('bookshop').collection('bookingcollection');
app.get('/category',async(req,res)=>{
    const query={};
    const result=await categoryCollection.find(query).toArray();
    res.send(result)
})
app.get('/books/:id',async(req,res)=>{
    const id=req.params.id;
    const query={categoryId:id};
    const book=await booksCollection.find(query).toArray();
    res.send(book);
})
app.post('/bookings',async(req,res)=>{
    const bookings=req.body;
    // console.log(id)
    const query={
      name:bookings.bookname,
      email:bookings.email
    }
    const alreadyBooked=await bookingCollection.find(query).toArray();
    if(alreadyBooked.length){
        const message='You have already booked this';
        return res.send({acknowledge:false,message})
    }
    const result=await bookingCollection.insertOne(bookings);
    res.send(result);
})
 }
 
finally{

}

};
run().catch(error=>console.error(error))




app.get('/',async(req,res)=>{
    res.send('book shop server is running')
})
app.listen(port,async(req,res)=>{
    console.log(`book shop server is running on port ${port}`)
})