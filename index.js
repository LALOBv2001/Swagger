const express = require('express')
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { SwaggerTheme } = require('swagger-themes');
const redoc = require('redoc-express');
//Thema swagger json
const theme = new SwaggerTheme('v3');

const options = {
  explorer: true,
  customCss: theme.getBuffer('Monokai')
};

const ContenidoReadme = fs.readFileSync(path.join(__dirname)+'/README.md',{encoding:'utf8',flag:'r'})
const apidef_string = fs.readFileSync(path.join(__dirname)+'/APIdef.json',{encoding:'utf8',flag:'r'})
const apidef_objeto = JSON.parse(apidef_string)
apidef_objeto.info.description=ContenidoReadme;



const swaggerOptions = {
  definition: apidef_objeto,
  apis: [`${path.join(__dirname,"./index.js")}`],
};
let redocTheme_objeto = JSON.parse(apidef_string)

app.use(express.json())
app.use(express.text());
app.use(cors());


 /**
 * @swagger
 * /vuelo:
 *  get:
 *    tags:
 *      - vuelo
 *    summary: Consultar todos los vuelos
 *    description: Petición Get a la ruta de vuelos
 *    responses:
 *      200:
 *        description: Devuelve todos los vueos de la base de datos en un json
 */

/*Para acceder a paramtros se utilizan dos puntos : 

Parametro en la ruta*/
app.get('/vuelo/', async (req, res) => {
  // console.log(req.params.carrera)
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "basewebvuelo",
  });
  // query database
  const [rows, fields] = await connection.execute("SELECT * FROM vuelo");
  // res.jsonp({alumnos:'Peticion get a la ruta de alumnos '+req.params.carrera})
  res.json(rows);
});
//Parametro en la ruta*/

 /**
 * @swagger
 * /vuelo:
 *   post:
 *     tags:
 *       - vuelo
 *     summary: Registrar un vuelo
 *     description: Petición Post a la ruta de vuelos para ingresar un nuevo registro
 *     requestBody:
 *       description: Crea un nuevo vuelo
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/vuelo-post'
 *     responses:
 *       200:
 *         description: Vuelo insertado con éxito
 */
app.post("/vuelo", async (req, res) => {
  // console.log(req.params.carrera)
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "basewebvuelo",
  });
  // query database
  const {
    ID,
    NombrePiloto,
    NombreCopiloto,
    CapacidadPasajeros,
    CapacidadGalonesCombustible,
    PaisDespegue,
    PaisAterrizaje,
    CostoBoleto,
    CapacidadEquipajePasajero,
    DuracionVueloHoras,
  } = req.body;
  let sentencia = `insert into vuelo values('${ID}','${NombrePiloto}','${NombreCopiloto}','${CapacidadPasajeros}','${CapacidadGalonesCombustible}','${PaisDespegue}','${PaisAterrizaje}','${CostoBoleto}','${CapacidadEquipajePasajero}','${DuracionVueloHoras}')`;
  await connection.execute(sentencia);
  //   const [rows, fields] = await connection.execute(sentencia);
  // res.jsonp({alumnos:'Peticion get a la ruta de alumnos '+req.params.carrera})
  // res.json(rows);
  // if (rows.affectedRows==1){
  res.json({ estatus: "Insercion realizada con exito del vuelo del capitan "+NombrePiloto });
  // }
});
/**
 * @swagger
 * /vuelo/{id}:
 *  get:
 *    tags:
 *      - vuelo
 *    summary: Busca un vuelo por su numero de id
 *    description: Petición Get
 *    parameters:
 *      - name: id
 *        in: path
 *        description: id del vuelo a consultar
 *        required: true
 *    responses:
 *      200:
 *        description: Regresa el vuelo solicitado
 *      400:
 *        description: No se encontro el vuelo solicitado
 */
app.get('/vuelo/:id',async(req,res)=>{
   const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'basewebvuelo'});
// query database
  const [rows, fields] = await connection.execute('SELECT * FROM vuelo where id = ?',[req.params.id]);
  if(rows.length==0){
      res.json("registro:No se encontro usuario")
  }
  else
  res.json(rows);
})

/**
 * @swagger
 * /vuelo/{id}:
 *   delete:
 *     tags:
 *       - vuelo
 *     summary: Se borra un vuelo
 *     description: Petición Delete a la ruta de Vuelos para borrar un vuelo por medio de un id.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id del vuelo a eliminar
 *         required: true
 *     responses:
 *       200:
 *         description: Vuelo eliminado con éxito
 */
