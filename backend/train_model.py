import pandas as pd
import pickle

# STEP 1: Load dataset
df = pd.read_excel("../dataset/pcos_ml_ready.xlsx")

print("Dataset Loaded Successfully")
print(df.head())

print("\nAll Columns:")
print(df.columns.tolist())

# STEP 2: Select Target and Features
y = df['pcos_label']
X = df.drop(columns=['pcos_label'], errors='ignore')

print("\nFeatures used:")
print(X.columns.tolist())

# STEP 3: Train-Test Split
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ==============================
# RANDOM FOREST MODEL
# ==============================

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

print("\nRandom Forest Model Trained Successfully")

# Predictions
y_pred = rf_model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)
print("\nAccuracy:", accuracy)

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("\nConfusion Matrix:")
print(cm)

# Classification Report
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# STEP 6: Save Model
with open("../model/pcos_model.pkl", "wb") as f:
    pickle.dump(rf_model, f)

print("\nModel Saved Successfully")

# STEP 7: Save Feature Columns
with open("../model/columns.pkl", "wb") as f:
    pickle.dump(X.columns.tolist(), f)

print("Columns Saved Successfully")