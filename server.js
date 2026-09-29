
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override')
const {MongoStore} = require("connect-mongo");
const connectToDB = require('./db.js')
const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])


const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");


const authController = require("./routes/auth.routes.js");
const indexController = require("./routes/index.routes.js");
const departmentRoutes=require('./routes/department.routes.js')
const doctorRoutes=require('./routes/doctor.routes.js')
const adminRoutes=require('./routes/admin.routes.js')
const appointmentRoutes=require('./routes/appointment.routes.js')



app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use(passUserToView)






app.use('/auth',authController)
app.use('/',indexController)
app.use('/departments',departmentRoutes)
app.use('/doctor',doctorRoutes)
app.use('/admin',adminRoutes)
app.use('/appointment',appointmentRoutes)
app.use((req,res)=>{
    res.status(404).render('404.ejs')
})

async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();