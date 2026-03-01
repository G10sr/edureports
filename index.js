import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import { readFile } from 'fs/promises';
import os from 'os';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 8001;

// ============================
// CONEXIÓN SUPABASE
// ============================

if (!process.env.SUPABASE_DB_URL) {
    console.error("❌ SUPABASE_DB_URL no definida");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false }
});

async function query(sql, params = []) {
    const client = await pool.connect();
    try {
        return await client.query(sql, params);
    } finally {
        client.release();
    }
}

// ============================
// RED (IP LOCAL)
// ============================

const networkInterfaces = os.networkInterfaces();
let appip = null;

for (const ifaceName in networkInterfaces) {
    const iface = networkInterfaces[ifaceName].find(
        d => d.family === 'IPv4' && !d.internal
    );
    if (iface) {
        appip = iface.address;
        break;
    }
}

if (appip) {
    console.log(`App Address: http://${appip}:${port}/`);
}

// ============================
// MIDDLEWARE
// ============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'saul2905',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use((req, res, next) => {
    if (!req.session.userlogged) {
        req.session.userlogged = 4;
    }
    next();
});

// ============================
// RUTAS HTML
// ============================

app.get('/', async (req,res)=>res.send(await readFile('./public/html/inicio.html','utf-8')));
app.get('/manager', verificarAutenticacion, async (req,res)=>res.send(await readFile('./public/html/managerreportes.html','utf-8')));
app.get('/manager2', verificarAutenticacion, async (req,res)=>res.send(await readFile('./public/html/manageranuncios.html','utf-8')));
app.get('/manager3', verificarAutenticacion, async (req,res)=>res.send(await readFile('./public/html/managerusuario.html','utf-8')));
app.get('/about', async (req,res)=>res.send(await readFile('./public/html/about.html','utf-8')));
app.get('/inicio', async (req,res)=>res.send(await readFile('./public/html/inicio.html','utf-8')));
app.get('/iniciosesion', async (req,res)=>res.send(await readFile('./public/html/iniciosesion.html','utf-8')));
app.get('/reportes', verificarAutenticacion, async (req,res)=>res.send(await readFile('./public/html/reportes.html','utf-8')));
app.get('/anuncios', verificarAutenticacion, async (req,res)=>res.send(await readFile('./public/html/anuncios.html','utf-8')));
app.get('/mapa', verificarAutenticacion, async (req,res)=>res.send(await readFile('./public/html/mapa.html','utf-8')));
app.get('/registro', async (req,res)=>res.send(await readFile('./public/html/registro.html','utf-8')));

// ============================
// LOGIN
// ============================

app.post('/enviarDatos', async (req,res)=>{
    const { getuser, getpassword } = req.body;

    const result = await query('SELECT * FROM usuarios');

    let bol = 0;

    for (let u of result.rows) {
        if (u.email === getuser && u.password === getpassword) {
            if (u.permiso) {
                bol = 1;
                req.session.userlogged = u.id;
                return res.json(bol);
            }
            bol = 2;
            return res.json(bol);
        }
    }

    res.json(bol);
});

// ============================
// REGISTRO
// ============================

app.post('/registrarUsuario', async (req,res)=>{
    const { getname1, getuser1, getpassword1 } = req.body;

    const check = await query(
        'SELECT COUNT(*) FROM usuarios WHERE email=$1',
        [getuser1]
    );

    if (parseInt(check.rows[0].count) > 0) {
        return res.json(2);
    }

    await query(
        'INSERT INTO usuarios (name,email,password,rol_id,permiso) VALUES ($1,$2,$3,0,false)',
        [getname1,getuser1,getpassword1]
    );

    res.json(1);
});

// ============================
// ANUNCIOS
// ============================

app.get('/api/anuncios', async (req,res)=>{
    const r = await query(`
        SELECT anuncios.*, usuarios.name, lugar.aula,
        (SELECT COUNT(id) FROM anuncios) AS total
        FROM anuncios
        JOIN usuarios ON anuncios.user_id = usuarios.id
        JOIN lugar ON anuncios.lugar_id = lugar.id;
    `);

    req.session.numeroids = r.rows[0]?.total || 0;
    res.json(r.rows);
});

