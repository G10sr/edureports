
let reportIds = [];
let ids = [];
let booling = 0;
let booling1 = 0;
let notdone = 0;

async function mostrarUsuarios() {
    booling = 0;
    booling1 = 0;
    let nombresUsuarios = [];
    let correosUsuarios = [];
    let permisosUsuarios = [];
    let rolesUsuarios = [];
    let rolIds = [];

    await fetch('/api/usuarios')
        .then(response => response.json())
        .then(data => {
            nombresUsuarios = data.map(item => item.name);
            correosUsuarios = data.map(item => item.email);
            permisosUsuarios = data.map(item => item.permiso); 
            rolesUsuarios = data.map(item => item.rol);
            rolIds = data.map(item => item.rol_id); 
            ids = data.map(item => item.id);
        })
        .catch(error => {
            console.error('Error al obtener los usuarios:', error);
        });

    let contenedor = document.getElementById("grid");

    for (let i = 0; i < nombresUsuarios.length; i++) {
        if (ids[i] === 4) {
            continue; 
        }
        
        let nombre = document.createTextNode(nombresUsuarios[i]);
        let correo = document.createTextNode(correosUsuarios[i]);
        let permisoTexto = permisosUsuarios[i] === true ? "✔️" : "❌"; 
        let permiso = document.createTextNode("Permiso: " + permisoTexto);
        let rol = document.createTextNode("Rol: " + rolesUsuarios[i]);

        let caja = document.createElement("div");
        caja.setAttribute("class", "minigrid");
        caja.setAttribute("id", `minibox-${ids[i]}`);

        let nom = document.createElement("p");
        nom.setAttribute("class", "titulobox");
        nom.appendChild(nombre);

        let mail = document.createElement("p");
        mail.setAttribute("class", "descbox");
        mail.appendChild(correo);

        let permisoP = document.createElement("p");
        permisoP.setAttribute("class", "permisobox");
        permisoP.appendChild(permiso);

        let role = document.createElement("p");
        role.setAttribute("class", "rol");
        role.appendChild(rol);

        const checkboxContainer = document.createElement('div');

        for (let l = 1; l <= 7; l++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            checkbox.dataset.i = i; 
            checkbox.dataset.l = l; 
            checkbox.dataset.userid = ids[i]; 

            checkbox.onclick = function(event) {
                handleCheckboxClick(event, ids[i], permisosUsuarios[i], l);
            };
            let labelrol;
            switch (l) {
              case 7:
                labelrol = 'Guest';
                break;
              case 1:
                labelrol = 'Admin';
                break;
              case 2:
                labelrol = 'Profesor';
                break;
              case 3:
                labelrol = 'Limpieza';
                break;
              case 4:
                labelrol = 'TI';
                break;
              case 5:
                labelrol = 'Infraestructura';
                break;
              case 6:
                labelrol = 'Mantenimiento';
                break;
              default:
                labelrol = 'Desconocido'; 
            }
            const label = document.createElement('label');
            label.className = 'labelsmanager';
            label.textContent = labelrol;

            checkbox.checked = (rolIds[i] === 7 && l === 7) ||
            (rolIds[i] === 1 && l === 1) ||
            (rolIds[i] === 2 && l === 2) ||
            (rolIds[i] === 3 && l === 3) ||
            (rolIds[i] === 4 && l === 4) ||
            (rolIds[i] === 5 && l === 5) ||
            (rolIds[i] === 6 && l === 6);  

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            checkboxContainer.appendChild(document.createElement('br'));
            checkboxContainer.className = "chex";
        }

        const permisoCheckbox = document.createElement('input');
        permisoCheckbox.type = 'checkbox';
        permisoCheckbox.className = 'permiso-checkbox';
        permisoCheckbox.checked = permisosUsuarios[i] === 1;

        permisoCheckbox.onclick = function(event) {
            handlePermisoCheckboxClick(event, ids[i], rolIds[i]);
        };

        const permisoLabel = document.createElement('label');
        permisoLabel.textContent = "Permiso";
        permisoLabel.className = "Nox";
        permisoLabel.appendChild(permisoCheckbox);
        permisoP.appendChild(document.createElement('br'));
        permisoP.appendChild(permisoLabel);
        permisoP.className = "peng";

        nom.appendChild(mail);
        caja.appendChild(nom);
        caja.appendChild(permisoP);
        caja.appendChild(checkboxContainer);

        contenedor.appendChild(caja);
    }
}

