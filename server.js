require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');
var path = require('path');

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout: 'main', layoutsDir: __dirname +'/views/layouts/'}));
app.set('view engine','handlebars');
const router = express.Router();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use('/public',express.static(path.join(__dirname,'public')));

var port = process.env.PORT || 3000;

// app.get('/',function(request, response){
   // response.sendFile(path.join(__dirname,'/public/index.html'));
// });

app.post('/',function(req,res){
    console.log('User Data: ',req.body);
const output = `
<p>Hi ${req.body.Name}</p>
<p>We have received your message<p>
<p>Below is your message sent to us:<p>
<ul>
    <li>Name: ${req.body.Name} </li>
    <li>Email: ${req.body.Email} </li>
	<li>Subject: ${req.body.Subject} </li>
    <li>Message: ${req.body.Message} </li>
</ul>
<p>We will get back to you as soon as possible.</p>
<p> Regards</p>
ASLAN FACILITY MANAGEMENT (PTY)LTD TEAM
`;


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    service: 'gmail',
    auth: {
		// user: process.env.EMAIL, 
        // pass:  process.env.PASSWORD
        user: process.env.APPSETTING_EMAIL, 
        pass: process.env.APPSETTING_PASSWORD
    },
    tls:{
        rejectUnauthorized:false
    }
});

// send mail with defined transport object
//let info = await transporter.sendMail({
    let mailOptions = { 
    from: '"ASLAN FACILITY MANAGEMENT" <aslanfacilitymanagement@gmail.com>', 
    to: req.body.Email, // list of receivers
	bcc: '',
    subject: 'ENQUIRIES/COMPLAINS', 
    html: output	
};

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log(error);
    }
    else{
    console.log('Message sent:');
    //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
   // res.render('assessment',{msg:'Your form submited check your email'})
   }
});

  res.render('index',{Name:req.body.Name,
                        Surname:req.body.Surname,
                        Email:req.body.Email});

});

app.listen(port, function(){
    console.log('Server listening on port ' + port);
});
