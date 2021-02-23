/*
    Prueba de la mediana
*/

// nivel de significancia
let alpha = 0.025

// la tabla de contingencia es donde están las frecuencias observadas


let tabla_de_datos = [
    [75, 20],
    [76, 25],
    [80, 25],
    [74, 26],
    [60, 25],
    [65, 25],
    [70, 35],
    [67, 34],
    [70, 44],
    [76, 10],
    [50, 12],
    [55, 19],
    [75, 20],
    [76, 21],
    [78, 23],
    [81, 26],
    [50, 27],
    [52, 28],
    [64, 29],
    [66, 30]
]

// tabla de calculo de chi_critico (por razones de ejemplo no se incluyó toda la tabla)
let tabla_chi_criticos = {
    0.995: { 1: 0.000, 2: 0.010,  3: 0.072,  4: 0.207,  5: 0.412 },
    0.990: { 1: 0.000, 2: 0.020,  3: 0.115,  4: 0.297,  5: 0.554 },
    0.975: { 1: 0.001, 2: 0.051,  3: 0.216,  4: 0.484,  5: 0.831 },
    0.950: { 1: 0.004, 2: 0.103,  3: 0.352,  4: 0.711,  5: 1.145 },
    0.900: { 1: 0.016, 2: 0.211,  3: 0.584,  4: 1.064,  5: 1.610 },
    0.100: { 1: 2.706, 2: 4.605,  3: 6.251,  4: 7.779,  5: 9.236 },
    0.050: { 1: 3.841, 2: 5.991,  3: 7.815,  4: 9.488,  5: 11.070 },
    0.025: { 1: 5.024, 2: 7.378,  3: 9.348,  4: 11.143, 5: 12.833 },
    0.010: { 1: 6.635, 2: 9.210,  3: 11.345, 4: 13.277, 5: 15.086 },
    0.005: { 1: 7.879, 2: 10.597, 3: 12.838, 4: 14.860, 5: 16.750 }
}

function calcular_mediana(tabla_de_datos) {
    let arreglo = []
    // fusiono todos los datos en un unico vector
    tabla_de_datos.forEach(fila => {
        fila.forEach( valor => {
            arreglo.push(valor);
        })
    });
    // ordeno el vector
    arreglo.sort();

    let mediana = 0;
    // calculo la mediana segun si la cantidad de datos es par o impar 
    if (arreglo.length % 2 == 0) {
        let pos1 = arreglo.length / 2;
        let pos2 = pos1 - 1;
        let elem1 = arreglo[pos1];
        let elem2 = arreglo[pos2];
        mediana = (elem1 + elem2) / 2;
    } else {
        let pos_central = (arreglo.length - 1) / 2;
        mediana = arreglo[pos_central];
    }
    return mediana;
}

function generar_tabla_de_contingencia(tabla_de_datos) {
    let mediana = calcular_mediana(tabla_de_datos);
    let tabla_de_contingencia = [];
    tabla_de_contingencia.push([]); //arreglo que almacena los casos mayores que la media | pos0
    tabla_de_contingencia.push([]); //arreglo que almacena los casos menores o iguales que la media | pos1

    // creo la tabla con dos filas
    for (let k = 0; k < tabla_de_datos[0].length; k++) {
        tabla_de_contingencia[0].push(0);
        tabla_de_contingencia[1].push(0);        
    }

    // usando la comparacion mayor o menor o igual que, hago el conteo de los valores respectivos 
    for (let i = 0; i < tabla_de_datos.length; i++){
        for (let j = 0; j < tabla_de_datos[0].length; j++){
            if (tabla_de_datos[i][j] > mediana ){
                tabla_de_contingencia[0][j] += 1;
            }else if(tabla_de_datos[i][j] <= mediana){
                tabla_de_contingencia[1][j] += 1;
            }
        }
    }
    return tabla_de_contingencia;
}

// Esta es la funcion de calculo implementado con la formula de chi2 || ESPECIFICA
function calcular_chi2_calculado_formula(tabla_de_datos) {
    let n = tabla_de_datos.length * tabla_de_datos[0].length;
    let tabla_de_contingencia = generar_tabla_de_contingencia(tabla_de_datos);
    let a = tabla_de_contingencia[0][0];
    let b = tabla_de_contingencia[0][1];
    let c = tabla_de_contingencia[1][0];
    let d = tabla_de_contingencia[1][1];

    let dividendo = ( n * Math.pow( ( Math.abs(a*d - b*c) - (n/2) ), 2) ); // dividendo de la formula
    let divisor = ( a + b ) * ( c + d ) * ( a + c ) * ( b + d ); // divisor de la formula
    let chi2 = dividendo / divisor; // division realizada
    return chi2;
}

