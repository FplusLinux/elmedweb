// Подключение Globalize(библиотека для локализации компонентов Devextreme)
$.when(
	$.getJSON("lib/DevExpress/js/cldr/main/ru/ca-gregorian.json"),
	$.getJSON("lib/DevExpress/js/cldr/main/ru/numbers.json"),
	$.getJSON("lib/DevExpress/js/cldr/main/ru/currencies.json"),
	$.getJSON("lib/DevExpress/js/cldr/supplemental/likelySubtags.json"),
	$.getJSON("lib/DevExpress/js/cldr/supplemental/timeData.json"),
	$.getJSON("lib/DevExpress/js/cldr/supplemental/weekData.json"),
	$.getJSON("lib/DevExpress/js/cldr/supplemental/currencyData.json"),
	$.getJSON("lib/DevExpress/js/cldr/supplemental/numberingSystems.json")
).then(function () {
	//The following code converts the got results into an array
	return [].slice.apply( arguments, [0] ).map(function( result ) {
		return result[ 0 ];
	});
}).then(
	Globalize.load //loads data held in each array item to Globalize
).then(function(){
	Globalize.locale(navigator.language || navigator.browserLanguage);
	elmedComponentsLoad();
});
///////////////////////////////////////////////////////////////////////////

function elmedComponentsLoad(){

	elmedWorkspaceDraw("Welcome");			//Загрузка стартового экрана 

	//Создание меню
	$(".elmedMainmenuButton").click(function(){						//Создание события по клику на кнопке меню
		$(".elmedMainmenu").fadeToggle(250);
		$(".elmedMainmenuInactivator").fadeToggle(250);
		$(".elmedWorkspace").toggleClass("blur");
	});
	
	$(".elmedMainmenuInactivator").click(function(){		//Скрытие меню при клике вне его
		$(".elmedMainmenu").fadeToggle(250);
		$(".elmedMainmenuInactivator").fadeToggle(250);
		$(".elmedWorkspace").toggleClass("blur");
	});
	
	function elmedDrawMainmenu(initialVar, initialBlock)		//Функция рекурсивной отрисовки меню
	{
		if (typeof initialVar.items !== 'undefined')
		{
			for (i = 0; i < initialVar.items.length; i++)
			{
				$("<div class='"+initialBlock+i+"'><span><i class='fa fa-"+initialVar.items[i].icon+" fa-fw fa-lg'></i>&nbsp "+initialVar.items[i].name+"</span></div>").appendTo($("."+initialBlock)); //Создаём вложенные пункты

				if (initialVar.items[i].wlink) //Навешиваем события по клику на пункте меню
				{
					$("."+initialBlock+i+" span").click(initialVar.items[i].wlink,function(e){elmedWorkspaceDraw(e.data);});
				}
				else //Навешиваем раскрытие на пункты, содержащие подпункты
				{
					$("."+initialBlock+i+" span").click(initialBlock+i,function(e){$("."+e.data+" div").slideToggle(250); elmedNormalizeMainmenu();});
				}
				//elmedDrawMainmenu(initialVar.items[i], initialBlock+i);
				setTimeout(elmedDrawMainmenu, 1,initialVar.items[i],initialBlock+i); 
			}
		}
	}
	elmedDrawMainmenu(elmedMainmenuData, "elmedMainmenuItems"); //Запуск функции отрисовки меню
	
 	$(".elmedMainmenu, .elmedMainmenuInactivator").on("wheel",function(event){				//Функция прокрутки главного меню
		if ($(".elmedLogo").height()+40+$(".elmedMainmenuItems").height()>$(window).height()-$(".elmedButtons").height())
		{
			if ((event.originalEvent.deltaY || event.originalEvent.detail || event.originalEvent.wheelDelta)>0) 	//если крутим вниз
			{
				if ($(".elmedMainmenu").height()<$(".elmedLogo").height()+40+$(".elmedMainmenuItems").height())
				{
					$(".elmedMainmenu").css("top",Number($(".elmedMainmenu").css("top").substring(0,$(".elmedMainmenu").css("top").length-2))-30+"px");
					$(".elmedMainmenu").css("height",Number($(".elmedMainmenu").css("height").substring(0,$(".elmedMainmenu").css("height").length-2))+30+"px");
				}
			}
			else						//если крутим вверх
			{
				if (Number($(".elmedMainmenu").css("top").substring(0,$(".elmedMainmenu").css("top").length-2))<0)
				{
					$(".elmedMainmenu").css("top",Number($(".elmedMainmenu").css("top").substring(0,$(".elmedMainmenu").css("top").length-2))+30+"px");
					$(".elmedMainmenu").css("height",Number($(".elmedMainmenu").css("height").substring(0,$(".elmedMainmenu").css("height").length-2))-30+"px");
				}
			}
		}
	});

	$(window).resize(function(){elmedNormalizeMainmenu();});
	
	function elmedNormalizeMainmenu() //Функция нормализации меню при изменении размеров окна
	{
		$(".elmedMainmenu").css("top","0px");
		$(".elmedMainmenu").css("height","calc(100% - 46px)");
	}
	/////////////////////////////////////////// Всё что касается меню закончилось
	
	
	function underConstruction()
	{
		$("body").append("<div class='underConstruction' style='width:800px; height:350px; position:absolute; top:calc(50% - 255px); left:calc(50% - 425px);background:white;border:5px solid #0078d7;z-index:9999;font-size:200%;text-align:center;padding:70px 20px 20px 20px;color:rgba(0,0,0,0.8);border-radius:20px;'><i class='fa fa-cogs fa-5x'></i><br><br>Функция в разработке. Приносим извинения за доставленные неудобства.<div style='position:absolute;top:10px;right:10px;font-size:50%;color:black;background:rgba(0,0,0,0.2);border-radius:8px;padding:5px 10px;' onclick='$(\".underConstruction\").remove();'>Закрыть</div></div>");
	}
	
	
	function elmedWorkspaceDraw(workspace)		//Функция отрисовки рабочей области
	{
		$(".elmedButtons .elmedButton ~ div").remove();			//чистим кнопки снизу
		$(".elmedMainmenuInactivator").click();			//Скрываем меню
		switch (workspace)
		{
			case "Welcome":
				$(".elmedWorkspace").load("tmpl/Welcome.html");
			break;
			case "Workplace":
				$(".elmedWorkspace").load("tmpl/Workplace.html",workplaceComponentsLoad);
			break;
			case "Registry":
				$(".elmedWorkspace").load("tmpl/Registry.html",registryComponentsLoad);
				elmedButtonsDraw("Генератор расписания", "calendar", function(a){underConstruction(a);}, "Тут будет функция этой кнопки");
				elmedButtonsDraw("Модель расписания", "pencil-square-o", function(a){underConstruction(a);}, "Тут будет функция этой кнопки");
				elmedButtonsDraw("Медицинский персонал", "id-card-o", function(a){underConstruction(a);}, "Тут будет функция этой кнопки");
			break;
			default:
				underConstruction();
		}
	}
	
	function elmedButtonsDraw(name, icon, func, arg)		//Функция отрисовки кнопок в нижней панели
	{
		$("<div class='elmedButton' id='elmedButton"+$(".elmedButtons div").length+"'><i class='fa fa-"+icon+"'></i> "+name+"</div>").appendTo(".elmedButtons");		//Рисуем кнопку
		$("#elmedButton"+($(".elmedButtons div").length-1)).click({a:func,b:arg}, function(e){e.data.a(e.data.b);});		// Навешиваем функцию по клику
	}
	
	///////////////////////////////////////////////////////////////////////////
	
	function registryComponentsLoad()			//Функция загрузки компонентов регистратуры
	{
		//Объявление всплывающего окна для регистрации пациента
		$("#registryPopup").dxPopup({
			title: "Регистрация пациента"
		});
		
		//Объявление всплывающего окна для резерва времени
		$("#registryReservePopup").dxPopup({
			title: "Резервирование времени",
			width: "450px",
			height: "320px"
		});	
	
		//Модуль календаря
		var registryCalendarFrom = $(".registryCalendarFrom").dxCalendar({
			value: new Date(),
			disabled: false,
			firstDayOfWeek: 1,
			zoomLevel: "month",
			onValueChanged: function(data) {
				let newdate = new Date(0);
				newdate.setFullYear(data.value.getFullYear(),data.value.getMonth(),data.value.getDate()+1);
				registryCalendarTo.option("min", newdate);
				if (registryCalendarTo.option("value")<=data.value) {registryCalendarTo.option("value", newdate);}
			},
		}).dxCalendar("instance");
		
		//Чекбокс для активации второго календаря
		var registryCalendarCheckbox = $(".registryCalendarCheckbox").dxCheckBox({
			value: false,
			width:"22px",
			onValueChanged: function(data) {
			registryCalendarTo.option("disabled", !data.value);
			}
		}).dxCheckBox("instance");
		
		//Второй календарь
		var registryCalendarTo = $(".registryCalendarTo").dxDateBox({
			value: new Date(Date.parse(new Date())+86400000),
			disabled:true,
			type: "date",
			width:"100%",
			min: new Date(Date.parse(new Date())+86400000),
		}).dxDateBox("instance");
		
		//Модуль списка врачей с тестовыми данными
		var registryDoctorList = $(".registryDoctors").dxTreeView({
			items: registryDoctorListData,
			displayExpr:"text",
			keyExpr:"did",
			showCheckBoxesMode: "normal",
			selectedExpr: "isSelected"
		}).dxTreeView("instance");
		//Костыль для исправления бага со скроллом
		registryDoctorList.repaint();
		
		//Кнопка отрисовки расписания и вкладок
		$(".registryGenerateButton").on("click",function(){
			let doctors = getDoctorsVariable();
			if (doctors.length>0 && doctors!=''){
			let	registryDrawArgument1={
					"date1":registryCalendarFrom.option("value"),
					"date2":(registryCalendarCheckbox.option("value"))?registryCalendarTo.option("value"):0,
					"doctors":doctors,
					"id":0
				};
				
				//Добавление вкладки
				let tabDate = (registryCalendarCheckbox.option('value'))?registryCalendarFrom.option('value').toISOString().substr(0,10)+'<br>'+registryCalendarTo.option('value').toISOString().substr(0,10):registryCalendarFrom.option('value').toISOString().substr(0,10);
				let tabString;

				function findDoctorname(str){			//Поиск ФИО врача по did, желательно бы переделать
					for (k=0;k<registryDoctorListData[0].items.length;k++){
						for (p=0;p<registryDoctorListData[0].items[k].items.length;p++){
							if (''+registryDoctorListData[0].items[k].items[p].did==str+'d'){
								return registryDoctorListData[0].items[k].items[p].text
							}
						}
					}
				}
				
				function checkDoctorProfile(){			//Проверка, выделен ли единственный профиль
					let n=0;
					let k=0;
					for (i=0;i<registryDoctorListData[0].items.length;i++) {
						if (registryDoctorListData[0].items[i].isSelected){k=i;n++;}
					}
					if (n==1){
						let n1=0;
						for (p=0;p<registryDoctorListData[0].items[k].items.length;p++){
							if (registryDoctorListData[0].items[k].items[p].isSelected){n1++;}
						}
						if (registryDoctorListData[0].items[k].items.length==n1){return registryDoctorListData[0].items[k].text} else {return 0}
					}
				}
				
				if (registryDoctorListData[0].isSelected) {		//Проверка, выделены ли все врачи
					tabString = "Все Профили";
				} else {
					let oneProfile = checkDoctorProfile();
					if (oneProfile) {
						tabString = oneProfile;
					} else {
						if (doctors.length==1 && doctors!='') {tabString = findDoctorname(doctors[0]);} else {tabString = '***';}
					}
				}
				
				tabs[tabs.length]={"id":(tabs.length)?tabs[tabs.length-1].id+1:1,"text":tabDate,"profiles":tabString};
				registryTabs.refresh();
				//Добавление вкладки закончилось
				registryShelduleDraw(registryDrawArgument1); 			//Первичная отрисовка расписания 
			} else {DevExpress.ui.notify("Ни одного врача не выбрано.","error");}
		});
		
		//Модуль списка вкладок
		var registryTabs = $(".registryTabs").dxTreeList({
			dataSource: tabs,
			keyExpr: "id",
			showColumnHeaders:false,
			columns: [{
				dataField: "text",
				cellTemplate: function(container, options) {
					$('<div style="height:0px;overflow:visible;"><a class="renewlink tab'+options.data.id+'">⟳</a></div><span>'+options.data.text+'</span><br><div style="white-space:normal;max-width:160px;margin-top:3px;overflow:hidden;">'+options.data.profiles+'</div>').appendTo(container);
					$('.registryTabs .tab'+options.data.id).click(options.data.id, function(e){registryShelduleDraw(registrySheldulesStorage[e.data].arg1);e.stopPropagation();});
				},
			}],
			selection: {
				mode: "single"
			},
			editing: {
				mode: "row",
				allowDeleting: true,
			},
			onCellClick: function(e){registryShelduleDraw("",e.data.id);},		//изменить на онселект или дублировать
			onRowRemoved: function(e){$(".registryDoctorsScheldule").empty();registrySheldulesStorage[e.data.id]=null;	if (registryTabs.getSelectedRowsData()[0]) {registryShelduleDraw("",registryTabs.getSelectedRowsData()[0].id);}},
			onContentReady: function(e){e.component.deselectAll();e.component.selectRows([e.component.getKeyByRowIndex(tabs.length-1)]);$('.dx-link.dx-link-delete').html('⮾').attr('title','');},				//Выделение созданной вкладки и назначение крестика вместо ссылки "удалить"
			showRowLines: true,
			columnAutoWidth: true
		}).dxTreeList("instance");
		if (registryTabs){registryTabs.columnOption("command:edit","width","45");}			//Уменьшение ширины вкладки со ссылками на удаление ячейки
		
		

		//Функция получения массива выделенных докторов
		function getDoctorsVariable()
		{
	/* 		function registryGetDoctors(arg)			//Перебор массива profiles по критерию isSelected
			{
				function sum(sts,n){return (n>0)?registryGetDoctors(sts.items[n-1])+sum(sts,n-1):"";}
				return (arg.items!=undefined)?sum(arg,arg.items.length):(arg.isSelected)?arg.id+" ":"";
			} */
			function registryGetDoctors(arg, n)			//Перебор массива profiles по критерию isSelected
			{
				return (arg.items)?(((!(n+1))?n=arg.items.length:n)&&(n>0))?registryGetDoctors(arg, n-1)+registryGetDoctors(arg.items[n-1]):"":(arg.isSelected)?arg.did+" ":"";
			}
			return registryGetDoctors(registryDoctorListData[0]).slice(0,-2).split("d ");
		}
		
		
		//Функция отрисовки расписания
		function registryShelduleDraw(registryDrawArgument1,registryDrawArgument2){
			let sheldule;
			if (registryDrawArgument2){
				sheldule = registrySheldulesStorage[registryDrawArgument2].sheldule;
			} else {
				
				sheldule = JSON.parse($.ajax({
					type: "POST", 
					url: "api", 
					data:{
						"type":"registryGetSheldule",
						"date1":registryDrawArgument1.date1,
						"date2":registryDrawArgument1.date2,
						"doctors":registryDrawArgument1.doctors
					},
					async: false
				}).responseText);
				
				if (registryDrawArgument1.id==0){
					registrySheldulesStorage[tabs[tabs.length-1].id] = {"arg1":{"date1":registryDrawArgument1.date1,"date2":registryDrawArgument1.date2,"doctors":registryDrawArgument1.doctors, "id":tabs[tabs.length-1].id}, "sheldule":sheldule};
				} else {
					registrySheldulesStorage[registryDrawArgument1.id].sheldule = sheldule;
				}
			}

			$(".registryDoctorsScheldule").empty();
			for (i = 0; i < sheldule.length; i++) {
				
				$("<div style='min-width:290px;'><div class='doctorsheldule"+i+"' style='width:auto;margin:15px;'></div></div>").appendTo(".registryDoctorsScheldule");
				
				$(".doctorsheldule"+i).dxTreeView({
					autoExpandAll:true,
					height:"auto",
					//width:"100%",
					expandedExpr: "isExpanded",
					dataSource: sheldule[i],
					itemsExpr: "items",
					scrollDirection:"horizontal",
  					onItemContextMenu: function(e){
						e.jQueryEvent.preventDefault();
						if (!e.itemData.items){
							$("body").append("<div class='registryContextMenuWrapper' style='position:fixed;width:100%;height:100%;background:rgba(255,255,255,0);z-index:4;'></div>");
							$(".registryContextMenuWrapper").click(function(){$(".registryContextMenuWrapper").remove();});
							$(".registryContextMenuWrapper").contextmenu(function(){$(".registryContextMenuWrapper").remove();});
							$(".registryContextMenuWrapper").append("<div style='top:"+(e.jQueryEvent.pageY+1)+"px;left:"+(e.jQueryEvent.pageX+1)+"px;'></div>");
							if (e.itemData.isFree==1) {
								$(".registryContextMenuWrapper div").append("<div class='registryAdd'>Записать</div><div class='registryAddReserve'>Зарезервировать</div>");
							} else {
								if (e.itemData.isFree==2) {
									$(".registryContextMenuWrapper div").append("<div class='registryDeleteReserve'>Снять резерв</div><div class='registryAddFromReserve'>Записать</div><div class='registryReserveEdit'>Редактировать</div>");
								} else {
									$(".registryContextMenuWrapper div").append("<div class='registryDelete'>Удалить</div>");
								}
							}
							$(".registryContextMenuWrapper .registryAdd").click(function(){
								registryShowPopup(e.itemData.prid);
							});
							$(".registryContextMenuWrapper .registryDelete").click(function(){
								if(+$.ajax({type: "POST", url: "api", data:{"type":"registryPatientDelete","prid":e.itemData.prid}, async: false}).responseText){
									$('.registryTabs .tab'+registryTabs.getSelectedRowsData()[0].id).click();
									DevExpress.ui.notify("Пациент удалён","success");
								} else {
									DevExpress.ui.notify("Произошла ошибка при удалении записи. Обновите расписание и попробуйте снова.","error");
								}
							});
							$(".registryContextMenuWrapper .registryAddReserve").click(function(){		//Навешивание на кнопку "Резерв" события показа всплывающего окна с данными для резервирования
								$("#registryReservePopup").dxPopup("show");
								let registryReservePopupName = $("#registryReservePatient").dxTextBox({}).dxTextBox("instance");
								let registryReservePopupContact = $("#registryReserveContact").dxTextBox({}).dxTextBox("instance");
								let registryReservePopupComment = $("#registryReserveComment").dxTextArea({}).dxTextArea("instance");
								$("#registryReservePopupButton").dxButton({
									text: "OK",
									type: "normal",
									width:"122px",
									onClick: function() {
										if (registryReservePopupName.option("value")==''){DevExpress.ui.notify("Имя пациента обязательно к заполнению","error");} else {
											if(+$.ajax({type: "POST", url: "api", data:{"type":"registryReserve","prid":e.itemData.prid, "name": registryReservePopupName.option("value"), "contact": registryReservePopupContact.option("value"), "comment": registryReservePopupComment.option("value")}, async: false}).responseText){
												$('.registryTabs .tab'+registryTabs.getSelectedRowsData()[0].id).click();
												$("#registryReservePopup").dxPopup("hide");
												registryReservePopupName.option("value","");
												registryReservePopupContact.option("value","");
												registryReservePopupComment.option("value","");
												DevExpress.ui.notify("Время успешно зарезервировано","success");
											} else {
												DevExpress.ui.notify("Произошла ошибка при резервировании. Обновите расписание и попробуйте снова.","error");
											}
										}
									}
								});
							});
							$(".registryContextMenuWrapper .registryDeleteReserve").click(function(){
								if(+$.ajax({type: "POST", url: "api", data:{"type":"registryReserveDelete","prid":e.itemData.prid}, async: false}).responseText){
									$('.registryTabs .tab'+registryTabs.getSelectedRowsData()[0].id).click();
									DevExpress.ui.notify("Резерв успешно снят","success");
								} else {
									DevExpress.ui.notify("Произошла ошибка при удалении резерва. Обновите расписание и попробуйте снова.","error");
								}
							});
							$(".registryContextMenuWrapper .registryReserveEdit").click(function(){
								$("#registryReservePopup").dxPopup("show");
								let registryReservePopupName = $("#registryReservePatient").dxTextBox({}).dxTextBox("instance");
								let registryReservePopupContact = $("#registryReserveContact").dxTextBox({}).dxTextBox("instance");
								let registryReservePopupComment = $("#registryReserveComment").dxTextArea({}).dxTextArea("instance");
								registryReservePopupName.option("value",e.itemData.reserve.name);
								registryReservePopupContact.option("value",e.itemData.reserve.contact);
								registryReservePopupComment.option("value",e.itemData.reserve.comment);
								$("#registryReservePopupButton").dxButton({
									text: "OK",
									type: "normal",
									width:"122px",
									onClick: function() {
										if (registryReservePopupName.option("value")==''){DevExpress.ui.notify("Имя пациента обязательно к заполнению","error");} else {
											if(+$.ajax({type: "POST", url: "api", data:{"type":"registryReserveEdit","prid":e.itemData.prid, "name": registryReservePopupName.option("value"), "contact": registryReservePopupContact.option("value"), "comment": registryReservePopupComment.option("value")}, async: false}).responseText){
												$('.registryTabs .tab'+registryTabs.getSelectedRowsData()[0].id).click();
												$("#registryReservePopup").dxPopup("hide");
												registryReservePopupName.option("value","");
												registryReservePopupContact.option("value","");
												registryReservePopupComment.option("value","");
												DevExpress.ui.notify("Резерв успешно изменен","success");
											} else {
												DevExpress.ui.notify("Произошла ошибка при изменении резерва. Обновите расписание и попробуйте снова.","error");
											}
										}
									}
								});
							});
							$(".registryContextMenuWrapper .registryAddFromReserve").click(function(){
								registryShowPopup(e.itemData.prid,1);
							});
							
							
							
						}
					},
					onItemClick: function(e)
					{
						if(!e.itemData.items && e.itemData.isFree==1) {registryShowPopup(e.itemData.prid);}
					}
				});
			}

			$("pid").parent().parent().addClass('registryPatient');				//Добавление классов для оформления занятых и зарезервированных мест
			$("reserve").parent().parent().addClass('registryReserve');
		}
		
		
		function registryShowPopup(prid,deleteReserve){		//Показ всплывающего окна для записи пациента
			$("#registryPopup").dxPopup("show");
			$('.registryAppointment').click(function(){DevExpress.ui.notify("Выберите пациента, которого хотите записать.","error");});
			var registryPatientTable = $(".registryPatientTable").dxDataGrid({
			dataSource: registryPatients,
			selection: {
				mode: "single"
			},
			paging: {
				pageSize: 10
			},
			filterRow: {
				visible: true
			},
			columns: [
				{
					dataField:"ID",
					caption:"ID",
					width:"80px"
				},
				{
					dataField:"FAM",
					caption:"Фамилия"
				},
				{
					dataField:"IM",
					caption:"Имя"
				},
				{
					dataField:"OT",
					caption:"Отчество"
				},
				{
					dataField:"DR",
					caption:"Дата рождения"
				},
				{
					dataField:"NPOLIS",
					caption:"СНИЛС"
				}
			],
			onSelectionChanged:function(selectedItems){
				$('.registryAppointment').unbind('click');
				if (selectedItems.selectedRowsData[0]){
					$('.registryAppointment').click(selectedItems.selectedRowsData[0].ID,function(e){
						if (+$.ajax({type: "POST", url: "api", data:{"type":"registryPatientAppointment","pid":e.data ,"prid":prid}, async: false}).responseText) {
							$('.registryTabs .tab'+registryTabs.getSelectedRowsData()[0].id).click();
							selectedItems.component.clearSelection();
							$("#registryPopup").dxPopup("hide");
							if (deleteReserve){
								if(+$.ajax({type: "POST", url: "api", data:{"type":"registryReserveDelete","prid":prid}, async: false}).responseText){
								} else {
									DevExpress.ui.notify("Произошла ошибка при удалении резерва. Обновите расписание и попробуйте снова.","error");
								}
							}
							DevExpress.ui.notify("Пациент записан","success");
						} else {
							DevExpress.ui.notify("Ошибка! На это время уже записан пациент. Обновите расписание.","error");
						}
					});
				}
			}
			}).dxDataGrid("instance");
		}
			
		$(".registryDoctorsSchelduleBox").dxScrollView({	
			scrollByContent: true,
			showScrollbar: "always",
			direction: 'both'
		});
	}

	///////////////////////////////////////////////////////////////////////////
	
	function workplaceComponentsLoad()			//Функция загрузки компонентов рабочего места
	{
		//Модуль выбора врача в рабочем месте
		$(".workplaceDoctorFilter").dxSelectBox({
			items: workplaceDoctors,
			displayExpr: "doctor",
			valueExpr: "id",
			placeholder:"Выберите врача",
			searchEnabled: true
		});
		
		//Модуль выбора даты в рабочем месте
		var now = new Date();
		$(".workplaceDatePicker").dxDateBox({
			type: "date",
			value: now,
			width:"100%"
		});
		
		$(".workplaceShowButton").click(underConstruction);
		
		//Аккордион с пациентами
		DevExpress.ui.setTemplateEngine("underscore");
		var accordion = $(".workplacePatients").dxAccordion({
			dataSource: workplacePatientsData,
			animationDuration: 300,
			collapsible: true,
			multiple: false,
			itemTitleTemplate: $("#workplacePatientsTitle"),
			itemTemplate: $("#workplacePatientsDetails"),
		}).dxAccordion("instance");

 		$(".workplacePatientsBox").dxScrollView({			//Скроллвью для аккордиона с пациентами 
			scrollByContent: true,
			showScrollbar: "always",
			direction: 'both'
		}); 
		
		//Создание плиток
		var i;
		for (i = 0; i < workplaceTilesData.length; i++) {
			$("<div class='workplaceTile'><i class='fa fa-"+workplaceTilesData[i].icon+" fa-2x'></i>"+workplaceTilesData[i].name+"</div>").appendTo($(".workplaceTilesInnerBox"));
			$($(".workplaceTile")[i]).click(workplaceTilesData[i].wlink,function(e){workplaceTilesDraw(e.data);});
		}
		
 		$(".workplaceTilesOuterBox").dxScrollView({			//Скроллвью для блока с плитками
			//width: 250,
			scrollByContent: true,
			showScrollbar: "always",
			direction: 'both'
		}); 
		
		function workplaceTilesDraw(argument)
		{
			//чистим блок с плитками workplaceTiles
			$(".workplaceTilesInnerBox").empty();
			//загружаем шаблон с формами
			switch (argument) 
			{
				case "Sluch":
					$(".workplaceTilesInnerBox").load("tmpl/WorkplaceSluch.html",workplaceSluchLoad);
					$(".workplaceMain .elmedHeader").html("Случай пациента");
				break;
				default:
					underConstruction();
			}
		}
		
		function workplaceSluchLoad()
		{
			function workplaceFormsGetitems(){n = ["123","234","345","456"]; return n;}
			
			var workplaceForm = $(".workplaceForm").dxForm({
				formData: workplaceFormdata,
				items: [],
				width:"500"
			}).dxForm("instance");
			
			var workplaceForm2 = $(".workplaceForm2").dxForm({
				formData: workplaceForm2data,
				items: [],
				width:"500"
			}).dxForm("instance");

			var workplaceSluchItems=[];
			for (i=0; i<workplaceFormdata.length; i++)
			{
				workplaceSluchItems[i] = 
				{
					dataField: i+"."+workplaceFormdata[i].datafield,
					label:{text:workplaceFormdata[i].caption},
					editorType: workplaceFormdata[i].type,
					editorOptions: {
						items: workplaceFormsGetitems(),
						value: ""
					},
					validationRules: [{
						type: "required",
						message: "Заполнение обяазательно"
					}]
				};
				workplaceForm.option("items",workplaceSluchItems);
			}

			workplaceSluchItems=[];
			for (i=0; i<workplaceForm2data.length; i++)
			{
				workplaceSluchItems[i] = 
				{
					dataField: i+"."+workplaceForm2data[i].datafield,
					label:{text:workplaceForm2data[i].caption},
					editorType: workplaceForm2data[i].type,
					editorOptions: {
						items: workplaceFormsGetitems(),
						value: ""
					},
					validationRules: [{
						type: "required",
						message: "Заполнение обяазательно"
					}]
				};
				workplaceForm2.option("items",workplaceSluchItems);
			}
		}
	}
}









