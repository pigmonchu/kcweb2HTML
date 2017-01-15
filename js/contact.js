var ROOT_URL = "http://localhost:8000";
var API_URL = ROOT_URL + "/api/";
var MAIL_URL = ROOT_URL + "/_mail/";
var LISTA_CONTACTOS;
var TEMPLATE_CONTACTO;

var _validationTypes = {
	required: "valueMissing",
	minLength: "tooShort",
	typeMismatch: "TypeMismatch",
	patternMismatch: "patternMismatch"
	
}

var loader = $(".loader");

var activateError = function (fieldName, validationType) {
	var field = $("#" + fieldName + "~.error-msg." + validationType);
	field.addClass("active");
	field.parent().children("#"+fieldName).addClass("error-field");
}

var sendContact = function() {
	$.ajax({
			type: "POST",
			url: API_URL + "contact",
			data: data,
		})
		.done(function(data) {
			thisForm.reset();
			// enviar correo a mi mismo

		})		
		.fail(function (error) {
			console.error("Error guardando contacto.", error);
		});
		
}

var loadContacts = function(event) {
	$.ajax({
			type: "GET",
			url: API_URL + "contact"
		})
		.done(function(data) {
			for (var i=0; i<data.length; i++) {
				var item = TEMPLATE_CONTACTO.clone();
				item.children().children(".nombre-contacto").append(data[i].nombre);
				item.children().children(".telefono-contacto").append(data[i].telefon);
				item.children().children(".email-contacto").append(data[i].correoE);
				item.children().children(".asunto-contacto").append(data[i].asunto);
				
				item.appendTo(LISTA_CONTACTOS);
			}

		})		
		.fail(function (error) {
			console.error("Error leyendo contactos.", error);
		});
		
	
}

$("#form-contact").submit(function(event) {
	
	var thisForm = $("#form-contact")[0];
	var nombre = thisForm.nombre;
	var telefono = thisForm.telefono;
	var correoE = thisForm["correo-e"];
	var meConoces = thisForm["me-conoces"];
	var razon = thisForm.razon;
	var asunto = thisForm.asunto;
	
	event.preventDefault();

	// valida formulario
	
	$(".error-msg").removeClass('active');
	$(".error-field").removeClass('error-field');

	thisForm.isValid = thisForm.checkValidity();
	
	var field;
	
	if (nombre.validity.valueMissing) {
		activateError(nombre.id, _validationTypes.required);
	} 
	
	if (nombre.validity.tooShort) {
		activateError(nombre.id,  _validationTypes.minLength);
	}
	
	if (correoE.validity.typeMismatch) {
		activateError(correoE.id, _validationTypes.typeMismatch);
	}
	
	if (telefono.validity.patternMismatch) {
		activateError(telefono.id, _validationTypes.patternMismatch);
	}
	
	if (telefono.value === '' && correoE.value === '' ) {
		activateError(telefono.id, "respField");
		activateError(correoE.id, "respField");
		thisForm.isValid = false;
	}
	
	if (meConoces.value === "_other" && razon.value === '') {
		activateError(razon.id, _validationTypes.required);
		thisForm.isValid = false;
	} 
	
	if (asunto.validity.valueMissing) {
		activateError(asunto.id, _validationTypes.required);
	}
	
	if (asunto.validity.tooShort) {
		activateError(asunto.id,  _validationTypes.minLength);
	} 
	
	if (asunto.value.match(/\S+/g).length > asunto.dataset.maxwords) {
		activateError(asunto.id,  "maxWords");
		
	}
	if (!thisForm.isValid) {
		return;
	}	
	
	var data = {
		nombre: nombre.value, 
		telefono: telefono.value, 
		correoE: correoE.value, 
		meConoces: meConoces.value, 
		razon: razon.value, 
		asunto: asunto.value, 
	}
	
	loader.fadeIn();
	$.ajax({
			type: "POST",
			url: API_URL + "contact",
			data: data,
		})
		.done(function(data) {
			thisForm.reset();
			alert("Contacto enviado. En breve recibirá respuesta.")		
		})		
		.fail(function (error) {
			console.error("Error guardando contacto.", error);
		})
		.always(function(object, textStatus) {
			setTimeout(function(){ loader.fadeOut(); }, 1000);
		});
	
	/* envía peticiones Ajax
				-graba contacto
				-envía mail a mi mismo
				-envía respuesta (si procede) al contacto
	*/
	
})



$().ready(function() {
	LISTA_CONTACTOS = $(".lista-contactos");
	TEMPLATE_CONTACTO = $(".item-contacto").clone();
	$(".item-contacto").remove();
	loadContacts();
});