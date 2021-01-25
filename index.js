require('dotenv').config();
const express    = require("express");
const bodyParser = require("body-parser");
const app        = express();
const mongoose   = require("mongoose");
const encrypt    = require("mongoose-encryption");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static(__dirname + "/dosyalar"));

mongoose.connect(process.env.BAGLANTI, {useNewUrlParser: true , useUnifiedTopology : true});
const Schema = mongoose.Schema;
const uyeSemasi = new mongoose.Schema ({
  email : String,
  sifre : String
});
const anahtar = "Techproeducation1234";
uyeSemasi.plugin(encrypt, {secret : anahtar, encryptedFields : ['sifre']} )
//Denemeler yapalim
console.log("anahtar");
console.log(process.env.ANAHTAR);

const Kullanici = new mongoose.model("Kullanici", uyeSemasi);
app.get("/", function(req, res){
  res.render("anasayfa");
});
app.get("/kayitol", function(req, res){
  res.render("kayitol");
});
app.post("/kayitol", function(req, res){
  console.log(req.body);
  const uye = new Kullanici({
    email : req.body.username,
    sifre : req.body.password
  });
  uye.save(function(err){
    if(err)
      console.log(err);
    else
      res.render("gizlisayfa");
  });
})
app.get("/giris", function(req, res){
  res.render("giris");
});
app.post("/girisyap", function(req, res){
  const emailGelen = req.body.username;
  const sifreGelen = req.body.password;
  Kullanici.findOne({email : emailGelen}, function(err, gelenVeri){
    if(err){
      console.log(err);
    }else{
      if(gelenVeri){ // gelen veri var mı
        if(gelenVeri.sifre == sifreGelen){
          res.render("gizlisayfa");
        }else{
          res.send("Şifre hatalı");
        }
      }else{
        res.send("Boyle bir kullanici yok! Dikkat et Kazim ne yazdigina...")
      }
    }
  });
})
app.listen(5500, function(){
  console.log("5500 port'a bağlandık.");
})
