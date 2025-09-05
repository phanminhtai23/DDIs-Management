import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.callbacks import EarlyStopping
import matplotlib.pyplot as plt

# ✅ Chỉ sử dụng GPU 1 (nếu bạn có nhiều GPU)
gpus = tf.config.list_physical_devices('GPU')
if len(gpus) > 1:
    try:
        tf.config.set_visible_devices(gpus[1], 'GPU')  # Sử dụng GPU số 1
        tf.config.experimental.set_memory_growth(gpus[1], True)
        print("✅ Using GPU 1:", gpus[1])
    except RuntimeError as e:
        print(e)
elif gpus:
    print("✅ Using GPU:", gpus[0])
else:
    print("⚠ No GPU found. Training will use CPU.")

# ✅ Dùng chiến lược phân tán để tối ưu GPU
strategy = tf.distribute.MirroredStrategy()

# ✅ Xây dựng mô hình trong scope của strategy
with strategy.scope():
    def build_orientation_model():
        model = Sequential([
            Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            MaxPooling2D((2, 2)),
            Conv2D(64, (3, 3), activation='relu'),
            MaxPooling2D((2, 2)),
            Flatten(),
            Dense(128, activation='relu'),
            Dense(1, activation='sigmoid')  # 2 lớp: 0° (0) và 180° (1)
        ])
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model


# ✅ Load tập dữ liệu từ thư mục
def load_train_data(train_dir, batch_size=32):
    train_dataset = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=(224, 224),
        batch_size=batch_size,
        label_mode='binary'
    )

    normalization_layer = tf.keras.layers.Rescaling(1. / 255)
    train_dataset = train_dataset.map(lambda x, y: (normalization_layer(x), y))

    # ✅ Tối ưu pipeline dữ liệu
    train_dataset = train_dataset.cache().prefetch(buffer_size=tf.data.AUTOTUNE)

    return train_dataset


# ✅ Huấn luyện mô hình
def train_model(model, train_dataset, epochs=50, use_early_stopping=True):
    callbacks = []
    if use_early_stopping:
        early_stopping = EarlyStopping(
            monitor='accuracy',
            patience=3,
            restore_best_weights=True
        )
        callbacks.append(early_stopping)

    history = model.fit(
        train_dataset,
        epochs=epochs,
        callbacks=callbacks
    )
    return history


# ✅ Vẽ biểu đồ kết quả huấn luyện
def plot_training_results(history):
    plt.figure(figsize=(12, 5))

    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.title('Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.title('Accuracy')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()

    plt.show()


# ✅ Chạy huấn luyện
if __name__ == "__main__":
    train_dir = "datatrain"
    train_dataset = load_train_data(train_dir)
    model = build_orientation_model()
    num_epochs = 30
    history = train_model(model, train_dataset, epochs=num_epochs, use_early_stopping=True)
    model.save("orientation_model.h5")
    plot_training_results(history)
