import spacy
import joblib
import sys
import json
from pathlib import Path

nlp = spacy.load("es_core_news_sm")
stopwords = nlp.Defaults.stop_words
stopwords = stopwords - {
    "me", "hasta", "no", "ir",
    "ya", "estar", "dónde", "qué"
}

correcciones = {
    "inicier": "iniciar",
    "finalicar": "finalizar",
    "comencé": "comenzar",
    "terminé": "terminar",
    "culminé": "culminar",
    "incorporer": "incorporar"
}

BASE_DIR = Path(__file__).resolve().parent

datos_modelo = joblib.load(BASE_DIR / "modelo_asistencia.joblib")

modelo = datos_modelo["modelo"]
vectorizador = datos_modelo["vectorizador"]


def procesar_mensaje(mensaje):
    doc = nlp(mensaje.lower())

    palabras = []

    for palabra in doc:
        lema = palabra.lemma_.lower()
        lema = correcciones.get(lema, lema)

        if lema not in stopwords:
            palabras.append(lema)

    return " ".join(palabras)
    


def predecir_mensaje(mensaje):
    mensaje_procesado = procesar_mensaje(mensaje)

    mensaje_tfidf = vectorizador.transform([mensaje_procesado])

    prediccion = modelo.predict(mensaje_tfidf)

    return prediccion[0]

if __name__ == "__main__":
    mensaje = sys.argv[1]

    resultado = predecir_mensaje(mensaje)

    respuesta = {
        "categoria": resultado
    }

    print(json.dumps(respuesta, ensure_ascii=False))