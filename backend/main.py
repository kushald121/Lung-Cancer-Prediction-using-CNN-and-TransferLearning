import os
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from PIL import Image
import io

app = FastAPI(title="Lung Cancer Prediction API")

# Configure CORS
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
# Use directory of this file to find weights
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEIGHTS_PATH = os.path.join(BASE_DIR, "best_model.hdf5")
IMAGE_SIZE = (350, 350)
OUTPUT_SIZE = 4
CLASS_LABELS = [
    'Adenocarcinoma',
    'Large cell carcinoma',
    'Normal',
    'Squamous cell carcinoma'
]

# Global model variable
model = None

def build_model():
    print("Building model architecture...")
    pretrained_model = tf.keras.applications.Xception(
        weights=None, 
        include_top=False, 
        input_shape=[*IMAGE_SIZE, 3]
    )
    pretrained_model.trainable = False
    
    reconstructed_model = Sequential([
        pretrained_model,
        GlobalAveragePooling2D(),
        Dense(OUTPUT_SIZE, activation='softmax')
    ])
    return reconstructed_model

@app.on_event("startup")
async def startup_event():
    global model
    if not os.path.exists(WEIGHTS_PATH):
        print(f"CRITICAL: Weights file {WEIGHTS_PATH} not found.")
        return
    
    model = build_model()
    try:
        model.load_weights(WEIGHTS_PATH)
        print("Model loaded successfully into FastAPI.")
    except Exception as e:
        print(f"Failed to load weights: {e}")

@app.get("/")
async def root():
    return {"message": "Lung Cancer Prediction API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read and preprocess the image
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        img = img.resize(IMAGE_SIZE)
        
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        predicted_class = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_class])
        
        results = []
        for i, label in enumerate(CLASS_LABELS):
            results.append({
                "label": label,
                "probability": float(predictions[0][i])
            })
            
        # Sort results by probability
        results.sort(key=lambda x: x["probability"], reverse=True)
        
        return {
            "prediction": CLASS_LABELS[predicted_class],
            "confidence": confidence,
            "all_results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
