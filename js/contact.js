var ROOT_URL = "http://localhost:8000";
var API_URL = ROOT_URL + "/api/";
var MAIL_URL = ROOT_URL + "/_mail/";
var LISTA_CONTACTOS;
var TEMPLATE_CONTACTO;

var IE_ME_CONOCES_OTROS = 3; 

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
		alert("Contacto enviado. En breve recibirá respuesta.")		
	})		
	.fail(function (error) {
		console.error("Error guardando contacto.", error);
	});

	
}

var clearContacts = function() {
	var contactos = LISTA_CONTACTOS.children();
	for (var i=contactos.length-1; i>=0; i--) {
		contactos[i].remove();
	}
}

var loadContacts = function(event) {
	$.ajax({
			type: "GET",
			url: API_URL + "contact"
		})
		.done(function(data) {
			for (var i=0; i<data.length; i++) {
				var item = TEMPLATE_CONTACTO.clone();
				item.attr("data-id", data[i].id);
				item.children().children(".nombre-contacto").append(data[i].nombre);
				item.children().children(".telefono-contacto").append(data[i].telefon);
				item.children().children(".email-contacto").append(data[i].correoE);
				item.children().children(".asunto-contacto").append(data[i].asunto);
				
				item.appendTo(LISTA_CONTACTOS);
			}
//Hay que ponerlo aquí porque cada vez que se clona debe asociarse el evento al nuevo elemento.
			if (data.length > 0) {
				$(".recargar-contactos").removeClass("hidden");
			} else {
				$(".recargar-contactos").addClass("hidden");
			}
			$(".borrar-contacto").click(deleteContact);
			

		})		
		.fail(function (error) {
			console.error("Error leyendo contactos.", error);
		});
}

var deleteContact = function(event) {
	var activeElement = $(event.currentTarget.parentNode.parentNode);
	var id = activeElement.attr("data-id");

	$.ajax({
			type: "DELETE",
			url: API_URL + "contact/" + id
		})
		.done(function() {
			activeElement.remove();
		})		
		.fail(function (error) {
			console.error("Error leyendo contactos.", error);
		});
	
}

$(".recargar-contactos").click(function(event) {
	clearContacts();
	loadContacts(event);
});

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
	
	if (nombre.validity.tooShort || nombre.value.length < nombre.dataset.minlength) {
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
	
	if ((meConoces.value === "_other" || meConoces[IE_ME_CONOCES_OTROS].checked) && razon.value === '') {
		activateError(razon.id, _validationTypes.required);
		thisForm.isValid = false;
	} 
	
	if (asunto.validity.valueMissing) {
		activateError(asunto.id, _validationTypes.required);
	}
	
	if (asunto.validity.tooShort) {
		activateError(asunto.id,  _validationTypes.minLength);
	} 
	
	if (asunto.value && asunto.value.match(/\S+/g).length > asunto.dataset.maxwords) {
		activateError(asunto.id,  "maxWords");
		thisForm.isValid = false;		
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

	var img = {
		email : "ramon@digestivethinking.com",
		body: data.asunto
	};
	
	var emailLink="mailto:" + img.email;
	
	img.body += ("\n\nInformación de contacto\nNombre: " + data.nombre +"\n" + (data.telefono ? ("Teléfono: " + data.telefono) : "") + "\n" + (data.correoE ? ("Correo: " + data.correoE) : "")+ "\n");
	img.body = encodeURIComponent(img.body);

	emailLink += ("?subject=Contacto desde web&body=" + img.body);

	var a = document.createElement("a");      // Create an Anchor element
	a.href = emailLink;                       // Set it's href
	document.body.appendChild(a);             // Append to document
	a.click();                                // Trigger a click()
	a.parentNode.removeChild(a);              // Remove it		

	loader.fadeOut();


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