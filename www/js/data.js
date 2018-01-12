var elmedMainmenuData = 		//Данные для создания пунктов главного меню 
{
	"items":
	[
		{
			"name":"Поликлиника",
			"icon":"user-md",
			"items":
			[
				{
					"name":"Рабочее место врача",
					"icon":"angle-right",
					"wlink":"Workplace"
				},
				{
					"name":"Регистратура",
					"icon":"angle-right",
					"wlink":"Registry"
				},
				{
					"name":"Направление",
					"icon":"angle-right",
					"wlink":"underConstruction"
				}
			]
		},
		{
			"name":"Стационар",
			"icon":"hospital-o",
			"items":
			[
				{
					"name":"Госпитализация",
					"icon":"angle-right",
					"wlink":"underConstruction"
				},
				{
					"name":"Приёмное отделение",
					"icon":"angle-right",
					"wlink":"underConstruction"
				}
			]
		},
		{
			"name":"Пункт со сылкой",
			"icon":"file-text-o",
			"wlink":"menulink6"
		}
	]	
};

var registryDoctorListData = JSON.parse($.ajax({type: "POST", url: "api", data:{"type":"registryGetDoctors"}, async: false}).responseText);

var registrySheldulesStorage = [];

var tabs = [];

var registryPatients = JSON.parse($.ajax({type: "POST", url: "api", data:{"type":"registryGetPatients"}, async: false}).responseText);

/*  var registryPatients = [
	{
		"FAM": "Иванов",
		"IM": "Иван",
		"OT": "Иванович",
		"DR": "10.10.2010",
		"NPOLIS":"4688389742000100"
	},
	{
		"FAM": "Сидоров",
		"IM": "Сидор",
		"OT": "Сидорович",
		"DR": "15.10.2011",
		"NPOLIS":"4688389742000100"
	},
	{
		"FAM": "Петров",
		"IM": "Петр",
		"OT": "Петрович",
		"DR": "21.10.2012",
		"NPOLIS":"4688389742000100"
	},
	{
		"FAM": "Витальев",
		"IM": "Виталий",
		"OT": "Витальевич",
		"DR": "30.10.2013",
		"NPOLIS":"4688389742000100"
	}
];  */

var workplaceDoctors = JSON.parse($.ajax({type: "POST", url: "api",data:{"type":"workplaceGetDoctors"}, async: false}).responseText);

var workplacePatientsData = [
	{
		"id":"1",
		"fio":"Иванов Иван Иванович",
		"age":"15",
		"priem":"Первичный приём",
		"date":"12 октября понедельник",
		"time":"10:10"
	},
	{
		"id":"2",
		"fio":"Иванов Иван Иванович",
		"age":"15",
		"priem":"Первичный приём",
		"date":"12 октября понедельник",
		"time":"10:10"
	},
	{
		"id":"3",
		"fio":"Иванов Иван Иванович",
		"age":"15",
		"priem":"Первичный приём",
		"date":"12 октября понедельник",
		"time":"10:10"
	},
	{
		"id":"3",
		"fio":"Иванов Иван Иванович",
		"age":"15",
		"priem":"Первичный приём",
		"date":"12 октября понедельник",
		"time":"10:10"
	},
	{
		"id":"3",
		"fio":"Иванов Иван Иванович",
		"age":"15",
		"priem":"Первичный приём",
		"date":"12 октября понедельник",
		"time":"10:10"
	},
	{
		"id":"3",
		"fio":"Иванов Иван Иванович",
		"age":"15",
		"priem":"Первичный приём",
		"date":"12 октября понедельник",
		"time":"10:10"
	},
	{
		"id":"3",
		"fio":"Иванов Иван Иванович",
		"age":"15",
		"priem":"Первичный приём",
		"date":"12 октября понедельник",
		"time":"10:10"
	}
];

var workplaceTilesData = 
[
	{
		"name":"Посещение",
		"icon":"street-view",
		"wlink":"Sluch"
	},
	{
		"name":"Направление",
		"icon":"hand-o-right",
		"wlink":"underConstruction"
	},
	{
		"name":"Платные услуги",
		"icon":"ruble",
		"wlink":"underConstruction"
	}
];

var workplaceFormdata = 
[
	{"pomosch":"", "datafield":"pomosch","caption":"Форма помощи","type":"dxSelectBox"},
	{"oplata":"", "datafield":"oplata","caption":"Способ оплаты МП","type":"dxSelectBox"},
	{"region":"", "datafield":"region","caption":"Региональный признак оплаты МП","type":"dxSelectBox"}
];

var workplaceForm2data = 
[
	{"ibnumber":"", "datafield":"ibnumber","caption":"№ Истории болезни","type":"dxTextBox"},
	{"dsperv":"", "datafield":"dsperv","caption":"Диагноз первичный","type":"dxTextBox"},
	{"ds":"", "datafield":"ds","caption":"Диагноз основной","type":"dxSelectBox"},
	{"dssop":"", "datafield":"dssop","caption":"Диагноз сопутствующего заболевания","type":"dxSelectBox"},
	{"dsosl":"", "datafield":"dsosl","caption":"Диагноз осложнений заболевания","type":"dxSelectBox"},
	{"tipsluch":"", "datafield":"tipsluch","caption":"Тип случая","type":"dxSelectBox"},
	{"nachlech":"", "datafield":"nachlech","caption":"Начало лечения","type":"dxSelectBox"},
	{"okonlech":"", "datafield":"okonlech","caption":"Окончание лечения","type":"dxSelectBox"},
	{"rez":"", "datafield":"rez","caption":"Результат ообращения/госпитализации","type":"dxSelectBox"},
	{"ish":"", "datafield":"ish","caption":"Исход заболевания","type":"dxSelectBox"}
];