app.delete("/vuelo/:id", async (req, res) => {
  // console.log(req.params.carrera)
  const miID = req.params.id;
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "basewebvuelo",
  });
  // query database
  await connection.query("delete from vuelo where id = ?", [miID]);
  // res.json(rows);
  // if(rows.affectedRows==1){
  //     console.log("El usuario se elimino con exito")
  //     console.log("El usuario se elimino con exito")
  // }
  res.json({ estatus: "Eliminacion realizada con exito" });
  console.log("El usuario se elimino con exito");
});


/**
 * @swagger
 * /vuelo/{id}:
 *  put:
 *    tags:
 *      - vuelo
 *    summary: Actualizar vuelo
 *    description: Peticion de tipo put a la ruta de vuelo
 *    parameters:
 *      - in: path
 *        name: id
 *        description: el id del vuelo a actualizar
 *        required: true
 *    requestBody:
 *       description: Actualiza los datos de un vuelo posterior de haber ingresado el numero de vuelo junto con los campos a actualizar.
 *       content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/vuelo-put'
 *       required: true
 *    responses:
 *      200:
 *        description: Vuelo actualizado con éxito
 */
app.put("/vuelo/:id", async (req, res) => {
  const miID = req.params.id;
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "basewebvuelo",
  });
  const {
    NombrePiloto,
    NombreCopiloto,
    CapacidadPasajeros,
    CapacidadGalonesCombustible,
    PaisDespegue,
    PaisAterrizaje,
    CostoBoleto,
    CapacidadEquipajePasajero,
    DuracionVueloHoras,
  } = req.body;
  await connection.query("update vuelo set ? where id = ?", [
    {
      NombrePiloto,
      NombreCopiloto,
      CapacidadPasajeros,
      CapacidadGalonesCombustible,
      PaisDespegue,
      PaisAterrizaje,
      CostoBoleto,
      CapacidadEquipajePasajero,
      DuracionVueloHoras,
    },
    miID,
  ]);
  res.json({ estatus: "Modificacion realizada con exito" });
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs,options));
app.get("/docs.json",(req,res)=>{
  res.json(swaggerDocs);
})
app.get(
  '/redocs',
  redoc({
    title: 'API Docs',
    specUrl: '/docs.json',
    nonce: '', // <= it is optional,we can omit this key and value
    // we are now start supporting the redocOptions object
    // you can omit the options object if you don't need it
    // https://redocly.com/docs/api-reference-docs/configuration/functionality/
    redocOptions: {
      theme: redocTheme_objeto
    }
  })
);

app.use((req, res) => {
  res.status(404).json({ estado: "Ruta no encontrada" });
});

app.listen(8085, () => {
  console.log("Servidor express escuchando en el puerto 8084");
});

/**
 * @swagger
 * components:
 *   schemas:
 *     vuelo-post:
 *       type: object
 *       properties:
 *         NombrePiloto:
 *           type: string
 *           format: string
 *           example: Eduardo Perez
 *         NombreCopiloto:
 *           type: string
 *           format: string
 *           example: Jordan Diaz
 *         CapacidadPasajeros:
 *           type: integer
 *           format: int64
 *           example: 100
 *         CapacidadGalonesCombustible:
 *           type: integer
 *           format: int64
 *           example: 10
 *         PaisDespegue:
 *           type: string
 *           format: string
 *           example: Oaxaca
 *         PaisAterrizaje:
 *           type: string
 *           format: string
 *           example: Mexico
 *         CostoBoleto:
 *           type: double
 *           format: double
 *           example: 2200.99
 *         CapacidadEquipajePasajero:
 *           type: double
 *           format: double
 *           example: 22.50
 *         DuracionVueloHoras:
 *           type: integer
 *           format: int64
 *           example: 8
 *     vuelo-put:
 *       type: object
 *       properties:
 *         NombrePiloto:
 *           type: string
 *           format: string
 *           example: Eduardo Perez
 *         NombreCopiloto:
 *           type: string
 *           format: string
 *           example: Jordan Diaz
 *         CapacidadPasajeros:
 *           type: integer
 *           format: int64
 *           example: 100
 *         CapacidadGalonesCombustible:
 *           type: integer
 *           format: int64
 *           example: 10
 *         PaisDespegue:
 *           type: string
 *           format: string
 *           example: Oaxaca
 *         PaisAterrizaje:
 *           type: string
 *           format: string
 *           example: Mexico
 *         CostoBoleto:
 *           type: double
 *           format: double
 *           example: 2200.99
 *         CapacidadEquipajePasajero:
 *           type: double
 *           format: double
 *           example: 22.50
 *         DuracionVueloHoras:
 *           type: integer
 *           format: int64
 *           example: 8
 */ 
