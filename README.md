# AI Podcast Platform

This repository contains the code for an AI-powered SaaS platform that allows users to create, discover, and enjoy podcasts. Featuring advanced AI functionalities like text-to-audio conversion and AI-generated podcast content, this platform also includes a modern user interface for a smooth experience.

---

## 📋 Table of Contents

-   🤖 [Introduction](#introduction)
-   ⚙️ [Tech Stack](#tech-stack)
-   🔋 [Features](#features)
-   🤸 [Quick Start](#quick-start)
-   🔗 [Assets](#assets)
-   🚀 [More](#more)
-   🚨 [Tutorial](#tutorial)

---

## 🤖 Introduction

This AI Podcast platform enables users to:

-   Create podcasts with AI-generated voices.
-   Convert text to audio with multiple AI voices.
-   Seamlessly explore and play podcasts.

Built with cutting-edge tools and an intuitive interface, this platform brings a modern podcast experience to users.

---

## ⚙️ Tech Stack

-   **Next.js**: For the front-end and server-side rendering.
-   **TypeScript**: Strongly typed JavaScript.
-   **Convex**: For data persistence and real-time database functionality.
-   **OpenAI**: For text-to-audio and other AI functionalities.
-   **Clerk**: Secure authentication and user management.
-   **ShadCN**: For building modern UI components.
-   **Tailwind CSS**: For styling.

---

## 🔋 Features

-   **Robust Authentication**: Secure login and registration with Clerk.
-   **Modern Home Page**: Showcases trending podcasts with a sticky player for continuous listening.
-   **Discover Podcasts Page**: Explore new and popular podcasts.
-   **Full Search Functionality**: Easily find podcasts using various filters.
-   **Create Podcast Page**: Convert text to audio, generate AI images for podcast thumbnails, and preview podcasts before publishing.
-   **Multi-Voice AI Support**: Choose from multiple AI-generated voices for dynamic podcast creation.
-   **Profile Page**: Manage all created podcasts, with options to edit or delete.
-   **Podcast Details Page**: View podcast details like creator, listeners, and transcripts.
-   **Podcast Player**: Includes backward/forward controls, mute/unmute features, and seamless playback.
-   **Responsive Design**: Optimized for all devices and screen sizes.

---

## 🤸 Quick Start

### Prerequisites

Before setting up the project, ensure that you have the following installed:

-   **Git**
-   **Node.js**
-   **npm** (Node Package Manager)

### Cloning the Repository

To get started, clone this repository:

```bash
git clone https://github.com/thecreatortech/EchoHub
cd EchoHub
```

### Installation

Install the necessary dependencies:

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```bash
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL='/sign-in'
NEXT_PUBLIC_CLERK_SIGN_UP_URL='/sign-up'
```

Replace the placeholder values with your actual credentials from Convex and Clerk.

### Running the Project

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the project.

---

## 🔗 Assets

Assets for the project (images, icons, etc.) are available in the `public` directory.

---
