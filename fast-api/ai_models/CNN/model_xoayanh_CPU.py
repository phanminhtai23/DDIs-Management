import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.callbacks import EarlyStopping
import matplotlib.pyplot as plt


# Mô hình phát hiện hướng tài liệu (0° và 180°)
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


# Load tập dữ liệu từ thư mục
def load_train_data(train_dir, batch_size=32):
    train_dataset = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=(224, 224),  # Kích thước ảnh phù hợp với mô hình
        batch_size=batch_size,  # Batch size
        label_mode='binary'  # Phân loại nhị phân (0 hoặc 1)
    )

    # Chuẩn hóa dữ liệu
    normalization_layer = tf.keras.layers.Rescaling(1. / 255)
    train_dataset = train_dataset.map(lambda x, y: (normalization_layer(x), y))

    return train_dataset


# Huấn luyện mô hình
def train_model(model, train_dataset, epochs=50, use_early_stopping=True):
    """
    Hàm huấn luyện mô hình chỉ với tập huấn luyện.

    Args:
        model: Mô hình cần huấn luyện.
        train_dataset: Tập dữ liệu huấn luyện.
        epochs: Số epoch huấn luyện (mặc định là 50).
        use_early_stopping: Có sử dụng Early Stopping hay không (mặc định là True).

    Returns:
        history: Kết quả huấn luyện.
    """
    callbacks = []
    if use_early_stopping:
        early_stopping = EarlyStopping(
            monitor='accuracy',  # Theo dõi accuracy trên tập huấn luyện
            patience=5,  # Dừng nếu không cải thiện sau 5 epoch
            restore_best_weights=True
        )
        callbacks.append(early_stopping)

    history = model.fit(
        train_dataset,
        epochs=epochs,
        callbacks=callbacks
    )
    return history


# Vẽ biểu đồ kết quả huấn luyện
def plot_training_results(history):
    plt.figure(figsize=(12, 5))

    # Vẽ biểu đồ loss
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.title('Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()

    # Vẽ biểu đồ accuracy
    plt.subplot(1, 2, 2)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.title('Accuracy')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()

    plt.show()


# Ví dụ sử dụng
if __name__ == "__main__":
    # Định nghĩa đường dẫn tập dữ liệu
    train_dir = "datatrain"

    # Load tập dữ liệu huấn luyện
    train_dataset = load_train_data(train_dir)

    # Tạo mô hình
    model = build_orientation_model()

    # Huấn luyện với số epoch quy định
    num_epochs = 30  # Thay đổi số epoch tại đây
    history = train_model(model, train_dataset, epochs=num_epochs, use_early_stopping=True)

    # Lưu mô hình
    model.save("orientation_model_1.h5")

    # Vẽ biểu đồ kết quả huấn luyện
    plot_training_results(history)
