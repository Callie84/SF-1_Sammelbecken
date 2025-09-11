import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models

# Pfade
DATA_DIR = os.getenv('TRAINING_DATA_DIR', 'uploads/diagnose')
MODEL_DIR = os.getenv('MODEL_DIR', 'ml/models')
EPOCHS = int(os.getenv('EPOCHS', '10'))

def build_model(num_classes):
    model = models.Sequential([
        layers.Input(shape=(224, 224, 3)),
        layers.Conv2D(32, 3, activation='relu'),
        layers.MaxPooling2D(),
        layers.Conv2D(64, 3, activation='relu'),
        layers.MaxPooling2D(),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dense(num_classes, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def train():
    classes = os.listdir(DATA_DIR)
    num_classes = len(classes)
    datagen = ImageDataGenerator(validation_split=0.2, rescale=1./255)
    train_gen = datagen.flow_from_directory(DATA_DIR, target_size=(224,224), batch_size=32, subset='training')
    val_gen = datagen.flow_from_directory(DATA_DIR, target_size=(224,224), batch_size=32, subset='validation')

    model = build_model(num_classes)
    model.fit(train_gen, epochs=EPOCHS, validation_data=val_gen)

    os.makedirs(MODEL_DIR, exist_ok=True)
    model.save(os.path.join(MODEL_DIR, 'diagnose_model.h5'))
    print("Modelltraining abgeschlossen und gespeichert.")

if __name__ == '__main__':
    train()