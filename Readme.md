# 🃏 Discord Card-Bot Auto-Trade (Sofi • Karuta • Nairi)

![Node.js](https://img.shields.io/badge/Node.js-LTS-green?style=for-the-badge&logo=node.js)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-User%20Token-red?style=for-the-badge)

A powerful automation tool for Discord card games. This script manages automated trading between two user accounts (Main and Alt) to optimize farming and collection management.

---

## 🚀 Key Features

* **Multi-Bot Logic:** Supports **Sofi**, **Karuta**, and **Nairi** trade flows.
* **Dual Account Sync:** Coordinates actions between two user tokens simultaneously.
* **Smart Delays:** Uses `await delay()` to mimic human typing speeds and avoid anti-spam triggers.
* **Chalk Integration:** Beautifully color-coded terminal logs for easy monitoring.
* **Lightweight:** Minimal dependencies, high performance.

---

## 📁 Project Structure

| File | Description |
| :--- | :--- |
| `sofi.js` | Automated trade logic for the Sofi bot. |
| `nai.js` | Automated trade logic for the Nairi bot. |
| `channel.txt` | Configuration file for target Channel IDs. |
| `token.txt` | (Local Only) Your Discord User Tokens. |
| `test.js` | Script for testing connection and basic functions. |

---

## 🛠️ Setup & Installation

1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/epicgaurav0/Auto-Trade-Sofi-Karuta-Nai-Discord-Bot.git](https://github.com/epicgaurav0/Auto-Trade-Sofi-Karuta-Nai-Discord-Bot.git)
    cd Auto-Trade-Sofi-Karuta-Nai-Discord-Bot
    ```

2.  **Install Packages:**
    ```bash
    npm install
    ```

3.  **Configuration:**
    * Add your User Tokens in `token.txt`.
    * Add the trade Channel IDs in `channel.txt`.

4.  **Run the Bot:**
    ```bash
    node sofi.js  # For Sofi trades
    node nai.js   # For Nairi trades
    ```

---

## ⚠️ Safety Warnings (IMPORTANT)

> [!CAUTION]
> **Discord TOS:** Using "Self-bots" or User Tokens is against Discord's Terms of Service. Your account may get banned. Use this tool only in private servers and with reasonable delays.
> 
> **Secrets:** Never commit your `token.txt` to GitHub. Always use a `.gitignore` file to keep your tokens private.

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/epicgaurav0/Auto-Trade-Sofi-Karuta-Nai-Discord-Bot/issues).

---
**Developed by [epicgaurav0](https://github.com/epicgaurav0)**

connect with me via mail(epicgaurav554@gmail.com)