// LAS SIGUIENTES FUNCIONES SON PARA CALCULAR CHI2 USANDO LA FORMULA DE LA SUMATORIA
// ADEMAS DE GENERAR LAS TABLA DE CONTINGENCIA EXTENDIDA



// le paso la tabla de contingencia y me devuelve un arreglo con las sumas de cada fila
function sumas_de_filas(tabla_de_datos){
    let suma_de_filas = [];
    let tabla_de_contingencia = generar_tabla_de_contingencia(tabla_de_datos);
    tabla_de_contingencia.forEach(fila => {
        let suma = 0;
        fila.forEach( valor => {
            suma += valor;
        });
        suma_de_filas.push(suma);
    });
    return suma_de_filas;
}

// le paso la tabla de contingencia y me devuelve un arreglo con las sumas de cada columna
function sumas_de_columnas( tabla_de_datos ){
    let suma_de_columnas = [];
    let tabla_de_contingencia = generar_tabla_de_contingencia(tabla_de_datos);
    tabla_de_contingencia[0].forEach( columna => {
        suma_de_columnas.push(0);
    });
    tabla_de_contingencia.forEach( fila => {
        for (let i = 0; i < fila.length; i++) {
            suma_de_columnas[i] += fila[i];
        }
    });
    return suma_de_columnas;
}

// le mando un arreglo ya sea suma de filas o suma de columnas y me devuelve un unico valor sumado
function suma_total(arreglo){
    let suma = 0;
    arreglo.forEach( valor => {
        suma += valor;
    });
    return suma;
}

// genera la tabla de contingencia extendida
let generar_tabla_de_contingencia_extendida = (tabla_de_datos) => {
    let tabla_extendida = [];
    let tabla_de_contingencia = generar_tabla_de_contingencia(tabla_de_datos);
    let sumaFilas = sumas_de_filas(tabla_de_datos);
    let sumaColumnas = sumas_de_columnas(tabla_de_datos);
    let totalFilas = suma_total(sumaFilas);
    let totalColumnas = suma_total(sumaColumnas);

    
    if (totalFilas === totalColumnas) {
        for (let i = 0; i <= tabla_de_contingencia.length; i++) {
            tabla_extendida.push([]);
            for (let j = 0; j <= tabla_de_contingencia[0].length; j++) {
                if (i === tabla_de_contingencia.length && j === tabla_de_contingencia[0].length) {
                    tabla_extendida[i].push(totalFilas);
                }else if(i != tabla_de_contingencia.length && j != tabla_de_contingencia[0].length){
                    tabla_extendida[i].push(tabla_de_contingencia[i][j]);
                }else if(i === tabla_de_contingencia.length && j != tabla_de_contingencia[0].length){
                    tabla_extendida[i].push(sumaColumnas[j]);
                }else if(i != tabla_de_contingencia.length && j === tabla_de_contingencia[0].length){
                    tabla_extendida[i].push(sumaFilas[i]);
                }
            }
        }
        return tabla_extendida;
    } else {
        alert("La suma total de filas y columnas no coincide");
    }
}

// toma los valores de total columna, total fila y total suma y les aplica la formula de 
// calculo de frecuiencia esperada => FE = (TOTAL_FILA * TOTAL_COLUMNA) / TOTAL_SUMA
function calcular_frecuencia_esperada(totalColumna, totalFila, totalSuma) {
    return (totalColumna * totalFila) / totalSuma;
}

// nos genera la tabla de frecuencias esperadas teniendo como entrada la tabla de contingencia
function generar_frecuencias_esperadas(tabla_de_datos) {
    let tabla_frecuencias_esperadas = [];
    let tabla_de_contingencia = generar_tabla_de_contingencia(tabla_de_datos);
    let totalColumnas = sumas_de_columnas(tabla_de_datos);
    let totalFilas = sumas_de_filas(tabla_de_datos);
    let totalSuma = suma_total(totalColumnas);

    for (let i = 0; i < tabla_de_contingencia.length; i++) {
        tabla_frecuencias_esperadas.push([]);
        for (let j = 0; j < tabla_de_contingencia[0].length; j++) {
            let frecuencia_esperada = calcular_frecuencia_esperada(totalColumnas[j], totalFilas[i], totalSuma);
            tabla_frecuencias_esperadas[i].push(Number(frecuencia_esperada.toFixed(2))); // Redondeamos la frecuencia esperada a 2 decimales
        }        
    }
    return tabla_frecuencias_esperadas;
}

