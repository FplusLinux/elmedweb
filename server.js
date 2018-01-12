const http = require('http');
const fs = require('fs');
const Router = require('node-router');
const querystring = require('querystring');
const sql = require('mssql');
//const url = require('url');
const dateFormat = require('dateformat');
const configfile = require('./config.js');
console.log(configfile.ololo);

var router = Router();
router.push('POST','/api', getApi);
router.push('/api2', testApi);
router.push(getFile);
router.push(errorHandler);

var server = http.createServer(router).listen(80);

const config = configfile.config;

const pool = new sql.connect(config);

function getFile(req, res, next) {					//Роутер для загрузки файлов циклически по ссылкам
	if (req.path=='/'){req.path='/index.html';}
	var index = fs.readFileSync("./www"+req.path);
	var contentType = req.headers.accept.split(",");
	res.writeHead(200, {'Content-Type': contentType[0]});
	res.end(index);
}

function getApi(req, res, next) {					//Работа с API

	req.on('data', function(chunk){
		
		
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf8'});
		
		postOptions=querystring.parse(""+chunk);
		arg='';
		//console.log(postOptions.type);
		
		if (postOptions.type=="registryGetDoctors"){responseFunc = registryGetDoctors;}						//ПЕРЕДЕЛАТЬ!
		if (postOptions.type=="registryGetSheldule"){responseFunc = registryGetSheldule;arg=postOptions;}
		if (postOptions.type=="registryGetPatients"){responseFunc = registryGetPatients;}
		if (postOptions.type=="registryPatientAppointment"){responseFunc = registryPatientAppointment;arg=postOptions;}
		if (postOptions.type=="registryPatientDelete"){responseFunc = registryPatientDelete;arg=postOptions;}
		if (postOptions.type=="registryReserve"){responseFunc = registryReserve;arg=postOptions;}
		if (postOptions.type=="registryReserveDelete"){responseFunc = registryReserveDelete;arg=postOptions;}
		if (postOptions.type=="workplaceGetDoctors"){responseFunc = workplaceGetDoctors;}
		
		responseFunc(arg).then(function(e){res.end(JSON.stringify(e));});
		
	});
	
	
	req.on('done', function(){
		////sql.close();
	});
	
	
	async function registryGetDoctors() {					//Получение списка врачей для блока "Докторбокс" регистратуры
		try {
			//const pool = await sql.connect(config);
			//console.log(pool);
			let result = await sql.query`SELECT did, doctor, profilename, PRCOUNT AS profileid FROM (
			SELECT CAST(d.ID AS NVARCHAR(6)) AS did, FIO as doctor, p.PRNAME AS profilename, PROFIL_ID as profileid
			FROM [elmed_cat].[dbo].[Yamed_Spr_MedicalEmployee] d
			LEFT OUTER JOIN [elmed_cat].[dbo].[V002] p ON d.PROFIL_ID = p.Id) employees
			LEFT OUTER JOIN (SELECT [PROFIL_ID] AS PRID, ROW_NUMBER() OVER (ORDER BY [PROFIL_ID] ASC)-1 AS PRCOUNT FROM
			(SELECT DISTINCT [PROFIL_ID] FROM [elmed_cat].[dbo].[Yamed_Spr_MedicalEmployee]) profiles) profiles2 ON employees.profileid = profiles2.PRID`;
			//let test = await //sql.close();
			//console.log(test);
			
			var testdata = result.recordset;
			var testdata2 = 
			[{
				"text":"Все врачи",
				"expanded":true,
				"isSelected":true,
				"items":[]
			}];

			for (i=0;i<testdata.length;i++)		//Преобразование табличных данных спичка врачей в JSON для регистратуры
			{
				if (testdata[i].profileid==null){testdata[i].profileid=0;testdata[i].profilename="Без профиля";}
				testdata2[0].items[testdata[i].profileid]=(testdata2[0].items[testdata[i].profileid]==undefined)?{"text":testdata[i].profilename,"items":[]}:testdata2[0].items[testdata[i].profileid];
				testdata2[0].items[testdata[i].profileid].items[testdata2[0].items[testdata[i].profileid].items.length]={"text":testdata[i].doctor,"did":testdata[i].did+"d"};
			}
			
			return testdata2;
			
		} catch (err) {
			////sql.close();
			console.dir(err);
			//let test = await //sql.close();
			//console.log('!!!!!!!!!!'+JSON.stringify(test)+'!!!!!!!!!!');
		} finally {
			//sql.close().then(function(){console.log("00000000000000000000000000000000000000000000")});
		}
	}
	
	async function registryGetSheldule(data) {

		try {
			//const pool = await sql.connect(config);
			//console.log(pool);
			let begindate = dateFormat(data.date1, 'yyyymmdd');
			console.log('xxx '+JSON.stringify(data));
			console.log('zzz '+data.date1+' zzz');
			let enddate = (data.date2==0)?dateFormat(new Date(Date.parse(data.date1)+86400000), 'yyyymmdd'):dateFormat(new Date(Date.parse(data.date2)+86400000), 'yyyymmdd');
			
			let doctorsstr;
			if (typeof(data["doctors[]"])=='string') {doctorsstr = 'DID='+data["doctors[]"];} else {doctorsstr = 'DID='+data["doctors[]"].join(' OR DID=');}
			
			
			let result = await new sql.Request().query(`DECLARE @Date1 CHAR(20) = '${begindate}';
				DECLARE @Date2 CHAR(20) = '${enddate}';

				SELECT reg.ID, COUNTER, DID, DOCTOR, BeginTime, PID, Reserve, FAM, IM, OT FROM
				(SELECT ID, COUNTER, DID, DOCTOR, BeginTime, PID, Reserve FROM 
				(SELECT s.ID ,CONCAT(CONVERT(nvarchar(10), BeginTime, 120),'-',DID) AS C, DID, CONCAT(FAM,' ',IM,' ',OT) as DOCTOR, BeginTime, PID, Reserve FROM (SELECT *
					FROM [elmed_cat].[dbo].[YamedRegistry]) s
					LEFT OUTER JOIN [elmed_cat].[dbo].[Yamed_Spr_MedicalEmployee] sp ON s.DID=sp.ID WHERE BeginTime > CONVERT(datetime, @Date1, 120) AND BeginTime < CONVERT(datetime, @Date2, 120) AND (`+doctorsstr+`)) tt
					LEFT OUTER JOIN (SELECT ROW_NUMBER() OVER (ORDER BY [C] ASC)-1 as COUNTER, C FROM
				(SELECT DISTINCT CONCAT(CONVERT(nvarchar(10), BeginTime, 120),'-',DID) AS C FROM [elmed_cat].[dbo].[YamedRegistry] sl
					LEFT OUTER JOIN [elmed_cat].[dbo].[Yamed_Spr_MedicalEmployee] sp ON sl.DID=sp.ID WHERE BeginTime > CONVERT(datetime, @Date1, 120) AND BeginTime < CONVERT(datetime, @Date2, 120) AND (`+doctorsstr+`)) sd) ff
					ON tt.C=ff.C) reg
				LEFT OUTER JOIN (SELECT ID, FAM, IM, OT FROM [elmed_cat].[dbo].[PACIENT]) pac ON reg.PID=pac.ID`);
			//let test = await //sql.close();
			//console.log(test);
			
			let testdata = result.recordset;
			let rasp=[];
			
			for (i=0;i<testdata.length;i++){					//Преобразование табличных данных расписания врачей в JSON для регистратуры
				if (rasp[testdata[i].COUNTER]==undefined){rasp[testdata[i].COUNTER]=[{}];}
				rasp[testdata[i].COUNTER][0].html='<center><b>'+dateFormat(testdata[i].BeginTime, 'yyyy-mm-dd')+'</b><br>'+testdata[i].DOCTOR+'</center>';
				rasp[testdata[i].COUNTER][0].isExpanded=true;
				if (rasp[testdata[i].COUNTER][0].items==undefined){rasp[testdata[i].COUNTER][0].items=[];}
				if (rasp[testdata[i].COUNTER][0].items[dateFormat(testdata[i].BeginTime, 'HH')]==undefined){rasp[testdata[i].COUNTER][0].items[dateFormat(testdata[i].BeginTime, 'HH')]={};}
				rasp[testdata[i].COUNTER][0].items[dateFormat(testdata[i].BeginTime, 'HH')].text=dateFormat(testdata[i].BeginTime, 'HH')+':00';
				rasp[testdata[i].COUNTER][0].items[dateFormat(testdata[i].BeginTime, 'HH')].isExpanded=true;
				if (rasp[testdata[i].COUNTER][0].items[dateFormat(testdata[i].BeginTime, 'HH')].items==undefined){rasp[testdata[i].COUNTER][0].items[dateFormat(testdata[i].BeginTime, 'HH')].items=[]}
				let place=dateFormat(testdata[i].BeginTime, 'HH:MM')+' ';
				let isFree;
				if (testdata[i].PID!=null){place+='<pid>'+testdata[i].FAM+' '+testdata[i].IM+' '+testdata[i].OT+'</pid>';isFree=0;}else{if (testdata[i].Reserve==1){place+='<reserve>Резерв</reserve>';isFree=2;}else {place+='<free>Свободно</free>';isFree=1;}}
				rasp[testdata[i].COUNTER][0].items[dateFormat(testdata[i].BeginTime, 'HH')].items[rasp[testdata[i].COUNTER][0].items[dateFormat(testdata[i].BeginTime, 'HH')].items.length]={"html":place, "isFree":isFree, "prid":testdata[i].ID};
			}
			
  			for (i=0;i<rasp.length;i++){
				for (k=rasp[i][0].items.length;k>=0;k--){
					if (rasp[i][0].items[k]==null) {rasp[i][0].items.splice(k,1);}
				}
			}
			
			return rasp;
			
		} catch (err) {
			////sql.close();
			console.dir(err);
			//let test = await //sql.close();
			//console.log('!!!!!!!!!!'+JSON.stringify(test)+'!!!!!!!!!!');
		} finally {
			//sql.close();
		}
	}
	
	async function workplaceGetDoctors() {
		try {
			//const pool = await sql.connect(config);
			//console.log(pool);
			let result = await sql.query`SELECT CONCAT(FAM,' ',IM,' ',OT) as doctor FROM [elmed_cat].[dbo].[Yamed_Spr_MedicalEmployee]`;
			//let test = await //sql.close();
			//console.log(test);
			return result.recordset;
		} catch (err) {
			////sql.close();
			console.dir(err);
			//let test = await //sql.close();
			//console.log('!!!!!!!!!!'+JSON.stringify(test)+'!!!!!!!!!!');
		} finally {
			//sql.close();
		}
	}
	
	async function registryGetPatients() {
		try {
			//const pool = await sql.connect(config);
			//console.log(pool);
			let result = await sql.query`SELECT TOP (10000) ID, FAM, IM, OT, DR, NPOLIS FROM [elmed_cat].[dbo].[PACIENT]`;
			//let test = await //sql.close();
			//console.log(test);
			return result.recordset;
		} catch (err) {
			////sql.close();
			console.dir(err);
			//let test = await //sql.close();
			//console.log('!!!!!!!!!!'+JSON.stringify(test)+'!!!!!!!!!!');
		} finally {
			//sql.close();
		}
	}
	
	async function registryPatientAppointment(data) {
		try {
			//const pool = await sql.connect(config);
			//console.log(pool);
			let pid = data.pid;
			let prid = data.prid;
			//console.log(pid+' '+prid);
			//UPDATE [elmed_cat].[dbo].[YamedRegistry] SET PID=542639 WHERE ID=1111
			let result = await sql.query`UPDATE [elmed_cat].[dbo].[YamedRegistry] SET PID=${pid} WHERE ID=${prid} AND PID IS NULL`;
			//let test = await //sql.close();
			//console.log(test);
			//console.log(result.rowsAffected[0]);
			return result.rowsAffected[0];
		} catch (err) {
			////sql.close();
			console.dir(err);
			//let test = await //sql.close();
			//console.log('!!!!!!!!!!'+JSON.stringify(test)+'!!!!!!!!!!');
		} finally {
			//sql.close();
		}
	}
	
	async function registryPatientDelete(data) {
		try {
			//const pool = await sql.connect(config);
			//console.log(pool);
			let prid = data.prid;
			let result = await sql.query`UPDATE [elmed_cat].[dbo].[YamedRegistry] SET PID=NULL WHERE ID=${prid}`;
			//let test = await //sql.close();
			//console.log(test);
			return result.rowsAffected[0];
		} catch (err) {
			////sql.close();
			console.dir(err);
			//let test = await //sql.close();
			//console.log('!!!!!!!!!!'+JSON.stringify(test)+'!!!!!!!!!!');
		} finally {
			//sql.close();
		}
	}
	
	async function registryReserve(data) {
		try {
			//const pool = await sql.connect(config);
			//console.log(pool);
			let name = data.name;
			let contact = data.contact;
			let comment = data.comment;
			let prid = data.prid;
			let result = await sql.query`UPDATE [elmed_cat].[dbo].[YamedRegistry] SET PacientName=${name}, PacientContact=${contact}, PacientComent=${comment}, Reserve=1 WHERE ID=${prid} AND Reserve=0`;
			//let test = await //sql.close();
			//console.log(test);
			return result.rowsAffected[0];
		} catch (err) {
			////sql.close();
			console.dir(err);
			//let test = await //sql.close();
			//console.log('!!!!!!!!!!'+JSON.stringify(test)+'!!!!!!!!!!');
		} finally {
			//sql.close();
		}
	}
	
	async function registryReserveDelete(data) {
		try {
			//const pool = await sql.connect(config);
			//console.log(pool);
			let prid = data.prid;
			let result = await sql.query`UPDATE [elmed_cat].[dbo].[YamedRegistry] SET PacientName=NULL, PacientContact=NULL, PacientComent=NULL, Reserve=0 WHERE ID=${prid} AND Reserve=1`;
			//let test = await //sql.close();
			//console.log(test);
			return result.rowsAffected[0];
		} catch (err) {
			////sql.close();
			console.dir(err);
			//let test = await //sql.close();
			//console.log('!!!!!!!!!!'+JSON.stringify(test)+'!!!!!!!!!!');
		} finally {
			//sql.close();
		}
	}
	
}


function testApi(req, res, next) {
		
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf8'});
		
		testfn().then(function(e){res.end(JSON.stringify(e));});
		
		async function testfn() {
		try {
			//const pool = await sql.connect(config);
			
			let result = await pool.request()
            .query(`SELECT TOP (1000) DID, CONCAT(FAM,' ',IM,' ',OT) as DOCTOR, BeginTime, PID, Reserve FROM (SELECT * FROM [elmed_cat].[dbo].[YamedRegistry]) s 
			LEFT OUTER JOIN [elmed_cat].[dbo].[Yamed_Spr_MedicalEmployee] sp ON s.DID=sp.ID WHERE BeginTime > {d '2017-11-01'} AND BeginTime < {d '2017-12-31'}`)
			//let ololo='СЕМЕНОВ';
			//const result = await sql.query('SELECT TOP(1000) [FAM],[IM],[OT],[DR],[NPOLIS] FROM [elmed_cat].[dbo].[PACIENT]');
			//sql.close();
			
			var testdata = result.recordset;
			
			return testdata;
			
			} catch (err) {
			console.dir(err);
			}
		}
	
}



function errorHandler(err, req, res, next) {
	res.send(err);
}