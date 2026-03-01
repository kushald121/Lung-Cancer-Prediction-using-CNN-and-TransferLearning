# Deployment Guide: Lung Cancer Prediction App

This guide explains how to deploy your project to **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites
- A GitHub account with this project pushed to a repository.
- Accounts on [Render](https://render.com/) and [Vercel](https://vercel.com/).

---

## 1. Deploy the Backend (Render)

1.  **Log in** to Render and click **"New +"** > **"Blueprint"**.
2.  **Connect** your GitHub repository.
3.  Render will automatically detect the `backend/render.yaml` file.
4.  Follow the prompts to create the service.
5.  **Important:** Once the deployment is finished, copy your service's URL (e.g., `https://lung-cancer-prediction-api.onrender.com`).

---

## 2. Deploy the Frontend (Vercel)

1.  **Log in** to Vercel and click **"Add New"** > **"Project"**.
2.  **Connect** your GitHub repository.
3.  In the **Configure Project** step:
    - **Framework Preset:** Select `Vite`.
    - **Root Directory:** Set this to `frontend`.
4.  Expand **Environment Variables** and add:
    - **Key:** `VITE_API_URL`
    - **Value:** Paste your Render service URL (e.g., `https://lung-cancer-prediction-api.onrender.com`).
5.  Click **Deploy**.

---

## 3. Final Step: Secure CORS

1.  Copy your **Vercel Frontend URL** (e.g., `https://lung-cancer-prediction-app.vercel.app`).
2.  Go back to your **Render Service** dashboard.
3.  Navigate to **Environment Settings**.
4.  Update the `CORS_ORIGINS` variable:
    - Change it from `*` to your Vercel URL (e.g., `https://lung-cancer-prediction-app.vercel.app`).
5.  Render will automatically redeploy with the restricted CORS settings.

---

### Troubleshooting
- **Build Fails:** Ensure you have pushed both the `backend/` and `frontend/` directories to your GitHub repository.
- **API Error:** Double-check that `VITE_API_URL` correctly matches your Render URL and that there is no trailing slash.
