# 🛍️ CBIR E-Commerce Platform

### Content-Based Image Retrieval for E-Commerce

A full-stack e-commerce platform that allows users to search for products using images instead of traditional text-based queries.

The system uses **Deep Learning and Content-Based Image Retrieval (CBIR)** to analyze uploaded images, extract visual features using a pretrained **ResNet50** model, and retrieve visually similar products from the product catalog.

The application combines modern web development, computer vision, image retrieval, and containerization technologies.

---

## 📌 Table of Contents

1. [Overview](#-overview)
2. [Project Objectives](#-project-objectives)
3. [Main Features](#-main-features)
4. [Technology Stack](#-technology-stack)
5. [System Architecture](#-system-architecture)
6. [Project Structure](#-project-structure)
7. [CBIR Workflow](#-cbir-workflow)
8. [ResNet50 Feature Extraction](#-resnet50-feature-extraction)
9. [Similarity Calculation and Retrieval](#-similarity-calculation-and-retrieval)
10. [Database Design](#-database-design)
11. [Frontend and Backend Communication](#-frontend-and-backend-communication)
12. [API Endpoints](#-api-endpoints)
13. [Docker Environment](#-docker-environment)
14. [Installation and Setup](#-installation-and-setup)
15. [Testing and Evaluation](#-testing-and-evaluation)
16. [Development Roadmap](#-development-roadmap)
17. [Future Improvements](#-future-improvements)

---

## 📖 Overview

Traditional e-commerce platforms primarily rely on text-based search engines. Users must describe products using keywords, names, categories, or attributes.

However, users sometimes have a product image but do not know its exact name or description.

This project addresses that limitation through **Content-Based Image Retrieval (CBIR)**.

Users can upload an image of a product, and the system analyzes its visual content to identify and retrieve similar products from the catalog.

Unlike traditional CBIR approaches based exclusively on manually designed color, texture, and shape descriptors, this project uses a pretrained deep convolutional neural network: **ResNet50**.

ResNet50 extracts high-level visual representations from images. These representations are converted into numerical feature vectors that can be compared to identify visually similar products.

The platform combines:

- Full-stack e-commerce development.
- Deep learning and computer vision.
- Image feature extraction.
- Similarity computation and information retrieval.
- Docker-based development and deployment.

---

## 🎯 Project Objectives

The main objectives are:

1. Develop a complete e-commerce platform.
2. Implement image-based product search.
3. Use a pretrained ResNet50 model for visual feature extraction.
4. Preprocess images using OpenCV and Pillow.
5. Represent product images as numerical feature vectors.
6. Calculate similarity between uploaded images and catalog images.
7. Retrieve and rank the most visually similar products.
8. Provide a responsive and intuitive user interface.
9. Store application data and extracted image features using PostgreSQL.
10. Deploy the application using Docker and Docker Compose.
11. Evaluate the retrieval system using information retrieval metrics.

---

## ✨ Main Features

### E-Commerce Features

- User registration and authentication.
- User profile management.
- Product catalog.
- Product categories.
- Product details.
- Shopping cart.
- Order management.
- Product image management.
- Product administration.

### CBIR Features

- Upload an image to search for similar products.
- Image validation and preprocessing.
- Deep feature extraction using ResNet50.
- Numerical feature vector generation.
- Feature storage.
- Image similarity calculation.
- Ranking of retrieved products.
- Display of visually similar products.
- Optional filtering by category and price.

### Administration

- Django administration dashboard.
- Manage users and products.
- Manage categories.
- Manage product images.
- Manage orders.
- Manage catalog data used by the retrieval system.

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and build tool |
| Axios | HTTP communication with Django |
| Bootstrap / CSS | Responsive interface styling |

### Backend

| Technology | Purpose |
|---|---|
| Python | Main programming language |
| Django | Backend framework and business logic |
| Django REST Framework | REST API development |
| Django ORM | Database operations |
| Pillow | Image loading and manipulation |
| OpenCV | Image preprocessing |
| NumPy | Numerical computations |
| scikit-learn | Similarity calculations and retrieval utilities |

### Computer Vision and Deep Learning

| Technology | Purpose |
|---|---|
| TensorFlow / Keras | Deep learning framework |
| ResNet50 | Pretrained CNN for feature extraction |
| OpenCV | Image preprocessing |
| Pillow | Image loading and format conversion |
| NumPy | Feature vector representation |

**Selected feature extraction model: ResNet50**

ResNet50 will be used as the primary pretrained convolutional neural network. Its classification head will be removed, and Global Average Pooling will be used to obtain a **2048-dimensional feature vector** for each image.

### Database

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database |
| Django Migrations | Database schema management |

### DevOps and Development Tools

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Git | Version control |
| GitHub | Source code management |

---

## 🏗️ System Architecture

The application follows a client-server architecture.

React is responsible for the presentation layer, while Django implements the backend business logic and the core CBIR functionality.

```text
                       USER
                         |
                         v
               REACT + TYPESCRIPT
                    FRONTEND
                         |
                         |
                   HTTP / REST API
                  JSON / FormData
                         |
                         v
                DJANGO REST FRAMEWORK
                     BACKEND
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
           USERS      PRODUCTS     SEARCH
             |           |           |
             |           |           v
             |           |     IMAGE PROCESSING
             |           |           |
             |           |           v
             |           |        OPENCV
             |           |           |
             |           |           v
             |           |        RESNET50
             |           |           |
             |           |           v
             |           |    FEATURE VECTORS
             |           |           |
             |           |           v
             |           |    SIMILARITY SEARCH
             |           |           |
             +-----------+-----------+
                         |
                         v
                     DJANGO ORM
                         |
                         v
                     POSTGRESQL
```

### Architecture Responsibilities

**Frontend — React + TypeScript**

- Display the user interface.
- Handle user interactions.
- Display products and categories.
- Upload images for visual search.
- Send HTTP requests to Django.
- Display retrieved products and similarity scores.
- Handle shopping cart and checkout interfaces.

**Backend — Django + Django REST Framework**

- Handle business logic.
- Authenticate users.
- Manage products and orders.
- Receive and validate uploaded images.
- Execute the CBIR pipeline.
- Communicate with ResNet50.
- Calculate image similarities.
- Retrieve and rank matching products.
- Return results through REST API responses.

**Image Processing — ResNet50 + OpenCV**

- Preprocess uploaded images.
- Extract deep visual features.
- Generate 2048-dimensional feature vectors.
- Compare image representations.
- Support visual product retrieval.

**Database — PostgreSQL**

- Store user information.
- Store product information.
- Store categories and orders.
- Store image metadata.
- Store extracted feature vectors.

---

## 📂 Project Structure

The following is the target organization of the project:

```text
cbir-ecommerce/
│
├── backend/
│   │
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── apps/
│   │   ├── __init__.py
│   │   │
│   │   ├── users/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   │
│   │   ├── products/
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   │
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── orders/
│   │   │
│   │   ├── search/
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   │
│   │   └── image_processing/
│   │       ├── services/
│   │       │   ├── __init__.py
│   │       │   ├── preprocessing.py
│   │       │   ├── feature_extractor.py
│   │       │   ├── similarity.py
│   │       │   └── retrieval.py
│   │       │
│   │       └── apps.py
│   │
│   ├── media/
│   ├── static/
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
│
├── database/
│   └── init/
│
├── docker/
│
├── docs/
│   ├── architecture/
│   └── diagrams/
│
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
└── README.md
```

### Backend Applications

| Application | Responsibility |
|---|---|
| `users` | Authentication and user profiles |
| `products` | Product CRUD and image management |
| `categories` | Product categorization |
| `cart` | Shopping cart management |
| `orders` | Order processing |
| `search` | Image-based search API endpoints |
| `image_processing` | Image preprocessing and ResNet50 feature extraction |

### Image Processing Services

| File | Responsibility |
|---|---|
| `preprocessing.py` | Resize, normalize and prepare images |
| `feature_extractor.py` | Load ResNet50 and extract image features |
| `similarity.py` | Calculate similarity between feature vectors |
| `retrieval.py` | Retrieve and rank the most similar products |

The CBIR engine is implemented inside Django as a dedicated application. React does not execute the deep learning model; it sends images to Django and displays the returned results.

---

## 🖼️ CBIR Workflow

The core functionality of this project is Content-Based Image Retrieval.

The retrieval process consists of two main stages:

1. Catalog indexing: extracting and storing features for product images.
2. Query retrieval: extracting features from a user-uploaded image and comparing them with the catalog.

### Stage 1 — Product Catalog Indexing

Before searching, the system must prepare the product catalog.

**1. Product Image Collection**

Product images are uploaded and associated with their corresponding products.

**2. Image Preprocessing**

Each image is prepared for ResNet50:

- Validate image format.
- Convert to RGB.
- Resize to 224 × 224 pixels.
- Apply the appropriate ResNet50 preprocessing function.

**3. Feature Extraction**

The processed image is passed through the pretrained ResNet50 network.

The classification layer is removed, and Global Average Pooling produces a 2048-dimensional feature vector.

**4. Feature Storage**

The extracted vector is associated with the corresponding product image and stored for future retrieval.

### Stage 2 — User Image Retrieval

**1. Image Upload**

The user uploads an image through the React interface.

The image is transmitted to Django using HTTP multipart/form-data.

**2. Image Preprocessing**

Django validates and prepares the uploaded image using the same preprocessing pipeline used for catalog images.

**3. Feature Extraction**

ResNet50 extracts the uploaded image's 2048-dimensional feature vector.

**4. Similarity Calculation**

The query feature vector is compared against the previously extracted catalog feature vectors.

**5. Ranking**

Products are ranked according to their visual similarity to the uploaded image.

**6. Result Visualization**

Django returns the most similar products to React, which displays:

- Product image.
- Product name.
- Price.
- Similarity score.
- Product details.

---

## 🧠 ResNet50 Feature Extraction

ResNet50 is the selected deep learning architecture for the CBIR system.

It is a pretrained Convolutional Neural Network (CNN) based on residual learning.

Instead of manually defining color, texture, and shape descriptors, ResNet50 learns visual representations from image data.

### Why ResNet50?

- It is a well-established pretrained CNN architecture.
- It extracts high-level visual characteristics.
- Its residual connections help train deep neural networks.
- It can be used as a feature extractor without training a complete classification model.
- It produces fixed-length feature representations suitable for image comparison.

### Feature Extraction Architecture

The project will use ResNet50 with its original classification head removed.

```text
             INPUT IMAGE
                  |
                  v
         IMAGE PREPROCESSING
                  |
                  v
             RESNET50
          (Pretrained CNN)
                  |
                  v
         CONVOLUTIONAL LAYERS
                  |
                  v
       GLOBAL AVERAGE POOLING
                  |
                  v
       2048-D FEATURE VECTOR
                  |
                  v
          SIMILARITY SEARCH
```

### Feature Vector

With Global Average Pooling, ResNet50 produces a vector containing 2048 numerical values for each image.

Example:

```python
feature_vector = model.predict(preprocessed_image)

print(feature_vector.shape)

# Expected shape: (1, 2048)
```

The extracted feature vector represents the visual characteristics learned by the network.

The vector can then be stored and compared with other image representations.

### Important Implementation Details

- Use the same preprocessing pipeline for catalog and query images.
- Use the pretrained ResNet50 weights.
- Remove the classification head.
- Apply Global Average Pooling.
- Keep the feature extractor consistent during indexing and searching.
- Consider feature normalization before similarity calculations.

---

## 📐 Similarity Calculation and Retrieval

After extracting feature vectors, the system needs to compare them.

Each product image is represented by a 2048-dimensional vector.

The uploaded query image also produces a vector with the same dimensions.

### Cosine Similarity

Cosine similarity measures the angle between two vectors.

It is suitable for comparing image feature representations.

\[
\operatorname{similarity}(A,B)=
\frac{A\cdot B}{\|A\|\|B\|}
\]

Where:

- \(A\) is the query image feature vector.
- \(B\) is a product image feature vector.
- \(A \cdot B\) is their dot product.
- \(\|A\|\) and \(\|B\|\) are their vector magnitudes.

A higher cosine similarity generally indicates more similar feature representations.

### Other Possible Metrics

| Metric | Description |
|---|---|
| Cosine Similarity | Measures the angle between vectors |
| Euclidean Distance | Measures straight-line distance |
| Manhattan Distance | Measures absolute coordinate differences |

Cosine similarity will be the initial comparison method. Other metrics can be tested during evaluation.

### Retrieval Process

```text
UPLOADED IMAGE
       |
       v
 RESNET50 FEATURE
       |
       v
 QUERY VECTOR
       |
       v
COMPARE WITH CATALOG
   FEATURE VECTORS
       |
       v
SIMILARITY SCORES
       |
       v
   SORT RESULTS
       |
       v
    TOP 5 MATCHES
```

The initial implementation will retrieve the top 5 most similar products.

For larger catalogs, FAISS can be introduced to accelerate nearest-neighbor search.

---

## 🗄️ Database Design

PostgreSQL will be used as the main relational database.

Django ORM will manage database models, relationships, queries and migrations.

### Main Entities

| Entity | Description |
|---|---|
| User | Platform users |
| Product | Products available for purchase |
| Category | Product classifications |
| ProductImage | Images associated with products |
| ImageFeature | Extracted ResNet50 feature representations |
| Cart | User shopping cart |
| CartItem | Products and quantities inside a cart |
| Order | Customer orders |
| OrderItem | Products included in orders |

### ImageFeature

The ImageFeature entity is particularly important for the CBIR engine.

It associates an image with its extracted ResNet50 feature vector.

Conceptually, it contains:

| Attribute | Description |
|---|---|
| id | Feature record identifier |
| product_image | Associated product image |
| feature_vector | 2048-dimensional numerical representation |
| model_name | Feature extraction model, e.g. ResNet50 |
| created_at | Extraction timestamp |

Feature vectors can initially be stored using an appropriate serialized numerical representation in PostgreSQL.

FAISS or a specialized vector database can be considered later if the catalog becomes sufficiently large.

### Simplified Relationships

```text
USER
 |
 +---- CART
 |       |
 |       +---- CART_ITEM
 |
 +---- ORDER
         |
         +---- ORDER_ITEM

CATEGORY
   |
   +---- PRODUCT
             |
             +---- PRODUCT_IMAGE
                       |
                       +---- IMAGE_FEATURE
```

A product can have multiple images, and each product image can have its own extracted feature representation.

---

## 🔌 Frontend and Backend Communication

React communicates with Django through REST API endpoints implemented using Django REST Framework.

The communication uses HTTP requests.

### HTTP Methods

| Method | Purpose |
|---|---|
| GET | Retrieve information |
| POST | Create resources and upload images |
| PUT | Replace an existing resource |
| PATCH | Partially update a resource |
| DELETE | Delete resources |

### Example: Product API Response

```json
[
    {
        "id": 1,
        "name": "Nike Shoes",
        "price": "120.00",
        "image": "/media/products/nike.jpg"
    }
]
```

### Example: Image Search Request

```text
POST /api/search/image/

Content-Type: multipart/form-data

image: uploaded_image.jpg
```

React sends the image using FormData.

Django receives the file, executes the CBIR pipeline, and returns the matching products.

### Example: Image Search Response

```json
{
    "query_image": "/media/search/query.jpg",
    "results": [
        {
            "product_id": 1,
            "name": "Nike Shoes",
            "price": "120.00",
            "similarity_score": 0.94,
            "image": "/media/products/nike.jpg"
        },
        {
            "product_id": 2,
            "name": "Adidas Shoes",
            "price": "150.00",
            "similarity_score": 0.87,
            "image": "/media/products/adidas.jpg"
        }
    ]
}
```

*The scores above are illustrative examples, not measured results.*

### Example React Communication

```typescript
const searchProducts = async (image: File) => {
    const formData = new FormData();

    formData.append("image", image);

    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/search/image/`,
        formData
    );

    return response.data;
};
```

### Communication Architecture

```text
USER
 |
 v
REACT FRONTEND
 |
 | POST image using FormData
 v
DJANGO REST API
 |
 | Execute CBIR pipeline
 v
RESNET50 + SIMILARITY SEARCH
 |
 | Retrieve matching products
 v
DJANGO REST API
 |
 | Return JSON
 v
REACT FRONTEND
 |
 v
DISPLAY RESULTS
```

The frontend is responsible for displaying results. The backend is responsible for executing the actual retrieval algorithm.

CORS will be configured in Django to allow requests from the React development server.

---

## 🐳 Docker Environment

Docker Compose will manage the application's services.

### Planned Containers

| Container / Service | Technology | Port |
|---|---|---|
| frontend | React + Vite | 5173 |
| backend | Django + Python | 8000 |
| db | PostgreSQL | 5432 |

### Container Communication

```text
              BROWSER
                 |
          +------+------+
          |             |
          v             v
    REACT FRONTEND   DJANGO API
    localhost:5173   localhost:8000
                         |
                         |
                   Docker Network
                         |
                         v
                    PostgreSQL
                      db:5432
```

Important networking details:

- The browser accesses React through `localhost:5173`.
- The browser accesses Django through `localhost:8000`.
- Django connects to PostgreSQL using the Docker Compose service name `db` and port `5432`.
- React browser requests must use an address accessible to the browser, such as `http://localhost:8000/api`.
- Docker service hostnames such as `backend` and `db` are used for container-to-container communication, not directly by the user's browser.

### Persistent Storage

Docker volumes will be used to preserve:

- PostgreSQL database data.
- Uploaded product images.
- Other persistent application files when required.

---

## ⚙️ Installation and Setup

### Prerequisites

Install:

- Docker Desktop.
- Git.
- A code editor such as Visual Studio Code.

Node.js, Python and PostgreSQL do not need to be installed directly on Windows when using the Docker-based development environment.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/cbir-ecommerce.git

cd cbir-ecommerce
```

### 2. Configure Environment Variables

Copy the example environment file.

PowerShell:

```powershell
Copy-Item .env.example .env
```

CMD:

```cmd
copy .env.example .env
```

Example configuration:

```env
# Django
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=change-this-to-a-long-random-secret
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend

# PostgreSQL
POSTGRES_DB=cbir_ecommerce
POSTGRES_USER=cbir_user
POSTGRES_PASSWORD=change-this-password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Frontend
VITE_API_URL=http://localhost:8000/api
```

Never commit real secrets or production credentials to GitHub.

### 3. Build and Start Containers

```bash
docker compose up -d --build
```

### 4. Apply Database Migrations

Apply the database schema and model definitions to the PostgreSQL container:

```bash
docker compose exec backend python manage.py migrate
```

### 5. Seed the Database & Media (Data Persistence)

To populate the catalog with categories, products, and local images for CBIR extraction, you have two options:

#### Option A — Fresh Seed & Image Download (Run Once)
Fetches catalog data from DummyJSON, creates all 24 categories, 194 products with `external_id`, and downloads physical images to the local media directory (`/app/media/products/`):

```bash
# Seed all 194 products with primary images for CBIR:
docker compose exec backend python manage.py seed_dummyjson --primary-only

# Or test with the first 10 products:
docker compose exec backend python manage.py seed_dummyjson --limit 10 --primary-only
```

> **Data Persistence in Docker:**
> - Database records persist in the `postgres_data` volume across container stops and restarts.
> - Downloaded product images persist in the `media_data` volume.

#### Option B — 100% Offline Restore from Local Fixture
If you already have the repository cloned with the included fixture (`initial_products.json`), you can restore the database records without any internet connection:

```bash
docker compose exec backend python manage.py loaddata initial_products.json
```

#### Exporting / Backing Up Data
To freeze your current database records into a fresh fixture file:

```bash
docker compose exec backend python manage.py dumpdata categories products --indent 2 -o /app/apps/products/fixtures/initial_products.json
```

### 6. Create a Django Administrator

Create a superuser to access the Django administration panel:

```bash
docker compose exec backend python manage.py createsuperuser
```

### 7. Verify Database Contents

To verify that the database and images are properly stored:

```bash
# Verify product and category counts in PostgreSQL:
docker compose exec db psql -U cbir_user -d cbir_ecommerce -c "SELECT (SELECT count(*) FROM categories_category) as categories, (SELECT count(*) FROM products_product) as products, (SELECT count(*) FROM products_productimage) as images;"

# Verify image files on disk:
docker compose exec backend ls /app/media/products/
```

### 8. Access the Application

| Service | URL |
|---|---|
| React Frontend | http://localhost:5173 |
| Django Backend | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin/ |
| API | http://localhost:8000/api/ |

*These commands assume that the Dockerfiles and Docker Compose services have been configured.*

---

## 🧪 Testing and Evaluation

The project will be tested at different levels.

### Software Testing

- Backend unit tests.
- Frontend component tests.
- API integration tests.
- Database operation tests.
- Image upload validation tests.
- Docker environment testing.

### CBIR Evaluation

The retrieval system will be evaluated using information retrieval metrics.

| Metric | Purpose |
|---|---|
| Precision@K | Measures the proportion of relevant results among the top K retrieved products |
| Recall@K | Measures the proportion of relevant products retrieved among all relevant products |
| Mean Average Precision (mAP) | Evaluates ranking quality across multiple queries |
| Search Execution Time | Measures retrieval performance |

The evaluation will help determine whether the ResNet50 feature representations provide effective visual product retrieval.

---

## 🚀 Development Roadmap

The project will be developed incrementally.

### Phase 1 — Project Setup

- [ ] Initialize Git repository.
- [ ] Create Django project.
- [ ] Initialize React + TypeScript using Vite.
- [ ] Configure Docker Compose.
- [ ] Configure PostgreSQL.
- [ ] Configure Django REST Framework.
- [ ] Configure CORS.
- [ ] Test React-to-Django communication.

### Phase 2 — E-Commerce Backend

- [ ] Create users application.
- [ ] Implement authentication.
- [ ] Create product models.
- [ ] Create category models.
- [ ] Implement product CRUD.
- [ ] Implement product image uploads.
- [ ] Implement cart functionality.
- [ ] Implement order management.

### Phase 3 — E-Commerce Frontend

- [ ] Design homepage.
- [ ] Create navigation and layouts.
- [ ] Build product listing page.
- [ ] Build product details page.
- [ ] Implement authentication pages.
- [ ] Implement shopping cart.
- [ ] Implement checkout interface.
- [ ] Build product administration interface.

### Phase 4 — CBIR Implementation

- [ ] Configure TensorFlow/Keras environment.
- [ ] Load pretrained ResNet50.
- [ ] Remove the classification head.
- [ ] Configure Global Average Pooling.
- [ ] Implement image preprocessing.
- [ ] Implement 2048-dimensional feature extraction.
- [ ] Generate feature vectors for catalog images.
- [ ] Store extracted feature vectors.
- [ ] Implement cosine similarity.
- [ ] Implement product retrieval and ranking.
- [ ] Create image search API endpoint.
- [ ] Integrate CBIR results into React.

### Phase 5 — Testing and Evaluation

- [ ] Backend unit tests.
- [ ] Frontend tests.
- [ ] API integration tests.
- [ ] Image processing tests.
- [ ] CBIR accuracy evaluation.
- [ ] Precision@K and Recall@K evaluation.
- [ ] mAP calculation.
- [ ] Search performance evaluation.
- [ ] Docker deployment testing.

---

## 🔮 Future Improvements

Potential extensions include:

- Compare ResNet50 with MobileNetV2.
- FAISS-based nearest-neighbor search for larger catalogs.
- GPU acceleration where supported.
- Advanced similarity ranking.
- Search filtering by category and price.
- Search history.
- Personalized product recommendations.
- Image-based recommendations.
- Retrieval performance optimization.
- Model fine-tuning on an e-commerce product dataset.

---

## 📊 Project Scope

The project combines three main areas:

**1. Web Development**

Building a full-stack e-commerce platform using React, TypeScript, Django and PostgreSQL.

**2. Computer Vision and Deep Learning**

Using OpenCV and a pretrained ResNet50 model to extract visual feature representations from product images.

**3. Information Retrieval**

Comparing extracted feature vectors to identify, retrieve and rank visually similar products.

The objective is to demonstrate how deep learning and image retrieval techniques can improve product discovery in modern e-commerce applications.

---

## 👨‍💻 Development

This project is developed as an academic and practical software engineering project.

| Component | Technology |
|---|---|
| Project | CBIR E-Commerce Platform |
| Frontend | React + TypeScript |
| Backend | Django + Django REST Framework |
| Database | PostgreSQL |
| Deep Learning | TensorFlow / Keras |
| Feature Extraction | ResNet50 |
| Image Processing | OpenCV + Pillow |
| Numerical Computation | NumPy |
| Similarity Search | scikit-learn |
| Containerization | Docker + Docker Compose |

---

## 📄 License

This project is developed for educational and academic purposes.

A formal open-source license can be added when the project distribution terms are decided.