async function handleCheckboxClick(event, userId, currentPermiso, newRol) {
    const sameIGroupCheckboxes = document.querySelectorAll(`.checkbox[data-i="${event.target.dataset.i}"]`);

    sameIGroupCheckboxes.forEach((cb) => {
        if (cb !== event.target) {
            cb.checked = false; 
        }
    });

    const verificacion = await postverificacion();
    const roles = await rolesfunc();

if (!event.target.checked) {
        if (verificacion === 1 || roles === 1) {
            console.log('No tienes permisos para quitar este rol.');
        } else {
            await fetch('/api/roles')
            .then(response => response.json())  
            .then(data => {
            let rol = data; 
            if (rol.rolId[0]==1){
                fetch('/api/update-user1', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: userId, newRol: 0 }) 
                })
                .then(response => response.json())
                .then(data => {
                    console.log('User role updated to Sin rol:', data);
                })
                .catch(error => {
                    console.error('Error updating user role:', error);
                });
            } else {
                console.log('No tienes permisos para asignar este rol.');
                window.location.href = '/reportes'; 
            }         
        })
        .catch(error => {
            console.error('Error al obtener los reportes:', error);
        });
        }
} else {
        if (!(verificacion === 1 || roles === 1)) {
        await fetch('/api/roles')
            .then(response => response.json())  
            .then(data => {
            let rol = data; 
            if (rol.rolId[0]==1){
                fetch('/api/update-user1', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: userId, newRol: newRol }) 
                })
                .then(response => response.json())
                .then(data => {
                    console.log('User role updated successfully:', data);
                })
                .catch(error => {
                    console.error('Error updating user role:', error);
                });
            } else {
                console.log('No tienes permisos para asignar este rol.');
                window.location.href = '/reportes'; 
            }         
        })
        .catch(error => {
            console.error('Error al obtener los reportes:', error);
        });
            } else {
    console.log('No tienes permisos para asignar este rol.');
    window.location.href = '/reportes'; 
    }
    }
}
async function handlePermisoCheckboxClick(event, userId, currentRol) {
    const checkbox = event.target;
    let newPermiso = checkbox.checked ? 1 : 0;

    const verificacion = await postverificacion(); 
    const roles = await rolesfunc();

    if (!(verificacion === 1 || roles === 1)) {
        await fetch('/api/roles')
            .then(response => response.json())  
            .then(data => {
            let rol = data; 
            if (rol.rolId[0]==1){
                fetch('/api/update-user2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: userId, newPermiso: newPermiso }) 
                })
                .then(response => response.json())
                .then(data => {
                    console.log('User permission updated successfully:', data);
                })
                .catch(error => {
                    console.error('Error updating user permiso:', error);
                });
            } else {
                console.log('No tienes permisos para asignar este rol.');
                window.location.href = '/reportes'; 
            }         
        })
        .catch(error => {
            console.error('Error al obtener los reportes:', error);
        });
        
    } else {
        console.log('No tienes permisos para cambiar este permiso.');
        window.location.href = '/reportes';
    }
}



function refresh() {
    var contenedor = document.getElementById("grid");
    var refreshButton = document.getElementById("refresh");

    refreshButton.classList.remove("refresh_animation");
    setTimeout(function() {
        refreshButton.classList.add("refresh_animation");
    }, 10);

    contenedor.innerHTML = '';
    setTimeout(mostrarUsuarios, 300);
}

async function rolesfunc() {
    await fetch('/api/roles')
    .then(response => response.json())  
    .then(data => {
        let rol = data; 
        if ([1, 3, 4, 5, 6].includes(rol.rolId[0])) {  // Verifica si el rol está en la lista permitida
            if (notdone === 0) {
                var hiper = document.getElementById("hipervinculos");

                let newListItem = document.createElement('li');
                newListItem.innerHTML = `
                    <a href="manager" class="opciones">
                        <i class="fa-solid fa-clipboard-list"></i> Gestor Reportes
                    </a>`;
                hiper.appendChild(newListItem);

                if (rol.rolId[0] === 1) {
                    let newListItem2 = document.createElement('li');
                    newListItem2.innerHTML = `
                        <a href="manager2" class="opciones">
                            <i class="fa-solid fa-clipboard-list"></i> Gestor Anuncios
                        </a>`;
                    let newListItem3 = document.createElement('li');
                    newListItem3.innerHTML = `
                        <a href="manager3" class="opciones">
                            <i class="fa-solid fa-clipboard-list"></i> Gestor Usuarios
                        </a>`;
                    hiper.appendChild(newListItem2);
                    hiper.appendChild(newListItem3);
                }

                notdone = 1; // Marca como completado
            }
            
        } else {
            alert("You don't have permission for this")
            window.location.href = '/reportes'; 
            return 1;
        }
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
}
async function postverificacion() {
    await fetch('/api/verificacion')
    .then(response => response.json())  
    .then(data => {
        let ver = data; 
        if (ver.permisoid[0]==1){

        } else if (ver.permisoid[0]==0) {
            window.location.href = '/iniciosesion'; 
            return 1;
        }
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
}
window.onload = function() {
    mostrarUsuarios()
    postverificacion();
    rolesfunc();
    verificarNuevosReportes();
    verificarNuevosAnuncios();
};

async function verificarNuevosReportes() {
    fetch('/contarReportes')
    .then(response => response.json())
    .then(data => {
    const bol = data;
    if (bol == 1) {
        if (booling1 == 0){
        booling1 = 1; 
        const reporteLink = document.getElementById('reporteLink');
        reporteLink.innerHTML += " ⦿";}
        if (!document.title.startsWith("🔴")) {
            document.title = "🔴 " + document.title;
        }
    }
    })
    .catch(error => {
        console.error('Error al verificar reportes:', error);
    });
        }

        setInterval(function() {
            verificarNuevosReportes();
            verificarNuevosAnuncios();
        }, 5000); 
    async function verificarNuevosAnuncios() {
    fetch('/contarAnuncios')
    .then(response => response.json())
    .then(data => {
    const bol = data;
    if (bol == 1) {
        if (booling == 0){
        booling = 1; 
        const anunciosLink = document.getElementById('anunciosLink');
        anunciosLink.innerHTML += " ⦿";}
        if (!document.title.startsWith("🔴")) {
            document.title = "🔴 " + document.title;
        }
    }
    })
    .catch(error => {
        console.error('Error al verificar reportes:', error);
    });
        }
        
        function logout() {
            fetch('/api/logout', {
                method: 'POST'
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/iniciosesion'; 
                } else {
                    console.error('Error al cerrar sesión');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }