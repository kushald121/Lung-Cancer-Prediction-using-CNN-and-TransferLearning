import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
import numpy as np
import os

# Configuration
WEIGHTS_PATH = 'best_model.hdf5'
# The saved model name might vary, let's try the one we saw earlier
# If that fails, we can check for 'best_model.hdf5'
IMAGE_SIZE = (350, 350)
OUTPUT_SIZE = 4
CLASS_LABELS = [
    'Adenocarcinoma',
    'Large cell carcinoma',
    'Normal',
    'Squamous cell carcinoma'
]

def build_model():
    print("Building model architecture...")
    pretrained_model = tf.keras.applications.Xception(
        weights=None, 
        include_top=False, 
        input_shape=[*IMAGE_SIZE, 3]
    )
    pretrained_model.trainable = False
    
    model = Sequential([
        pretrained_model,
        GlobalAveragePooling2D(),
        Dense(OUTPUT_SIZE, activation='softmax')
    ])
    return model

def load_and_preprocess_image(img_path, target_size):
    if not os.path.exists(img_path):
        print(f"Error: File {img_path} not found.")
        return None
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Rescale the image like the training images
    return img_array

def predict_lung_cancer(model, img_path):
    print(f"\nPredicting for: {img_path}")
    img_array = load_and_preprocess_image(img_path, IMAGE_SIZE)
    if img_array is None:
        return

    predictions = model.predict(img_array, verbose=0)
    predicted_class = np.argmax(predictions[0])
    confidence = predictions[0][predicted_class] * 100
    
    label = CLASS_LABELS[predicted_class] if predicted_class < len(CLASS_LABELS) else f"Unknown ({predicted_class})"
    
    print(f"Result: {label}")
    print(f"Confidence: {confidence:.2f}%")

if __name__ == "__main__":
    if not os.path.exists(WEIGHTS_PATH):
        print(f"Error: Weights file {WEIGHTS_PATH} not found.")
    else:
        model = build_model()
        print(f"Loading weights from {WEIGHTS_PATH}...")
        try:
            model.load_weights(WEIGHTS_PATH)
            print("Weights loaded successfully.")
            
            # Test on some local images
            sample_images = [
                'dataset/test/squamous.cell.carcinoma/000108 (3).png',
                'dataset/test/adenocarcinoma/000108 (3).png',
                'dataset/test/large.cell.carcinoma/000108.png',
                'dataset/test/normal/10.png'
            ]

            for img_path in sample_images:
                predict_lung_cancer(model, img_path)
        except Exception as e:
            print(f"Failed to load weights: {e}")