app.post('/enviarAnuncio', async (req,res)=>{
    const { titulo, reporte, fecha, lugar } = req.body;

    await query(
        `INSERT INTO anuncios (nombre,descripcion,fecha,vigencia,lugar_id,user_id)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [titulo,reporte,fecha,2,lugar,req.session.userlogged]
    );

    res.json(1);
});

// ============================
// REPORTES
// ============================

app.get('/api/reportes', async (req,res)=>{
    const r = await query(`
        SELECT reportes.*, usuarios.name, lugar.aula,
        (SELECT COUNT(id) FROM reportes) AS total
        FROM reportes
        JOIN usuarios ON reportes.user_id = usuarios.id
        JOIN lugar ON reportes.lugar_id = lugar.id;
    `);

    req.session.numberofids = r.rows[0]?.total || 0;
    res.json(r.rows);
});

app.post('/enviarReporte', async (req,res)=>{
    const { titulo,reporte,urgencia,fecha,lugar,problema } = req.body;

    await query(
        `INSERT INTO reportes
        (nombre,descripcion,fecha,urgencia,vigencia,tipo_reporte,lugar_id,user_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [titulo,reporte,fecha,urgencia,2,problema,lugar,req.session.userlogged]
    );

    res.json(1);
});

// ============================
// UPDATE ESTADOS
// ============================

app.post('/api/update-report', async (req,res)=>{
    const { reportId,newVigencia } = req.body;

    await query(
        'UPDATE reportes SET vigencia=$1 WHERE id=$2',
        [newVigencia,reportId]
    );

    res.json({message:'Report updated successfully'});
});

app.post('/api/update-anuncios', async (req,res)=>{
    const { reportId,newVigencia } = req.body;

    await query(
        'UPDATE anuncios SET vigencia=$1 WHERE id=$2',
        [newVigencia,reportId]
    );

    res.json({message:'Report updated successfully'});
});

// ============================
// ROLES Y PERMISOS
// ============================

app.get('/api/roles', async (req,res)=>{
    const r = await query(
        'SELECT rol_id FROM usuarios WHERE id=$1',
        [req.session.userlogged]
    );
    res.json({rolId: r.rows.map(x=>x.rol_id)});
});

app.get('/api/verificacion', async (req,res)=>{
    const r = await query(
        'SELECT permiso FROM usuarios WHERE id=$1',
        [req.session.userlogged]
    );
    res.json({permisoid: r.rows.map(x=>x.permiso)});
});

// ============================
// USUARIOS
// ============================

app.get('/api/usuarios', async (req,res)=>{
    const r = await query(`
        SELECT usuarios.id,usuarios.name,usuarios.email,
               usuarios.permiso,usuarios.rol_id,
               roles.descripcion AS rol
        FROM usuarios
        JOIN roles ON usuarios.rol_id = roles.id
        ORDER BY usuarios.id DESC;
    `);

    res.json(r.rows);
});

app.post('/api/update-user1', async (req,res)=>{
    const { userId,newRol } = req.body;

    await query(
        'UPDATE usuarios SET rol_id=$1 WHERE id=$2',
        [newRol,userId]
    );

    res.json({success:true});
});

app.post('/api/update-user2', async (req,res)=>{
    const { userId,newPermiso } = req.body;

    await query(
        'UPDATE usuarios SET permiso=$1 WHERE id=$2',
        [newPermiso,userId]
    );

    res.json({success:true});
});

// ============================
// NOTIFICACIONES
// ============================

app.get('/contarReportes', async (req,res)=>{
    const r = await query('SELECT COUNT(id) AS total FROM reportes');
    const bol = r.rows[0].total > req.session.numberofids ? 1 : 0;
    res.json(bol);
});

app.get('/contarAnuncios', async (req,res)=>{
    const r = await query('SELECT COUNT(id) AS total FROM anuncios');
    const bol = r.rows[0].total > req.session.numeroids ? 1 : 0;
    res.json(bol);
});

// ============================
// MAPA
// ============================

app.get('/api/mapa', async (req,res)=>{
    const r = await query(`
        SELECT reportes.*, lugar.*
        FROM reportes
        JOIN lugar ON reportes.lugar_id = lugar.id;
    `);
    res.json(r.rows);
});

app.get('/api/mapa2', async (req,res)=>{
    const r = await query(`
        SELECT anuncios.*, lugar.*
        FROM anuncios
        JOIN lugar ON anuncios.lugar_id = lugar.id;
    `);
    res.json(r.rows);
});

// ============================
// SELECTOR LUGARES
// ============================

app.get('/api/selector', async (req,res)=>{
    const r = await query('SELECT id,aula FROM lugar');
    res.json(r.rows);
});

// ============================
// LOGOUT
// ============================

app.post('/api/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciosesion');
    });
});

// ============================
// AUTH
// ============================

function verificarAutenticacion(req,res,next){
    if(req.session.userlogged){
        next();
    } else {
        res.redirect('/iniciosesion');
    }
}

// ============================
// SERVER
// ============================

app.listen(port,'0.0.0.0',()=>{
    console.log(`🚀 Servidor en http://localhost:${port}`);
});