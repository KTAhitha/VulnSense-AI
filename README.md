# 🛡️ VulnSense AI

VulnSense AI is an AI-powered vulnerability assessment tool that combines network scanning, CVE analysis and Large Language Models to generate security insights.

## 🚀 Features

- 🔍 Nmap-based network scanning
- 🌐 Port and service discovery
- 🧩 Software version detection
- 🛡️ NVD/CVE vulnerability matching
- 🤖 AI-powered vulnerability analysis using Ollama
- 📊 Security dashboard
- 📁 Scan report history
- 🔎 Detailed security reports
- 🗄️ MongoDB report storage

## 🏗️ Architecture

Target  
↓  
Nmap Scanner  
↓  
Ports / Services / Versions  
↓  
NVD / CVE Matching  
↓  
Ollama AI Analysis  
↓  
MongoDB  
↓  
React Dashboard

## 🛠️ Technologies

### Frontend
- React
- Vite
- Axios
- CSS

### Backend
- Python
- FastAPI
- Nmap
- MongoDB
- PyMongo

### AI & Security
- Ollama
- Llama 3.2
- NVD API
- CVE
- Nmap

## 📂 Project Structure

```text
VulnSense-AI/
│
├── server/
│   ├── main.py
│   ├── scanner.py
│   ├── nvd.py
│   ├── ollama_ai.py
│   └── database.py
│
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── requirements.txt
├── .gitignore
└── README.md