var allContacts = [];

function loadContacts() {
  const contacts = [];
  const contactListString = localStorage.getItem("agenda");
  if (contactListString) {
    const contactList = JSON.parse(contactListString);

    for (const contact of contactList) {
      const dato = {
        id: contact.id,
        nombre: contact.nombre,
        direccion: contact.direccion,
        email: contact.email,
        genero: contact.genero,
      };

      contacts.push(dato);
    }
  }
  return contacts;
}

function generateAgenda(contacts) {
  let allContactsHTML = "";

  contacts.forEach((obj) => {
    let generoClass = "";
    if (obj.genero) {
      generoClass = `"genero-${obj.genero}"`;
    }

    let contactHTML = `
        <div class="card" id="${obj.id}">
          <h2 class=${generoClass}>${obj.nombre}</h2>
          <p>${obj.direccion}</p>
          <p>${obj.email}</p>
          <button onclick="deleteContact(${obj.id})">
            <svg width="18" height="18">
              <use xlink:href="#delete"></use>
            </svg>
          </button>
        </div>`;

    allContactsHTML += contactHTML;
  });

  return allContactsHTML;
}

function showData() {
  allContacts = [...loadContacts()];
  const container = document.getElementById("card-container");

  if (allContacts && allContacts.length > 0) {
    contactsCount = allContacts.length;

    const contactListHTML = generateAgenda(allContacts);
    container.innerHTML = contactListHTML;
  } else {
    contactsCount = 0;
    container.innerHTML = "<p>No hay ningún dato personal cargado todavía.</p>";
  }
}

function validarCorreo(emailAddres) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailAddres).toLowerCase());
}

function validateForm() {
  const nombre = document.getElementById("name");
  var error = false;

  if (nombre.value.trim().length === 0) {
    nombre.classList.add("error");
    error = true;
  } else {
    nombre.classList.remove("error");
  }

  const email = document.getElementById("email");
  if (validarCorreo(email.value.trim())) {
    email.classList.remove("error");
    error = true;
  } else {
    email.classList.add("error");
  }

  return error;
}

function deleteContact(id) {
  if (id >= 0) {
    const contactIndexToDelete = allContacts.findIndex((i) => i.id === id);
    allContacts.splice(contactIndexToDelete, 1);
    localStorage.setItem("agenda", JSON.stringify(allContacts));
    showData();
  }
}

//Mostrar la agenda con datos de localstorage
showData();

const forms = document.getElementsByTagName("form");

Array.from(forms).forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (validateForm()) {
      //Agregar más datos a local storage
      const nombre = document.getElementById("name").value;
      const direccion = document.getElementById("address").value;
      const email = document.getElementById("email").value;
      const generoRadio = document.querySelector(
        'input[name="genero"]:checked'
      );
      const genero = generoRadio && generoRadio.id;

      const user = {
        id: Math.max(...allContacts.map((contact) => contact.id), 0) + 1,
        nombre,
        direccion,
        email,
        genero,
      };

      allContacts.push(user);
      localStorage.setItem("agenda", JSON.stringify(allContacts));

      return true;
    } else {
      event.preventDefault();
      return false;
    }
  });
});
