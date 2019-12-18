


window.onpopstate = function(event) {
  if (event.state.refresh) location.reload();
};

function CloseAllModals(){
	$('.modal').modal('hide');
}

$(document).ready(InitializeDocument);

function InitializeDocument(){
	InitAjaxLinks();
	DisableSubmitButtonsAfterSubmit();
    InitCronoSqlForms();
    $('select.selectpicker').selectpicker();
}
var actionAttribute = "[data-action=true]";
function InitCronoSqlForms(){
	$("form" + actionAttribute).submit(function(e){
		e.preventDefault();
		var form = $(this);
		ManageFormFiles(form, function(){ 
			//La lectura de ficheros se ejecuta en segundo plano y es imposible esperar a que acabe la lectura
			//Lo que si se puede es ejecutar algo cuando la lecutra a sido completada, por eso, 
			//lo siguiente se ejecutará cada vez que se haya acabado de leer un fichero
			//y cuando todos los ficheros hayan sido leidos entonces se serializará el formulario y se enviará al servidor
			if(IsFormReady(form)){
				var cronoSql = FormCronoContent(form);
				DoPost(form.attr("action"), cronoSql);
				$(this).find("[type=submit]").attr("disabled", true); // blank the input
			}
		});
	});
}

function IsFormReady(form){
	var inputFiles =InputFilesWithValue(form);
	var allFilesReaded = true;
	inputFiles.each(function(i, input) {
		allFilesReaded = allFilesReaded && $(input).attr(fileBase64Attribute) != null;
	});
	return allFilesReaded;
}

function InputFilesWithValue(form){
	return form.find("input[type=file]").filter(function(i, item){ return $(item).val() != null && $(item).val() != "";});
}

var fileBase64Attribute = "file-base64";
//Lee todos los input type files y guarda el base64 en el atributo fileBase64Attribute
function ManageFormFiles(form, callback){
	var inputFiles = InputFilesWithValue(form)
	if (inputFiles.length == 0){
		callback();
	}else{
		inputFiles.each(function(i, item){
			if (item.files.length > 0){
				file = item.files[0];
				FileToBase64(file, function(event){
					$(item).attr(fileBase64Attribute, event.target.result);
					callback();
				});
			}
		});
	}
}

function DoPost(url, cronoSql){
	var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", url);
	var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "p");
    hiddenField.setAttribute("value", cronoSql);
	form.appendChild(hiddenField);
	document.body.appendChild(form);
	ShowOverlay($(document.body.children[0]));
	form.submit();
}

function DisableSubmitButtonsAfterSubmit(){
	$("form[method=post]:not(" + actionAttribute + ")").submit(function(e) {
		e.preventDefault(); // don't submit multiple times
		this.submit(); // use the native submit method of the form element
		$(this).find("[type=submit]").attr("disabled", true); // blank the input
	});
}

function InitAjaxLinks(){
	var ajaxLinks = $("a[data-target]").not("[data-disable-ajax=true]").not("[target='_blank']");
	ajaxLinks.unbind("click", OnAjaxLinkClick);
	ajaxLinks.click(OnAjaxLinkClick);
}

function OnAjaxLinkClick(event){
	var targetId=$(this).attr("data-target");
	var targetElement = $("#"+targetId);
	var href = $(this).attr("href");
	if (href != '#' && !event.ctrlKey && !event.shiftKey && !event.metaKey && event.which != 2){
        var currentVariables = UrlVariables(window.location.href);
        var parentDropDown = $(this).parents(".dropdown.open"); //Se usa parents() y no parent() porque al parecer parent() solo mira un nivel hacia arriba 
        
        Object.keys(currentVariables).forEach(function(key, index) {
          if(key != "p" && key != "id") href = AddParameterToUrl(href, key, currentVariables[key]);
        }, currentVariables);
        
        if ($(this).attr("data-variable") != null) {
            var value=$(this).attr("data-value");
            href = AddParameterToUrl(href, $(this).attr("data-variable"), value);
            if(parentDropDown != null) parentDropDown.find("button").find("span").first().text($(this).text());
        }
        var targetUrl = AddParameterToUrl(href, "id", targetId);
        ReplaceContentWithAjaxCall(targetElement, targetUrl, href);
        
        if (parentDropDown != null)	parentDropDown.find("[data-toggle='dropdown']").dropdown("toggle");
        return false;
	}
}

