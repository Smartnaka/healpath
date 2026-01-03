# HealPath - Personal Health Guide

HealPath is a sophisticated, AI-powered health companion designed to help individuals understand their symptoms and navigate potential next steps in their care journey. Built with a "calm clinical" aesthetic, the application provides a reassuring and professional environment for health self-triage.

## 🩺 Overview

HealPath allows users to record multiple symptoms with specific details about severity, duration, and nature. Using the advanced reasoning capabilities of the Google Gemini API, it analyzes these inputs against a user's personal health profile (age, gender, medical history) to identify potential considerations and actionable care recommendations.

### Key Features

- **Symptom Analysis**: Intelligent pattern matching using Gemini 3 Pro to evaluate symptom clusters.
- **Smart Autocomplete**: A robust, fuzzy-search symptom database with typical severity and descriptions to guide accurate input.
- **Personalized Context**: Incorporates user profile data and medical history for more accurate, tailored analysis.
- **Care Navigation**: Clear, prioritized steps for home care or professional consultation.
- **History Tracking**: Securely saves past assessments locally in the browser for future reference or discussion with doctors.
- **Privacy-First**: No data is sent to external servers except for the anonymized symptom analysis; all personal profile info stays in your local storage.
- **Medical Disclaimer**: Integrated safety guardrails and "Red Flag" warnings for emergency situations.

## 🛠️ Built With

- **React**: Modern component-based architecture.
- **Tailwind CSS**: Clean, responsive, and clinical-grade UI design.
- **Google Gemini API**: Advanced AI reasoning for health pattern analysis.
- **Lucide React**: Beautiful, consistent iconography.
- **React Router**: Seamless single-page application navigation.

---

**Built by Smartnaka**

*Disclaimer: HealPath is for informational and educational purposes only. It is not a diagnostic service and does not replace professional medical advice, diagnosis, or treatment. Always consult a healthcare professional for medical concerns.*
