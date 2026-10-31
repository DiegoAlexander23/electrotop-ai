# Módulo de Procesamiento de Lenguaje Natural (PLN)

Este módulo utiliza Python y técnicas de Procesamiento de Lenguaje Natural para clasificar los mensajes recibidos por WhatsApp en tres categorías:

- `entrada`: mensajes relacionados con el ingreso del practicante.
- `salida`: mensajes relacionados con la finalización de su jornada.
- `otro`: mensajes que no corresponden a una marcación de asistencia.

El modelo se ejecuta desde el backend de Node.js y devuelve el resultado en formato JSON.

## 1. Requisitos

Antes de comenzar, se necesita:

- Windows 10 o Windows 11.
- Python 3.13.
- pip (administrador de paquetes de Python).
- Los archivos del módulo descargados desde el repositorio.

## 2. Archivos del módulo

La carpeta debe contener los siguientes archivos:

```text
python/
├── predecir_mensaje.py
├── modelo_asistencia.joblib
├── requirements.txt
└── README.md
```

El archivo `modelo_asistencia.joblib` contiene el modelo entrenado y el vectorizador necesarios para realizar las predicciones.

El entorno virtual `venv/` se crea durante la instalación y no se incluye en el repositorio.

## 3. Crear el entorno virtual

Desde la carpeta `backend` del proyecto, ejecutar:

```bash
py -3.13 -m venv src/python/venv
```

Esto crea un entorno virtual independiente para instalar las dependencias del módulo.

## 4. Activar el entorno virtual

En PowerShell, ejecutar:

```powershell
.\src\python\venv\Scripts\Activate.ps1
```

Si se utiliza CMD, ejecutar:

```cmd
src\python\venv\Scripts\activate.bat
```

## 5. Instalar las dependencias

Con el entorno virtual activado, ejecutar:

```bash
pip install -r src/python/requirements.txt
```

Después, instalar el modelo de idioma español utilizado por spaCy:

```bash
python -m spacy download es_core_news_sm
```

## 6. Probar el clasificador

Desde la carpeta `backend`, ejecutar:

```bash
.\src\python\venv\Scripts\python.exe .\src\python\predecir_mensaje.py "Buenos días, ya llegué a la tienda."
```

El programa debe devolver un resultado JSON similar a este:

```json
{"categoria": "entrada"}
```

También se pueden probar mensajes de salida y otros mensajes para comprobar las diferentes categorías.

## 7. Integración con Node.js

El backend ejecuta el script `predecir_mensaje.py` mediante `child_process` y recibe su respuesta en formato JSON.

La ruta del intérprete Python utilizada por el backend es:

```text
./src/python/venv/Scripts/python.exe
```

La ruta del script de clasificación es:

```text
./src/python/predecir_mensaje.py
```

Por ello, el backend debe ejecutarse desde su propia carpeta para que estas rutas relativas funcionen correctamente.

## 8. Consideraciones

- No eliminar `modelo_asistencia.joblib`, ya que es necesario para realizar las predicciones.
- No subir la carpeta `venv/` al repositorio.
- Si se agregan nuevas librerías al módulo, actualizar `requirements.txt`.
- La clasificación es una predicción del modelo y puede presentar errores; por ello, los resultados deben validarse antes de considerarlos registros definitivos de asistencia.