function AddParameterToUrl(urlWithQueryString, parameterName, parameterValue){
    var urlPath = UrlPath(urlWithQueryString);
    var urlVariables = UrlVariables(urlWithQueryString);
    urlVariables[parameterName] = parameterValue;
    var parametized = Object.keys(urlVariables).map(function(key){ return key+"="+urlVariables[key]}).join("&");
	return urlPath + "?" + parametized;
}

function UrlPath(urlWithQueryString){
    var urlEnd = urlWithQueryString.indexOf('?');
    return urlWithQueryString.substring(0, urlEnd !== -1 ? urlEnd : urlWithQueryString.length);
}

function UrlVariables(urlWithQueryString){
    var queryStringStart = urlWithQueryString.indexOf('?');
    if (queryStringStart==-1){
        return [];
    }else{
        var queryString = urlWithQueryString.substring(queryStringStart+1);
        var parameters = [];
        if (queryString != ""){
            queryString.split("&").forEach( function(valor, indice, array) {
                var param = valor.split("=");
                var key = param[0];
                var value = param[1];
                parameters[key] = value;
            });
        }
        return parameters;
        
    }
    
}

function OverlayIdFor(targetElement){
	return "overlay-" + targetElement.attr("id");
}

function ShowOverlay(targetElement){
	var overlayContainerStyle = "text-align: center; position: absolute;  width: 100%;    height: 100%;    z-index: 100;";	
	var overlayStyle = overlayContainerStyle + "background: #777;    opacity: 0.50;"
	var marginCorrection = "margin-top: -" + targetElement.css("padding-top") + ";";
	marginCorrection = marginCorrection + "margin-bottom: -" + targetElement.css("padding-bottom") + ";";
	marginCorrection = marginCorrection + "margin-left: -" + targetElement.css("padding-left") + ";";
	marginCorrection = marginCorrection + "margin-right: -" + targetElement.css("padding-right") + ";";
	overlayContainerStyle = overlayContainerStyle + marginCorrection;
	var imgVerticalAlign ='';
	var overlayImage = "<img src='https://resourcescrono.s3-eu-west-1.amazonaws.com/dashboard-resources/img/waiting_blue.gif'";
	if (targetElement.height() > $(window).height()){
		overlayImage = overlayImage + "style='margin-top: " + (($(window).height() / 2) -128) + "px;z-index: 200;' />";
	}else{
		overlayImage = overlayImage + "style='vertical-align: middle;' /><span style='display: inline-block; height: 100%; vertical-align: middle;z-index: 200;' />";
	}
	var overlay = "<div id='" + OverlayIdFor(targetElement) + "' style='" + overlayContainerStyle + "'>";
	overlay = overlay + "<div style='" + overlayStyle + "'></div>";
	overlay = overlay + overlayImage
	overlay = overlay + "</div>"
	targetElement.prepend(overlay);
}

function RemoveOverlay(targetElement){
	targetElement.find("#" + OverlayIdFor(targetElement)).remove();
}
var lastAjax;
function ReplaceContentWithAjaxCall(targetElement, targetUrl, reloadUrl){
	lastAjax=targetUrl;
	$.ajax({
		method: "GET",
		url: targetUrl,
		beforeSend: function() {
			CloseAllModals();
			ShowOverlay(targetElement);
		}
	  }).done(function(data) {
			if(targetUrl == lastAjax){
				var dataParsed = data;
				try{
					dataParsed = $(data).html();
				}catch(err){
					dataParsed = "<p style='white-space: pre-wrap;'>" + data + "</p>";
				}
				targetElement.html(dataParsed);
				ChangeUrl(reloadUrl);
				InitializeDocument();
			}
	  })
	  .fail(function(err) {
			document.write(err.responseText);
			document.close();
			ChangeUrl(reloadUrl);
	  })  
	  .always(function() {
		RemoveOverlay(targetElement);
	  });
}

function ChangeUrl(newUrl){
	history.pushState({refresh: true}, document.title, newUrl);
}

function FormContent(form){
    // Returns the form contents (as an object...)
    var header =$(form).find('input').toArray();
    var details = $("[data-entity-name]")
    var data_obj = {};

    details.each(function(i, item) {
     
      var entity_name = $(item).attr('data-entity-name');
      var childInputs = $('input', item), input_obj = {};

      if(!data_obj[entity_name]) data_obj[entity_name] = [];

      childInputs.each(function(j, ele) {
          var idx = header.indexOf(ele);
          header.splice(idx, 1);
          var input_name = $(ele).attr('name');
          input_obj[input_name] = InputValue(ele);
      });

      data_obj[entity_name].push(input_obj);
    });

    var contentObject = {};

    header.forEach(function(item) {
      contentObject[$(item).attr('name')] = InputValue(item);
    });

    for(var x in data_obj) {
      contentObject[x] = data_obj[x];
    }
    
    return contentObject;
 
}


