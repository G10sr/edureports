var booling = 0; 
var booling1 = 0; 
async function rolesfunc() {
    await fetch('/api/roles')
    .then(response => response.json())  
    .then(data => {
        let rol = data; 
        if (rol.rolId[0]==1 || rol.rolId[0]==3 || rol.rolId[0]==4 || rol.rolId[0]==5 || rol.rolId[0]==6){
            var hiper = document.getElementById("hipervinculos");
            let newListItem = document.createElement('li');

            newListItem.innerHTML = `
                <a href="manager" class="opciones">
                    <i class="fa-solid fa-clipboard-list"></i> Gestor 
                    Reportes
                </a>`;
                hiper.appendChild(newListItem);
            if (rol.rolId[0]== 1){

            let newListItem2 = document.createElement('li');
            newListItem2.innerHTML = `
                <a href="manager2" class="opciones">
                    <i class="fa-solid fa-clipboard-list"></i> Gestor 
                    Anuncios
                </a>`;
                let newListItem3 = document.createElement('li');

                newListItem3.innerHTML = `
                    <a href="manager3" class="opciones">
                        <i class="fa-solid fa-clipboard-list"></i> Gestor 
                        Usuarios
                    </a>`;
                    hiper.appendChild(newListItem2);
            hiper.appendChild(newListItem3);
            }
        } else {
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
            alert("You don't have permission for this")
            window.location.href = '/iniciosesion'; 
        }
    })
    .catch(error => {
        console.error('Error al obtener los reportes:', error);
    });
}
window.onload = function() {
    postverificacion();
    verificarNuevosAnuncios();
    verificarNuevosReportes();
    rolesfunc();
    agregarIcono();
    const mapContainer = document.getElementById('map');
        const svgElement = document.getElementById('ey40nT29W7O1');
        
        mapContainer.scrollTop = (svgElement.clientHeight - mapContainer.clientHeight) / 2;
        mapContainer.scrollLeft = (svgElement.clientWidth - mapContainer.clientWidth) / 2;
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


        //controles del mapa 

    let currentHeight = 1000; 
    const minHeight = 500; 
    const maxHeight = 3000; 

    function zoomIn() {
        currentHeight = Math.min(maxHeight, currentHeight + 100);
        document.getElementById('ey40nT29W7O1').style.height = `${currentHeight}px`;
    }

    function zoomOut() {
        currentHeight = Math.max(minHeight, currentHeight - 100);
        document.getElementById('ey40nT29W7O1').style.height = `${currentHeight}px`;
    }



    async function agregarIcono() {
    const svg = document.getElementById('ey40nT29W7O1');

    let posicion = [];
    let vigencia = [];
    let posicion2 = [];
    let vigencia2 = [];

    try {
        const response1 = await fetch('/api/mapa');
        const data1 = await response1.json();
        posicion = data1.map(item => item.lugar_id);
        vigencia = data1.map(item => item.vigencia);

        const response2 = await fetch('/api/mapa2');
        const data2 = await response2.json();
        posicion2 = data2.map(item => item.lugar_id);
        vigencia2 = data2.map(item => item.vigencia);

    } catch (error) {
        console.error('Error al obtener datos:', error);
        return;
    }

    // ===== PRIMER MAPA =====
    for (let i = 0; i < posicion.length; i++) {
        if (vigencia[i] != false) {

            let imagen = document.createElementNS("http://www.w3.org/2000/svg", "image");
            imagen.setAttribute("href", "../imagenes/icon.svg");
            imagen.setAttribute("width", "20");
            imagen.setAttribute("height", "20");
            imagen.style.boxShadow = "0 0 20px 5px rgba(255, 255, 0, 0.7)";

            if (posicion[i] == 1) {
                imagen.setAttribute("x", "350");
                imagen.setAttribute("y", "375");
            } else if (posicion[i] == 2) {
                imagen.setAttribute("x", "368");
                imagen.setAttribute("y", "385");
            } else if (posicion[i] == 3) {
                imagen.setAttribute("x", "387");
                imagen.setAttribute("y", "394");
            } else if (posicion[i] == 4) {
                imagen.setAttribute("x", "405");
                imagen.setAttribute("y", "405");
            } else if (posicion[i] == 5) {
                imagen.setAttribute("x", "387");
                imagen.setAttribute("y", "357");
            } else if (posicion[i] == 6) {
                imagen.setAttribute("x", "405");
                imagen.setAttribute("y", "335");
            } else if (posicion[i] == 7) {
                imagen.setAttribute("x", "365");
                imagen.setAttribute("y", "355");
            } else if (posicion[i] == 8) {
                imagen.setAttribute("x", "357");
                imagen.setAttribute("y", "290");
            } else if (posicion[i] == 9) {
                imagen.setAttribute("x", "324");
                imagen.setAttribute("y", "355");
            } else if (posicion[i] == 10) {
                imagen.setAttribute("x", "337");
                imagen.setAttribute("y", "435");
            } else if (posicion[i] == 11) {
                imagen.setAttribute("x", "347");
                imagen.setAttribute("y", "470");
            } else if (posicion[i] == 12) {
                imagen.setAttribute("x", "315");
                imagen.setAttribute("y", "420");
            } else if (posicion[i] == 13) {
                imagen.setAttribute("x", "315");
                imagen.setAttribute("y", "247");
            } else if (posicion[i] == 14) {
                imagen.setAttribute("x", "159");
                imagen.setAttribute("y", "280");
            } else if (posicion[i] == 15) {
                imagen.setAttribute("x", "440");
                imagen.setAttribute("y", "436");
            } else if (posicion[i] == 16) {
                imagen.setAttribute("x", "480");
                imagen.setAttribute("y", "460");
            }

            if (posicion[i] != 100) {
                svg.appendChild(imagen);
            }
        }
    }

    // ===== SEGUNDO MAPA (GRISES) =====
    for (let i = 0; i < posicion2.length; i++) {
        if (vigencia2[i] != false) {

            let imagen = document.createElementNS("http://www.w3.org/2000/svg", "image");
            imagen.setAttribute("href", "../imagenes/icon.svg");
            imagen.setAttribute("width", "20");
            imagen.setAttribute("height", "20");
            imagen.style.filter = "grayscale(200)";
            imagen.style.boxShadow = "0 0 20px 5px rgba(255, 255, 0, 0.7)";

            if (posicion2[i] == 1) {
                imagen.setAttribute("x", "340");
                imagen.setAttribute("y", "375");
            } else if (posicion2[i] == 2) {
                imagen.setAttribute("x", "358");
                imagen.setAttribute("y", "385");
            } else if (posicion2[i] == 3) {
                imagen.setAttribute("x", "377");
                imagen.setAttribute("y", "394");
            } else if (posicion2[i] == 4) {
                imagen.setAttribute("x", "395");
                imagen.setAttribute("y", "405");
            } else if (posicion2[i] == 5) {
                imagen.setAttribute("x", "377");
                imagen.setAttribute("y", "357");
            } else if (posicion2[i] == 6) {
                imagen.setAttribute("x", "395");
                imagen.setAttribute("y", "335");
            } else if (posicion2[i] == 7) {
                imagen.setAttribute("x", "355");
                imagen.setAttribute("y", "355");
            } else if (posicion2[i] == 8) {
                imagen.setAttribute("x", "347");
                imagen.setAttribute("y", "290");
            } else if (posicion2[i] == 9) {
                imagen.setAttribute("x", "314");
                imagen.setAttribute("y", "355");
            } else if (posicion2[i] == 10) {
                imagen.setAttribute("x", "327");
                imagen.setAttribute("y", "435");
            } else if (posicion2[i] == 11) {
                imagen.setAttribute("x", "337");
                imagen.setAttribute("y", "470");
            } else if (posicion2[i] == 12) {
                imagen.setAttribute("x", "305");
                imagen.setAttribute("y", "420");
            } else if (posicion2[i] == 13) {
                imagen.setAttribute("x", "305");
                imagen.setAttribute("y", "247");
            } else if (posicion2[i] == 14) {
                imagen.setAttribute("x", "149");
                imagen.setAttribute("y", "280");
            } else if (posicion2[i] == 15) {
                imagen.setAttribute("x", "430");
                imagen.setAttribute("y", "436");
            } else if (posicion2[i] == 16) {
                imagen.setAttribute("x", "470");
                imagen.setAttribute("y", "460");
            }

            if (posicion2[i] != 100) {
                svg.appendChild(imagen);
            }
        }
    }
}
    
        
    
        
    const imageContainer = document.getElementById('map');
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    imageContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - imageContainer.offsetLeft;
        startY = e.pageY - imageContainer.offsetTop;
        scrollLeft = imageContainer.scrollLeft;
        scrollTop = imageContainer.scrollTop;
        imageContainer.style.cursor = 'grabbing'; // Cambia el cursor cuando estás arrastrando
    });
    
    imageContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        imageContainer.style.cursor = 'grab';
    });
    
    imageContainer.addEventListener('mouseup', () => {
        isDragging = false;
        imageContainer.style.cursor = 'grab';
    });
    
    imageContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Evita comportamientos indeseados
        const x = e.pageX - imageContainer.offsetLeft;
        const y = e.pageY - imageContainer.offsetTop;
        const walkX = (x - startX); // Cantidad de píxeles a desplazar horizontalmente
        const walkY = (y - startY); // Cantidad de píxeles a desplazar verticalmente
        imageContainer.scrollLeft = scrollLeft - walkX;
        imageContainer.scrollTop = scrollTop - walkY;
    });