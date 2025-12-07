---

# Bone Fracture Classification – Deep Learning Model & API (Hugging Face Space)

## Overview

This project provides a deep learning model for **binary classification of bone fracture from X-ray images**. It is designed as a research/educational tool to demonstrate medical image classification using EfficientNet-B0 and TensorFlow.

The model is deployed on **Hugging Face Spaces** as a lightweight inference backend with a public API. The API can be consumed directly from any frontend application (React, Vue, Next.js, web builder, mobile apps, or client-side JavaScript) without the need for a custom backend service.

> **Disclaimer**
> This model is intended only for research, experimentation, and educational demonstration.
> It is **not a medical device** and should **not be used for clinical diagnosis or medical decision-making**.

---

## Features

* Binary classification:

  * `fracture`
  * `normal`
* EfficientNet-B0 fine-tuned using transfer learning
* Trained on imbalanced dataset using class weighting
* Inference deployed using **Gradio Space**
* Public endpoint suitable for client-side consumption
* JSON response including:

  * predicted label
  * fracture probability
  * normal probability

---

## Architecture

### Model Training

* Base architecture: **EfficientNet-B0**
* Framework: **TensorFlow / Keras**
* Phases:

  1. **Feature extraction**
  2. **Fine-tuning**
* Dataset:

  * `fracture`: 2,000 images
  * `normal`: 127 images
* Image size: `224 × 224`
* Loss: `binary_crossentropy`
* Metrics: `accuracy`, `precision`, `recall`, `AUC`

### Deployment

* Model stored in `model.keras` (full architecture + weights)
* Served in Hugging Face Spaces using:

  * `gradio` interface (interactive UI + API)
  * `tensorflow-cpu`
  * `numpy`
  * `pillow`

---

## Repository Structure

```
.
├─ app.py                 # Gradio inference script
├─ model.keras            # Full TensorFlow Keras model
├─ requirements.txt       # Runtime dependencies
└─ README.md              # Documentation
```

---

## Live Demo

The deployed application can be accessed here:

```
https://huggingface.co/spaces/Dawgggggg/bone-fracture
```

Users may upload X-ray images directly in the web UI to test fracture classification.

---

## API Usage

The Space automatically exposes the prediction function as a **public HTTP endpoint**.

### Prediction Endpoint

```
POST https://dawgggggg-bone-fracture.hf.space/run/predict
```

### Expected Input

* One image file sent as `multipart/form-data`
* Example (raw fetch):

```js
const formData = new FormData();
formData.append("data", file);

const res = await fetch(
  "https://dawgggggg-bone-fracture.hf.space/run/predict",
  { method: "POST", body: formData }
);

const json = await res.json();
```

### API Response Format

```json
{
  "data": [
    {
      "predicted_label": "fracture",
      "fracture_probability": 0.9345,
      "normal_probability": 0.0655
    }
  ]
}
```

### Response Interpretation

* `predicted_label` → primary model prediction
* `fracture_probability` → probability that the image indicates a fracture
* `normal_probability` → complementary probability

---

## TypeScript Helper Example (Client-Side)

This function connects to the Space and classifies an image:

```ts
import { Client, handle_file } from "@gradio/client";

export async function classifyImage(file: File) {
  const client = await Client.connect("Dawgggggg/bone-fracture");
  const result = await client.predict("/predict", [
    handle_file(file),
  ]);

  const raw = result.data[0];
  return {
    label: raw.predicted_label,
    fracture: raw.fracture_probability,
    normal: raw.normal_probability,
  };
}
```

---

## Handling Space Sleep / Wake (Retry)

Because free Spaces may sleep when inactive, add exponential retry:

```ts
// recommended implementation with retry logic
// (see api.ts in repository for full implementation)
```

This prevents client timeout when the Space is waking up.

---

## Frontend Integration

The API allows frictionless integration with:

* React / Next.js / Vue
* Vanilla JavaScript
* Mobile apps (e.g., Flutter, React Native)
* App builders (Bubble, Appsmith, ToolJet, etc.)
* Static web apps (CDN)

No backend is required — client applications communicate directly with the Space.

---

## Gradio Backend Logic (Summary)

`app.py`:

* Loads TensorFlow model (`model.keras`)
* Preprocesses uploaded image
* Performs inference
* Returns JSON containing:

  * label
  * fracture probability
  * normal probability

---

## Requirements

```
tensorflow-cpu
numpy
pillow
gradio
```

---

## Limitations

* Dataset is imbalanced
* Not medically validated
* Results may not generalize to clinical environments
* Intended solely for research, prototyping, and academic demonstration

---

## License

This repository and model can be used for research and educational purposes.
Redistribution, clinical deployment, or diagnostic use is not permitted without explicit approval.

---