function ArrayToCronoSql(content){
    // TO DO: returns the data in Crono SQL format (equivalent to JSON.stringify, but in Crono SQL)











    
}

var formItemsSelector = 'input[name], select[name]';
function FormCronoContent(form){
    // returns the content of a <form> element in Crono SQL format (WE WILL DELETE THIS FUNCTION)

    var form_inputs =form.find(formItemsSelector).toArray();
    var data_entity_names = $("[data-entity-name]");

    //contacts and details
    var entity_name="";
    var last_entity_name="";
    var contacts_details="";
    data_entity_names.each(function(i, item) {
        entity_name = $(item).attr('data-entity-name');
        contacts_details+= last_entity_name==entity_name ? "" : '    ' + entity_name+" = ROWS(\n"; 
        var childInputs = $(formItemsSelector, item);

        contacts_details+="        (";
        childInputs.each(function(j, ele) {
            var idx = form_inputs.indexOf(ele);
            form_inputs.splice(idx, 1);
            contacts_details+=SerializeInput(ele);
            if( j != (childInputs.length - 1))  contacts_details +=',';      
        });
        contacts_details+=")";
  
        contacts_details+= $(data_entity_names[i]).attr("data-entity-name") == $(data_entity_names[i+1]).attr("data-entity-name") ? ",\n" : "\n ";
        contacts_details+= i === (data_entity_names.length - 1) ? "    )": $(data_entity_names[i]).attr("data-entity-name") == $(data_entity_names[i+1]).attr("data-entity-name") ? "" : "   ),\n ";
        last_entity_name = entity_name;
    });
 
    // cabecera
    var data_cabecera="";

    var allInputs=form_inputs.map(function(item) { return '    ' + SerializeInput(item)});
	if (allInputs.length > 0){
    data_cabecera+=allInputs.join(',\n');
	}
    

    var data=data_cabecera;
    if(contacts_details!=''){
		if(data != '') data += ',\n';
		data+= contacts_details;
	}  
    data = "(\n" + data + "\n)";

    return data;

}




function InputValue(item){
    // Gets the typed value of an <input> or <select> 
    //Si es un select intentamos obtener el elemento seleccionado
    if ($(item).prop('tagName').toLowerCase()=="select" && $(item).find(":selected").length == 1){
        item = $(item).find(":selected")[0];
    }
    
    var type=$(item).attr("data-value-type");
    var hasTypeAttribute = $(item).attr("type") !== undefined && $(item).attr("type") !== false;
    if (type==null || (type=="NULL" && hasTypeAttribute && type != $(item).attr("type"))) type=$(item).attr("type");
    var value=$(item).val();
    if(type=="text"){
        return value;  
    }else if (type=="checkbox"){
        return  $(item)[0].checked==true;
    }else if (type=="radio"){
        return  $(item)[0].checked==true;
    }else if (type=="file"){
        return  $(item).attr(fileBase64Attribute);
    }else if (value==""){
        return null;
    }else if(type=="date"){
        return new Date(value);
    }else if(type=="number"){
        return Number(value);
    }else {
        return value;
    }
}

function FileToBase64(file, callback){
	var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onloadend = callback;
   reader.onerror = function (error) {
     alert("Ha ocurrido un error al cargar el fichero y no se subirá al servidor.");
   };
}


function SerializeInput(item){
    // Serialize a <input> or <select> as an assigment
	var name = $(item).attr('name');
	var inputValue = InputValue(item);
	var value = CronoSerialize(inputValue);
    return name + "=" + value;
}




function CronoSerialize(value) {
    // Serialize any value (string, date, number or boolean)
    if(typeof value==="string"){
        return "'"+value.replace("'", '"')+"'";    
    }else if(value instanceof  Date){
        return   "d'"+value.toISOString().substring(0,10)+"'";
    }else if(typeof value=="number"){
        return value.toString();
    }else if (typeof value=="boolean"){
        return value ? "YES" : "NO" ;
    } else{
        return "NULL";
    }
 
}


function Indentation(text){
    // TO DO: returns the text after adding 4 spaces before each text line



}