// calcular CHI teniendo como entrada la tabla_de_contingencia (frecuencias observadas)
// y usandola para genarar la tabla de frencuencias espedas
function calcular_chi2_calculado(tabla_de_datos) {
    let tabla_de_contingencia = generar_tabla_de_contingencia(tabla_de_datos);
    let frecuencias_esperadas = generar_frecuencias_esperadas(tabla_de_datos);
    let sumatoria = 0;
    for (let i = 0; i < tabla_de_contingencia.length; i++) { // sumatoria para chi calculado usando la formula de sumatoria
        for (let j = 0; j < tabla_de_contingencia[0].length; j++) {
            sumatoria += (Math.pow(tabla_de_contingencia[i][j] - frecuencias_esperadas[i][j], 2) / frecuencias_esperadas[i][j])
        }
    }
    return Number(sumatoria.toFixed(2)); // toFixed redondea a dos decimales
}


// calculo de chi2_critico basado en la tabla de chi critico
function calcular_chi2_critico(tabla_de_datos, alpha) {
    let tabla_de_contingencia = generar_tabla_de_contingencia(tabla_de_datos);
    let grado_de_libertad = calcular_grado_de_libertad(tabla_de_contingencia);
    if (grado_de_libertad > 5) {
        // si se quiere usar la tabla para calculo de chi completa deben ser agregados los valores en la tabla chi criticos
        alert("La tabla de chi critico actual, solo admite grado de libertad menores o iguales que 5"); 
        return 0;
    } else {
        return tabla_chi_criticos[alpha][grado_de_libertad];
    }
}

function calcular_grado_de_libertad(tabla_de_datos) {
    let tabla_de_contingencia = generar_tabla_de_contingencia(tabla_de_datos);
    let grado_de_libertad = (tabla_de_contingencia.length - 1)*(tabla_de_contingencia[0].length - 1)
    return grado_de_libertad;
}

// devuelve verdadero si son independientes y falso en caso contrario
function hipotesis_nula_comprobada(tabla_de_datos, alpha) {
    let chi2_calculado = calcular_chi2_calculado(tabla_de_datos);
    let chi2_critico = calcular_chi2_critico(tabla_de_datos, alpha);
    // Siguiendo la regla, si calculado es menor que critico, se conserva la hipotesis nula
    if (chi2_calculado < chi2_critico) {
        return true;
    } else {
        return false;
    }
}


// Codigo de la parte grafica (No se realiza ningun calculos)


function dibujarTabla(arreglo, idTabla, titulo) {
    let contenido = `
        <thead> 
            <tr>
                <td colspan="${arreglo[0].length}" style="text-align: center;">${titulo}</td>
            </tr>
        </thead>
        <tbody style="text-align: center;">
    `;
    arreglo.forEach( fila => {
        contenido += `<tr>`;
        fila.forEach( valor => {
            contenido += `<td style="border: solid 1px;">${valor}</td>`;
        })
        contenido += `</tr>`;
    })
    contenido += `</tbody>`;

    document.querySelector(`#${idTabla}`).innerHTML = contenido;
}

function mostrarTexto(texto, idElemento) {
    document.querySelector(`#${idElemento}`).innerHTML = texto;
}

function obtenerRespuesta(tabla_de_contingencia, alpha) {
    return (hipotesis_nula_comprobada(tabla_de_contingencia, alpha)) ? `<span style="color: blue;"> Chi2 calculado es menor que Chi2 crítico: </span> por lo tanto, las medianas <b>SI</b> son iguales` : `<span style="color: blue;"> Chi2 calculado es mayor que Chi2 crítico: </span> por lo tanto, las medianas <b>NO</b> son iguales`;
}

function ejecutarCalculo(){
    dibujarTabla(tabla_de_datos, "tabla1", "Tabla de datos");
    dibujarTabla(generar_tabla_de_contingencia(tabla_de_datos), "tabla2", "Tabla de contingencia");
    dibujarTabla(generar_tabla_de_contingencia_extendida(tabla_de_datos), "tabla3", "Tabla de contingencia extendida");
    dibujarTabla(generar_frecuencias_esperadas(tabla_de_datos), "tabla4", "Tabla de frecuencias esperadas");
    mostrarTexto(`Nivel de significancia (alpha): <span style="color: blue;">${alpha}</span>`, "texto1");
    mostrarTexto(`Grado de libertad: <span style="color: blue;">${calcular_grado_de_libertad(tabla_de_datos)}</span>`, "texto2");
    mostrarTexto(`Chi2 calculado: <span style="color: blue;">${calcular_chi2_calculado(tabla_de_datos)}</span>`, "texto3")
    mostrarTexto(`Chi2 crítico: <span style="color: blue;">${calcular_chi2_critico(tabla_de_datos, alpha)}</span>`, "texto4");
    mostrarTexto(obtenerRespuesta(tabla_de_datos, alpha), "texto5");
}