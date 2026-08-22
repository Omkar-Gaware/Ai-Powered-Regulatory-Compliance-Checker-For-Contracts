## 📜 AI-Powered Regulatory Compliance Checker for Contracts 🚀

An **AI-powered web application** that analyzes contracts for regulatory compliance risks, extracts clauses, identifies compliance gaps, and presents the results through a modern **React.js dashboard** backed by a **FastAPI REST API**.

The project combines an existing Python-based compliance analysis pipeline with a modern React frontend for a more scalable and professional user experience.

---

## 🚀 Project Overview

Manual contract compliance review can be time-consuming, error-prone, and difficult to scale.

This project provides a web-based workflow where users can:

- 📂 Upload PDF contracts
- 🔍 Extract and analyze contract clauses
- ⚠️ Identify clause-level compliance risks
- 📜 Check compliance-related requirements such as GDPR and HIPAA
- 📊 View compliance statistics and risk summaries
- 🧩 Inspect individual clauses and findings
- 📄 Access generated reports and contract artifacts
- 🔗 Communicate with the backend through REST APIs

The frontend is built with **React + Vite + Tailwind CSS**, while the backend exposes the existing compliance pipeline through **FastAPI**.

---

## 🧠 Key Features

### Frontend

- 📂 PDF contract upload interface
- 🔄 Upload and analysis loading states
- ⚠️ User-friendly error handling
- 📊 Compliance statistics dashboard
- 🧩 Clause-level analysis
- 🚨 Risk and compliance visualization
- 📄 Compliance report view
- 📥 Generated artifact/download support
- 🔗 Centralized API service layer
- 📱 Responsive UI
- 🧪 Automated frontend tests

### Backend

- ⚡ FastAPI REST API
- 📄 PDF contract processing
- 🔍 Contract text extraction and normalization
- 🧩 Clause extraction
- 🤖 LLM-powered compliance analysis
- 📊 Run, clause, and report endpoints
- 🛡️ Error handling and fallback behavior
- 🔌 Integration with the existing Python compliance pipeline

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │  Vite + Tailwind CSS│
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Pipeline Service    │
                    │                     │
                    │ PDF Extraction      │
                    │ Text Normalization  │
                    │ Clause Extraction   │
                    │ Risk Analysis       │
                    │ Compliance Analysis │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   LLM / AI Layer    │
                    │ Groq / OpenRouter   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Results & Reports   │
                    │ Clauses / Risks     │
                    │ Compliance Reports  │
                    │ Downloadable Files  │
                    └─────────────────────┘
```

## 🧩 Project Structure

```
AI-Powered-Regulatory-Compliance-Checker-For-Contracts/
│
├── api/
│   ├── __init__.py
│   ├── main.py
│   ├── schemas.py
│   └── services/
│       ├── __init__.py
│       ├── pipeline_service.py
│       └── result_service.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClauseList.jsx
│   │   │   ├── ComplianceReport.jsx
│   │   │   ├── Downloads.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── StatsGrid.jsx
│   │   │   └── UploadPanel.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useAnalysis.js
│   │   │
│   │   ├── pages/
│   │   │   └── ComplianceDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── types/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.test.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   └── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│
├── tests/
│   └── test_api.py
│
├── src/
│   ├── clause_engine/
│   ├── risk_engine/
│   ├── contract_modification/
│   ├── regulatory/
│   ├── llm/
│   ├── integrations/
│   └── utils/
│
├── data/
├── results/
├── app.py
├── run.py
├── create_pdf.py
├── requirements.txt
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🧠 LLM Strategy

### Primary Model

* Groq – llama-3.3-70b-versatile

### Fallbacks

* OpenRouter (LLaMA 3.1 8B)
* Hard fallback JSON (never crashes)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Omkar-Gaware/Ai-Powered-Regulatory-Compliance-Checker-For-Contracts.git

cd Ai-Powered-Regulatory-Compliance-Checker-For-Contracts
```

### 2️⃣ Create Virtual Environment
Windows
```bash
python -m venv venv
venv\Scripts\activate
```
macOS / Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Install  Dependencies
## Backend
```bash
pip install -r requirements.txt
```
## Frontend
```bash
cd frontend
npm install
```
---

## 🔑 Environment Variables (`.env`)

```env
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

SENDER_EMAIL=your_email@gmail.com
EMAIL_APP_PASSWORD=your_email_app_password

SLACK_WEBHOOK_URL=your_slack_webhook_url

RAW_DIR=./data/raw
OUTPUT_DIR=./data/processed
PROCESSED_DIR=./data/processed

MAX_CHUNK_TOKENS=1500
CHUNK_OVERLAP=200
```

---

## ▶️ Running the Application

```bash
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```
Backend:
```
http://127.0.0.1:8000
```

Health check:
```bash
curl.exe http://127.0.0.1:8000/health
```
Expected response:

{"status":"ok"}

---
Start React Frontend
Open another terminal:
```bash
cd frontend
npm run dev
```
Frontend:

http://localhost:5173

---
### API Integration

The React frontend communicates with FastAPI through a centralized API service.

Main operations include:
```
    POST /api/v1/contracts/analyze
