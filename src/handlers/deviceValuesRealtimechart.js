
const KeepAlive = require('./models/KeepAlive');
const mongoose = require('mongoose');
const utils = require("../utils");
const axios = require("axios");
const moment = require( 'moment-timezone' )

   
module.exports.handler = async (context, req) => {

    mongoose.connect(process.env['CosmosDBString'],  {
        useNewUrlParser:true
    })
        .then(db => context.log('DB connected successfully'))
        .catch(err => context.log(err))

   
        

       
        var conversor001 = []////FIT-6688
        var conversor002adc1 = []//Bomba Norte
        var conversor002adc2 = []//Bomba Sur
        var conversor003 = []//FIT-165
        var conversor004adc1= []//FIT-6708
        var conversor004adc2 = []//FIT-6698
        var m_labels = []
        var s=1
        var fechaact
        let perpage=Number(req.body.perpage)
        let page=Number(req.body.page)
        let fechadesde= req.body.fechadesde
        let fechahasta= req.body.fechahasta
        let conversor= req.body.conversor
        let  conversion= req.body.conversion

      //var keepAliveList = await KeepAlive.find().sort({ _id: -1 }).limit(1000)

      if(req.body=={}){
        conversor = "all-conversores"
        fechadesde=moment().subtract(1, "days").format();
        fechahasta=moment().toDate();
        fechaact=1

    }else{fechaact=0}

     if( fechadesde==''){
         fechadesde=moment().subtract(1, "days").format();
     }else{
        fechadesde=moment.utc(fechadesde).add(4, "hours").format('YYYY-MM-DDTHH:mm');
    }

     if( fechahasta==''){
             fechahasta=moment().toDate();
             fechaact=1
         }else{
                fechahasta=moment.utc(fechahasta).add(4, "hours").format('YYYY-MM-DDTHH:mm');
               
                fechaact=0 }

        if( conversor==undefined || conversor==''){

        
            conversor = "all-conversores"
            ////console.log("acaaaaaaaaaaaaa")
        }

        if( conversion==undefined || conversion==''){
            conversion = "m3/h"
            ////console.log("acaaaaaaaaaaaaa")
        }
        if (conversion=="m3/h"){s = 1}
        if (conversion=="lt/s"){s = 0.2777777}
        
     

      var textx;
      if (conversor=="all-conversores" || conversor === undefined){
  
          fechadesde=new Date(fechadesde)
         fechahasta=new Date(fechahasta)
          if(fechaact==1){
            //const  count1 = await KeepAlive.find().sort({ _id: -1 }).limit(1000).countDocuments();
            keepAliveList = await KeepAlive.find().sort({ _id: -1 }).skip(page*perpage).limit(perpage)
             
            keepAliveList .reverse();
               textx="Ultimos 1000 valores registrados"
              // keepAliveList = JSON.stringify(keepAliveList)
              // keepAliveList = JSON.parse(keepAliveList)
              //fechahasta=moment().toDate();
                  }else{
              //const  count1 = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)}}).sort({ _id: -1 }).limit(1000).countDocuments();
              var keepAliveList = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)}}).sort({ _id: -1 }).skip(page*perpage).limit(perpage)
              keepAliveList.reverse();
               textx="Desde :"+moment.utc(fechadesde).tz('America/Santiago').format('DD/MM/YYYY-HH:mm')+"- Hasta :"+moment.utc(fechahasta).tz('America/Santiago').format('DD/MM/YYYY-HH:mm')
                  
              }
          var dia=moment().subtract(1, "days").format();
         var dia1=moment().toDate();
         dia=new Date(dia)
         
         //console.log(fechadesde)
  
     
      // var keepAliveList = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)}}).sort({ _id: 1 })
  
       var conversor001 = []////FIT-6688
       var conversor002adc1 = []//Bomba Norte
       var conversor002adc2 = []//Bomba Sur
       var conversor003 = []//FIT-165
       var conversor004adc1= []//FIT-6708
       var conversor004adc2 = []//FIT-6698
       var m_labels = []
       //var textx = []
       var texty = []
   
  //      for (const item of keepAliveList) 
  //  {
  //      var fecha = item.created_at;
  //      fecha= moment.utc(fecha).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss');
  //          m_labels.push(fecha);      
  //      }
  
   for (const item of keepAliveList) 
   {
  
         
   
           if (item.valorcur<4){
              item.valorcur=4
          }
          var fecha4 = item.created_at;
          
          fecha4= moment.utc(fecha4).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
          m_labels.push(fecha4);  
          //const valorcurp4 = ((((item.valorcur)*m)-b)*s);
           //m_valor4.push({x:fecha4, y:valorcurp4});
   
  
       }
  
