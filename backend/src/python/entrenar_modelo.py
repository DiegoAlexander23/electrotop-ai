import pandas as pd
import spacy
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

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

def procesar_mensaje(mensaje):
    doc = nlp(mensaje.lower())

    palabras = []

    for palabra in doc:
        lema = palabra.lemma_.lower()
        lema = correcciones.get(lema, lema)

        if lema not in stopwords:
            palabras.append(lema)

    return " ".join(palabras)

datos = pd.read_csv("mensajes.csv")

X_original = datos["mensaje"]
y = datos["categoria"]

X = X_original.apply(procesar_mensaje)

X_entrenamiento, X_prueba, y_entrenamiento, y_prueba = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

vectorizador = TfidfVectorizer()

X_entrenamiento_tfidf = vectorizador.fit_transform(X_entrenamiento)

X_prueba_tfidf = vectorizador.transform(X_prueba)

modelo = LogisticRegression(max_iter=1000)

modelo.fit(X_entrenamiento_tfidf, y_entrenamiento)

predicciones = modelo.predict(X_prueba_tfidf)

print("\nPalabras aprendidas por TF-IDF:")
print(vectorizador.get_feature_names_out()) 

print("\nCategorías aprendidas:")
print(modelo.classes_)

print("Precisión:", accuracy_score(y_prueba, predicciones))

print("\nReporte de clasificación:")
print(classification_report(y_prueba, predicciones))

resultados = pd.DataFrame({
    "mensaje": X_original.loc[X_prueba.index],
    "mensaje_procesado": X_prueba,
    "real": y_prueba,
    "prediccion": predicciones
})

print("\nResultados de las pruebas:")
print(resultados.to_string(index=False))

print("Modelo entrenado correctamente")

joblib.dump({
    "modelo": modelo,
    "vectorizador": vectorizador
}, "modelo_asistencia.joblib")

print("Modelo guardado correctamente")