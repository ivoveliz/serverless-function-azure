
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

      console.log(req.body)
 
      var s=1
      var fechaact
      let perpage=Number(req.body.perpage)
      let page=Number(req.body.page)
      let fechadesde= req.body.fechadesde
      let fechahasta= req.body.fechahasta
      let conversor= req.body.conversor
      let  conversion= req.body.conversion
      let  countfront= req.body.countfront
      let  count 
        console.log(countfront)
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
      
  
       ////console.log(fechadesde,fechahasta)
       fechadesde=new Date(fechadesde)
       fechahasta=new Date(fechahasta)

      
       //console.log("fecha 1 dia")
       //console.log(fechadesde)
      

       var m_valoravg = []
       var m_valorcur = []
       var m_valorcurmax = []
       var m_valorcurmin = []
       var m_labels = []
       var textx = []
       var texty = []
       var data = []
       ////console.log(keepAliveList)
   
       
       if (conversor=="all-conversores" || conversor === "nada"){

        if (conversion=="m3/h"){

            s = 1
    
          }
          if (conversion=="lt/s"){
    
              s = 0.2777777
    
            }
       ////console.log(fechadesde,fechahasta)
       fechadesde=new Date(fechadesde)
       fechahasta=new Date(fechahasta)

       if(fechaact==1){
        count = 1000
        console.log("mil",count)
        var keepAliveList = await KeepAlive.find().sort({ _id: -1 }).skip(page*perpage).limit(perpage)
         
        //fechahasta=moment().toDate();
            }else{

        if (page==0 && countfront==0){
          count = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)}}).sort({ _id: -1 }).countDocuments();
          console.log("fechas",count)
        }else{

            count = countfront
        

        }

        var keepAliveList = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)}}).sort({ _id: -1 }).skip(page*perpage).limit(perpage)
         
            }
  
       //console.log("fecha 1 dia")
       //console.log(fechadesde)
      

       var m_valoravg = []
       var m_valorcur = []
       var m_valorcurmax = []
       var m_valorcurmin = []
       var m_labels = []
       var textx = []
       var texty = []
       var data = []
       ////console.log(keepAliveList)
   
   for (const item of keepAliveList) 
   {
       var fecha1 = item.created_at;
       var deviceid = item.device_id;
       ////console.log(fecha1)
       //fecha1= moment.utc(fecha1).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss');
       var deviceid = item.device_id;
   
   if (deviceid =="conversor-001")////FIT-6688
       
       { 
        var valorma=item.valorcur;
        
        if (item.valorcur<4){
            item.valorcur=4
        }
        var fecha1 = item.created_at;
        var devicer= "FIT-6688";
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
         const valorcurp = (((item.valorcur)*m)-b).toFixed(2);
         data.push({valorcurp,fecha1,devicer});
         //data.push({valorma,valorcurp,fecha1,devicer});

        }

      if (deviceid =="conversor-005-adc1")//Bomba Norte
        
       { 
        var valorma=item.valorcur;

        if (item.valorcur<4){
            item.valorcur=4
        }
        var fecha1 = item.created_at;
        var devicer= "Bomba Norte";
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
         const valorcurp = (((item.valorcur)*m)-b).toFixed(2);
        data.push({valorcurp,fecha1,devicer});
        //data.push({valorma,valorcurp,fecha1,devicer});
 
        }

        if (deviceid =="conversor-005-adc2")//Bomba Sur
        
       { 
        var valorma=item.valorcur;
        if (item.valorcur<4){
            item.valorcur=4
        }
        var fecha1 = item.created_at;
        var devicer= "Bomba Sur";
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
         const valorcurp = (((item.valorcur)*m)-b).toFixed(2);
        data.push({valorcurp,fecha1,devicer});
        //data.push({valorma,valorcurp,fecha1,devicer});
 
        }

        if (deviceid =="conversor-003")//FIT-165
       { 
        var valorma=item.valorcur;
        if (item.valorcur<4){
            item.valorcur=4
        }
        var fecha1 = item.created_at;
        var devicer= "FIT-165";
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
         const valorcurp = (((item.valorcur)*m)-b).toFixed(2);
         data.push({valorcurp,fecha1,devicer});
        //data.push({valorma,valorcurp,fecha1,devicer});
 
        }

        if (deviceid =="conversor-004-adc1")//FIT-6708
       { 
        var valorma=item.valorcur;
        if (item.valorcur<4){
            item.valorcur=4
        }
        var fecha1 = item.created_at;
        var devicer= "FIT-6708";
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
         const valorcurp = (((item.valorcur)*m)-b).toFixed(2);
         
         data.push({valorcurp,fecha1,devicer});
         //data.push({valorma,valorcurp,fecha1,devicer});
 
        }
        if (deviceid =="conversor-004-adc2")//FIT-6698
        { 
        var valorma=item.valorcur;
         if (item.valorcur<4){
             item.valorcur=4
         }
         var fecha1 = item.created_at;
         var devicer= "FIT-6698";
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
          const valorcurp = (((item.valorcur)*m)-b).toFixed(2);
          
          data.push({valorcurp,fecha1,devicer});
         //data.push({valorma,valorcurp,fecha1,devicer});
  
         }
           
       }
   
   
       var datomax= {
   
     
        recordsTotal: count,
       recordsFiltered:count,
           data
         
       }

    }else{
        if(fechaact==1){

            fechahasta=moment().toDate();
                }

        //var fechadesde1=fechadesde
       fechadesde=new Date(fechadesde)
       fechahasta=new Date(fechahasta)

       if(fechaact==1){
        count = 1000
          //count = await KeepAlive.find({ device_id: conversor }).sort({ _id: -1 }).skip(page*perpage).limit(perpage).countDocuments();
          console.log("dispisitivo",count)
        var keepAliveList = await KeepAlive.find({ device_id: conversor }).sort({ _id: -1 }).skip(page*perpage).limit(perpage)
        //keepAliveList.reverse();
        // textx="Ultimos 100 valores registrados"
        // keepAliveList = JSON.stringify(keepAliveList)
        // keepAliveList = JSON.parse(keepAliveList)
        //fechahasta=moment().toDate();
            }else{

                if (page==0 && countfront==0){
                    count = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)},device_id: conversor }).sort({ _id: -1 }).countDocuments();
                    console.log("dispisitivofecha",count)
                  }else{
          
                      count = countfront
                  
          
                  }
                 
                  
                var keepAliveList = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)},device_id: conversor }).sort({ _id: -1 }).skip(page*perpage).limit(perpage)
         //textx="Desde :"+moment.utc(fechadesde).tz('America/Santiago').format('DD/MM/YYYY-HH:mm')+"- Hasta :"+moment.utc(fechahasta).tz('America/Santiago').format('DD/MM/YYYY-HH:mm')
            }
       
        
        //var keepAliveList = await KeepAlive.find({created_at:{ "$gte": new Date(fechadesde), "$lt": new Date(fechahasta)},device_id: conversor }).sort({ _id: -1 })
        
        ////console.log(fechadesde)
        var m_labels = []
        var data = []
        //////console.log(conversor)
    
    for (const item of keepAliveList) 
    {
        var fecha1 = item.created_at;
        var deviceid = item.device_id;
        ////console.log(fecha1)
        //fecha1= moment.utc(fecha1).tz('America/Santiago').format('DD/MM/YYYY-HH:mm:ss');
        if(deviceid=="conversor-001")
        {
        var devicer= "FIT-6688";
        ///////////formula"FIT-6688"//////////////
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
             }
 
         if(deviceid=="conversor-005-adc1")
        {
            var devicer= "Bomba Norte";
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
         }
         if(deviceid=="conversor-005-adc2")
        {
            var devicer= "Bomba Sur";
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
             }
         if(deviceid=="conversor-003")
        {
            var devicer= "FIT-165";
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
             }
         if(deviceid=="conversor-004-adc1")
        {
            var devicer= "FIT-6708";
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
             }

             if(deviceid=="conversor-004-adc2")
        {
            var devicer= "FIT-6698";
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
             }
             var valorma=item.valorcur;
     
            if (item.valorcur<4){
                item.valorcur=4
            }
            const valorcurp = (((item.valorcur)*m)-b).toFixed(2);
            data.push({valorcurp,fecha1,devicer});
            //data.push({valorma,valorcurp,fecha1,devicer});
            if (item.valorcurmax<4){
                item.valorcurmax=4
            }
           
            m_labels.push(fecha1);
            
        }
      
        var datomax= {
             
            recordsTotal: count,
           recordsFiltered:count,
            
            data
          
        }
    }
      
     

        context.res = {
            status: 200,
            body: datomax
          };
    }

          
        
       
    
        

    
  
  
