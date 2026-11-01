# Contributing to AuthSphere

First off, thank you for considering contributing to AuthSphere! It's people like you that make AuthSphere such a great tool.

## 🛠️ Local Development

Follow these steps to spin up the entire AuthSphere ecosystem in your local environment.

### **Step 1: Repository Warm-up**

```bash
git clone https://github.com/madhav9757/AuthSphere.git
cd AuthSphere
```

### **Step 2: Core API Ignition (Backend)**

```bash
cd backend
npm install
cp .env.example .env # Configure your MongoDB URI and SMTP keys
npm run dev
```

### **Step 3: Command Center Launch (Frontend)**

```bash
cd ../frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to access the premium management dashboard.

### **Step 4: Package & Verification (Test App)**

```bash
cd ../package && npm run build
cd ../test && npm run dev
```

Visit `http://localhost:5174` to see the reference implementation in action.

## 🤝 Community & Integration Partners

AuthSphere is an evolving ecosystem. We are actively working on:

- **WebAuthn Support**: Native Passkey integration for passwordless authentication.
- **Biometric Handshakes**: Native SDK support for FaceID and TouchID.
- **Advanced Webhooks**: Dispatch identity events to your internal microservices with cryptographic signatures.
- **Multi-Region Sync**: Global identity vaults for lower latency in Europe and Asia.

## Submitting Pull Requests

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure your code lints (run `npm run lint` where applicable).
5. Issue that pull request!

## Code of Conduct

By participating in this project, you are expected to uphold general open source community standards. Be respectful, constructive, and helpful to your fellow contributors.