for (const item of  keepAliveList) 
   {
      var fecha = item.created_at;
      fecha= moment.utc(fecha).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
          
       var deviceid = item.device_id;
     
     if (deviceid =="conversor-001")////FIT-6688
         
         { 
          
          if (item.valorcur<4){
              item.valorcur=4
          }
  
          var fecha0 = item.created_at;
          fecha0= moment.utc(fecha0).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
           //////////formula"FIT-6688"//////////////
          // x1 = 4 
          // x2 = 20
          // y1 = 0 
          // y2 = 85
          // y = (m) x + b
          // m = 85-0/20-4 =85/16=5.3125 
          // b= 2400
          // y= 5.3125  * x - 21.25 
          ////////////////
          var m = 5.3125 
          var b = 21.25 
           const valorcurp0 = (((item.valorcur)*m)-b)*s;
           conversor001.push({x:fecha0, y:valorcurp0});
   
          }
  
        if (deviceid =="conversor-005-adc1")//Bomba Norte
          
         { 
          if (item.valorcur<4){
              item.valorcur=4
          }
          var fecha1 = item.created_at;
          fecha1= moment.utc(fecha1).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
              //////////formula"Bomba Norte"//////////////
          // x1 = 4 
          // x2 = 20
          // y1 = 0 
          // y2 = 405
          // y = (m) x + b
          // m = 405-0/20-4 =405/16=25.3125
          // b= 101.25 
          // y= 25.3125  * x - 101.25 
          ////////////////
          var m = 25.3125   
          var b = 101.25 
           const valorcurp1 = (((item.valorcur)*m)-b)*s;
           conversor002adc1.push({x:fecha1, y:valorcurp1});
   
          }
  
          if (deviceid =="conversor-005-adc2")//Bomba Sur
          
         { 
          if (item.valorcur<4){
              item.valorcur=4
          }
          var fecha2 = item.created_at;
        
          fecha2= moment.utc(fecha2).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
           //////////formula"Bomba Sur"//////////////
          // x1 = 4 
          // x2 = 20
          // y1 = 0 
          // y2 = 405
          // y = (m) x + b
          // m = 405-0/20-4 =405/16=25.3125
          // b= 101.25 
          // y= 25.3125  * x - 101.25 
          ////////////////
          var m = 25.3125   
          var b = 101.25 
           const valorcurp2 = (((item.valorcur)*m)-b)*s;
           conversor002adc2.push({x:fecha2, y:valorcurp2});
   
          }
  
          if (deviceid =="conversor-003")//FIT-165
         
         { 
          if (item.valorcur<4){
              item.valorcur=4
          }
          var fecha3 = item.created_at;
            
          fecha3= moment.utc(fecha3).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
          //////////formula"FIT-165"//////////////
          // x1 = 4 
          // x2 = 20
          // y1 = 0 
          // y2 = 300
          // y = (m) x + b
          // m = 300-0/20-4 =300/16=18.75
          // b= 75 
          // y= 18.75  * x - 75
          ////////////////
          var m = 18.75
          var b = 75 
           const valorcurp3 = ((((item.valorcur)*m)-b)*s);
           
           conversor003.push({x:fecha3, y:valorcurp3});
           ////console.log(m_valorcurmin)
   
          }
  
          if (deviceid =="conversor-004-adc1")//FIT-6708
         
         { 
          if (item.valorcur<4){
              item.valorcur=4
          }
          var fecha4 = item.created_at;
            
          fecha4= moment.utc(fecha4).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
          //////////formula"FIT-6708"//////////////
          // x1 = 4 
          // x2 = 20
          // y1 = 0 
          // y2 = 200
          // y = (m) x + b
          // m = 200-0/20-4 =200/16=12.5
          // b= 50
          // y= 12.5  * x - 50
          ////////////////
          var m = 12.5
          var b = 50 
           const valorcurp4 = ((((item.valorcur)*m)-b)*s);
           
           conversor004adc1.push({x:fecha4, y:valorcurp4});
           
           ////console.log(m_valorcurmin)
   
          }
          if (deviceid =="conversor-004-adc2")//FIT-6698
         
          { 
           if (item.valorcur<4){
               item.valorcur=4
           }
           var fecha5 = item.created_at;
             
           fecha5= moment.utc(fecha5).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss.SSS');
         //////////formula"FIT-6698"//////////////
          // x1 = 4 
          // x2 = 20
          // y1 = 0 
          // y2 = 200
          // y = (m) x + b
          // m = 200-0/20-4 =200/16=12.5
          // b= 50
          // y= 12.5  * x - 50
          ////////////////
          var m = 12.5
          var b = 50 
          const valorcurp5 = ((((item.valorcur)*m)-b)*s);
            
          conversor004adc2.push({x:fecha5, y:valorcurp5});
            
            
    
           }
  
       }
       

      let conversor001last=Object.keys(conversor001).length
      let conversor002adc1last=Object.keys(conversor002adc1).length
      let conversor002adc2last=Object.keys(conversor002adc2).length
      let conversor003last=Object.keys(conversor003).length
      let conversor004adc1last=Object.keys(conversor004adc1).length
      let conversor004adc2last=Object.keys(conversor004adc2).length
      
  
  
      if (conversor001last === 0){conversor001last="N/A";}else{
          
          conversor001last=conversor001[conversor001.length - 1].y
          if (conversor001last<4){
              conversor001last=4
          }
          conversor001last=(((conversor001last)*5.3125)-21.25)*1;
      }
      if (conversor002adc1last === 0){conversor002adc1last="N/A";}else{
          conversor002adc1last=conversor002adc1[conversor002adc1.length - 1].y
          if (conversor002adc1last<4){
              conversor002adc1last=4
          }
         // console.log(conversor002adc1[conversor002adc1.length - 1].x)
          conversor002adc1last=(((conversor002adc1last)*25.3125)-101.25)*1;}
  
      if (conversor002adc2last === 0){conversor002adc2last="N/A"}else{
          conversor002adc2last=conversor002adc2[conversor002adc2.length - 1].y
          if (conversor002adc2last<4){
              conversor002adc2last=4
          }
          conversor002adc2last=(((conversor002adc2last)*25.3125)-101.25)*1;}
  
      if (conversor003last === 0){conversor003last="N/A"}else{
          conversor003last=conversor003[conversor003.length - 1].y
          if (conversor003last<4){
              conversor003last=4
          }
          conversor003last=((((conversor003last)*18.75)-75)*1)}
  
      if (conversor004adc1last === 0){conversor004adc1last="N/A"}else{
          conversor004adc1last=conversor004adc1[conversor004adc1.length - 1].y
          if (conversor004adc1last<4){
              conversor004adc1last=4
          }
          conversor004adc1last=((((conversor004adc1last)*12.5)-50)*1)}
  
      if (conversor004adc2last === 0){conversor004adc2last="N/A"}else{
          conversor004adc2last=conversor004adc2[conversor004adc2.length - 1].y
          if (conversor004adc2last<4){
              conversor004adc2last=4
          }
          conversor004adc2last=((((conversor004adc2last)*12.5)-50)*1)}
  
       var valormax1 = {
   
           m_labels :m_labels,
           conversor001:conversor001,
           conversor002adc1:conversor002adc1,
           conversor002adc2: conversor002adc2,
           conversor003:conversor003,
           conversor004adc1:conversor004adc1,
           conversor004adc2:conversor004adc2,
           m_label1 : `Valor CUR (m3/h) = ${conversor001last} - Bba 903 - 907 retorno filtro disco TK-900(FIT6688)`,//conversor-001
           m_label2 : `Valor CUR (m3/h) = ${conversor002adc1last} - Bba. norte Alimentación TK-145 `,//conversor-005-adc1
           m_label3 : `Valor CUR (m3/h) = ${conversor002adc2last} - Bba. sur Alimentación TK-145 `,//conversor-005-adc2
           m_label4 : `Valor-CUR (m3/h) = ${conversor003last} - Bba. 802 alimentación TK-730 (Lixiviación). (FIT-1065)`,//conversor-003
           m_label5 : `Valor CUR (m3/h)= ${conversor004adc1last} - Bba. 608 alimentaciónTK-118  (FIT-6708)`,//conversor-004-adc1
           m_label6 : `Valor CUR (m3/h)= ${conversor004adc2last} - Bba. 612 alimentaciónTK-118 (FIT-6698)`,//conversor-004-adc2
           color1:'rgb(46, 134, 193 )',
           color2:'rgb(212, 172, 13 )',
           color3:'rgb(205, 92, 92)',
           color4:'rgb(0,128,0)',
           color5:'rgb(128,0,128)',
           color6:'rgb(128,0,0)',
           texty    : conversor+"-"+conversion,
           textx    : textx,
               
       }
       
       
   
   }else{
      fechadesde=new Date(fechadesde)
      fechahasta=new Date(fechahasta)
      if(fechaact==1){
          var keepAliveList = await KeepAlive.find({ device_id: conversor }).sort({ _id: -1 }).skip(page*perpage).limit(perpage)
          keepAliveList.reverse();
           textx="Ultimos 100 valores registrados"
          // keepAliveList = JSON.stringify(keepAliveList)
          // keepAliveList = JSON.parse(keepAliveList)
          //fechahasta=moment().toDate();
              }else{
                  var keepAliveList = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)},device_id: conversor }).sort({ _id: -1 }).skip(page*perpage).limit(perpage)
           textx="Desde :"+moment.utc(fechadesde).tz('America/Santiago').format('DD/MM/YYYY-HH:mm')+"- Hasta :"+moment.utc(fechahasta).tz('America/Santiago').format('DD/MM/YYYY-HH:mm')
           keepAliveList.reverse();
              }
     // var keepAliveList = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)},device_id: conversor }).sort({ _id: -1 })
   
       //keepAliveList.reverse();
       keepAliveList = JSON.stringify(keepAliveList)
       keepAliveList = JSON.parse(keepAliveList)
   
   
       var m_valoravg = []
       var m_valorcur = []
       var m_valorcurmax = []
       var m_valorcurmin = []
       var m_labels = []
       var textx  
       var texty = []
   
   for (const item of keepAliveList) 
   {
       var fecha1 = item.created_at;
       var deviceid = item.device_id;
       ////console.log(fecha1)
       fecha1= moment.utc(fecha1).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss');
     
       if (item.valorcur<4){
          item.valorcur=4
      }
  
          if(conversor=="conversor-001"){
          var m = 5.3125 
          var b = 21.25  }
          if(conversor=="conversor-005-adc1"){
          var m = 25.3125 
          var b = 101.25}
          if(conversor=="conversor-005-adc2"){
          var m = 25.3125 
          var b = 101.25;}
          if(conversor=="conversor-003"){
          var m = 18.75
          var b = 75 }
          if(conversor=="conversor-004-adc1"){
          var m = 12.5
          var b = 50 }
          if(conversor=="conversor-004-adc2"){
          var m = 12.5
          var b = 50 }
  
           const valoravgp = (((item.valoravg)*m)-b)*s;
           m_valoravg.push({x:fecha1, y:valoravgp});
   
           const valorcurp = (((item.valorcur)*m)-b)*s;
           m_valorcur.push({x:fecha1, y:valorcurp});
   
           const valorcurmaxp = (((item.valorcurmax)*m)-b)*s;
           m_valorcurmax.push({x:fecha1, y:valorcurmaxp});
       
           const valorcurminp = (((item.valorcurmin)*m)-b)*s;
           m_valorcurmin.push({x:fecha1, y:valorcurminp});        
   
           m_labels.push(fecha1);
           
       }
   
     
      if(conversor=="conversor-001"){var conversorr= "Bba 903 - 907 retorno filtro disco TK-900(FIT6688)";}
      if(conversor=="conversor-005-adc1"){var conversorr= "Bba. norte Alimentación TK-145";}
      if(conversor=="conversor-005-adc2"){var conversorr= "Bba. sur Alimentación TK-145";}
      if(conversor=="conversor-003"){var conversorr= "Bba. 802 alimentación TK-730 (Lixiviación). (FIT-1065)";}
      if(conversor=="conversor-004-adc1"){var conversorr= "Bba. 608 alimentaciónTK-118 (FIT-6708)";}
      if(conversor=="conversor-004-adc2"){var conversorr= "Bba. 612 alimentaciónTK-118 (FIT-6698)";}
          
       var valormax1= {
   
           
          conversor001:[],
          conversor002adc1:m_valorcur,
          conversor002adc2: [],
          conversor003:[],
          conversor004adc1:[],
          conversor004adc2:[],
           m_labels :m_labels,
           m_label1 : [],
           m_label2 : conversorr,
           m_label3 : [],
           m_label4 : [],
           m_label5 : [],
           m_label6 : [],
           color1:"white",
           color2:'rgb(46, 134, 193 )',
           color3:"white",
           color4:"white",
           color5:"white",
           color6:"white",
           texty    : conversorr+"-"+conversion,
           textx    : textx
             
   
       }
   }






           context.res = {
            status: 200,
            body: valormax1
          };
        
       
        }
        

    
  
  