```
Upload and analyze a contract.
```
    GET /api/v1/runs/{run_id}
```
Retrieve analysis information.
```
    GET /api/v1/runs/{run_id}/clauses
```
Retrieve clause-level analysis.
```
    GET /api/v1/runs/{run_id}/report
```
Retrieve the compliance report.
```
The frontend uses the Vite proxy during development:

    React
      ↓
    /api-backend/*
      ↓
    Vite Proxy
      ↓
    FastAPI :8000
```
---
### 🧪 Testing
Frontend Tests
From the frontend directory:
```bash
npm test
```
The frontend includes tests for the main upload → analysis → results workflow and API error handling.

Production Build
```bash
npm run build
```
A successful production build verifies that the React application can be compiled for deployment.

Backend API Health Check
```bash
curl.exe http://127.0.0.1:8000/health
```
Expected:
```json
{"status":"ok"}
```
---

### 📊 Compliance Analysis Workflow
```
1. User uploads PDF contract
          ↓
2. React sends PDF to FastAPI
          ↓
3. FastAPI receives the contract
          ↓
4. PDF text is extracted
          ↓
5. Contract text is normalized
          ↓
6. Clauses are extracted
          ↓
7. Clauses are analyzed using LLMs
          ↓
8. Compliance risks are identified
          ↓
9. Results are stored/generated
          ↓
10. React dashboard displays results
```
---
### 🤖 LLM Strategy

The compliance pipeline supports LLM-based contract analysis.

Primary LLM Provider
```
Groq
```
Fallback Provider
```
OpenRouter
```
The application is designed to handle LLM/API failures using fallback and safe-result mechanisms where supported by the existing pipeline.


## 📊 Generated Outputs

| Output            | Purpose                              |
| ----------------- | ------------------------------------ |
| JSON reports      | Structured compliance results        |
| CSV reports       | Clause annotations and analysis data |
| TXT contract      | Processed/updated contract output    |
| PDF contract      | Generated contract document          |
| Compliance report | Overall compliance summary           |

The React dashboard provides access to applicable analysis results and downloadable artifacts returned by the backend.

---

## 🔔 Integrations

The original compliance pipeline supports integrations such as:

📧 Email notifications
🔔 Slack notifications
📊 Google Sheets audit logging

These integrations require their respective credentials/configuration and are not included as secrets in the repository.

---

## 🛡️ Reliability & Security

The project follows several development and security practices:

🔐 API keys stored in environment variables
🚫 .env excluded from Git
🚫 node_modules excluded from Git
🚫 Python virtual environment excluded from Git
🚫 Frontend build output excluded from Git
⚠️ User-friendly API error handling
🧩 Modular frontend architecture
🔗 Centralized API communication
🛡️ LLM fallback/error handling in the existing pipeline
---

### 🎯 React Frontend Highlights

The frontend was developed as a modern React application with a component-based architecture.

Key React concepts demonstrated:

Functional components
React Hooks
Custom hooks
Component composition
Controlled file upload workflow
Asynchronous API requests
Loading and error states
Conditional rendering
REST API integration
Reusable UI components
Responsive dashboard design
Automated testing
Vite development and production builds
---

### 📌 Project Status
Development Status

Frontend implementation: Complete ✅

The React frontend, FastAPI integration layer, API service layer, dashboard components, testing setup, and production build configuration have been implemented.

AI Runtime

Live AI analysis requires valid API credentials.

The repository intentionally does not contain API keys or other private credentials.
---

### 🌱 Future Enhancements
🔎 Retrieval-Augmented Generation (RAG)
📚 Additional regulations such as ISO, SOC 2, and PCI-DSS
🌍 Multilingual contract analysis
👥 Human approval workflows
☁️ Cloud deployment
🔐 Role-based authentication
📈 Advanced compliance analytics
🗂️ Contract history and version management
🧠 Improved explainability for AI-generated findings

---


### ⭐ Acknowledgements

This project combines a Python-based contract compliance pipeline with a modern React frontend and FastAPI integration layer.

The frontend modernization focuses on providing a cleaner, scalable, and portfolio-ready web interface for AI-powered contract compliance analysis.

---



## 📄 License

This project is licensed under the **MIT License**.
---

## 👥 Contributors
* **Rajeshwar Kalekar** – Project Lead & Mentor
* **Omkar Gaware** – Project Developer
* **Akshay Devdhare** – Student Developer
* **Shrikant Jadhav** – Project Developer
* Open to community contributions 🚀

Feel free to fork this repository, raise issues, or submit pull requests.

---

⭐ If you like this project, give it a star on GitHub!