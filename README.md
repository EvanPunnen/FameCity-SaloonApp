# Fame City Saloon | POS & Owner Financial Intelligence

> **"Be Your Own Fame"**  
> Luxury Salon POS & Owner Analytics Application designed for Fame City Saloon.

---

## 🌟 Key Features

### 1. 📱 Tablet Barber Station (Staff Counter UI)
- **Barber Cubes / Cards**:
  - High-res barber photo with gold crown accents
  - Barber Name & Employee Badge ID (`FC-101`, `FC-102`, etc.)
  - Specialty Role (Master Barber, Beard Sculptor, Colorist, Skin Specialist)
  - Live **Today's Work Counter**: Displays cuts count and revenue generated today (e.g. `✂️ 6 Cuts • ₹2,299`)
  - Status badge: Active on duty / On Break
- **Quick POS / Service Logging Modal**:
  - Oversized touch-friendly buttons optimized for salon tablets (iPad / Android Tablet)
  - Categorized service selector: Hair Care, Beard & Shave, Color & Highlights, Skin & Facial, Head Spa, Combos
  - Multi-service cart with automatic calculations
  - **Payment Methods**:
    - **UPI / QR**: Displays Fame City dynamic QR code for instant scanning with Google Pay, PhonePe, and Paytm
    - **Cash**: Smart cash tender chips (₹500, ₹1000, ₹2000, Exact) calculating exact change to return
    - **Card**: POS swipe/tap reference
  - Client name & phone (optional quick entry)
  - Sound effect & confetti celebration upon sale completion
- **Barber Personal Day Log**:
  - Stylists can tap **"View Today's Log"** on their own cube to inspect their daily cuts, total revenue, and commission earned.
- **Thermal Receipt Modal**:
  - Instant 80mm thermal receipt format with Fame City logo, address, contact, and itemized bill
  - One-click **Print Receipt** trigger

---

### 2. 👑 Owner Intelligence Dashboard (PIN Protected)
- **Security PIN Lock**:
  - Protected by a numeric touch keypad (Default PIN: `1234`, configurable in Settings)
- **Executive Metrics**:
  - **Today's Total Sales** & Month-to-Date Gross Sales
  - **Total Cuts & Services performed**
  - **Owner Net Profit** after paying barber commissions
  - **Average Ticket Value** per customer visit
- **Payment Method Breakdown ("Payment how done")**:
  - Visual breakdown bars, percentages, and exact rupee totals for:
    - 📱 UPI / Online (GPay / PhonePe / Paytm)
    - 💵 Cash Tendered
    - 💳 Card POS
- **Barber Performance Leaderboard ("Which barber cut how many")**:
  - Detailed ranking of all stylists with medals (🥇, 🥈, 🥉)
  - Cuts performed, customer count, gross sales volume, commission %, stylist payout, and net salon contribution
  - Breakdown of top services performed by each barber
- **Daily Revenue Trend Bar Chart**:
  - Visual bar graph displaying daily sales over the week or month with peak day indicator
- **All Transactions Audit Log**:
  - Searchable by customer, receipt ID, phone, or barber
  - Filterable by payment mode and barber
  - View receipt and void/delete capabilities
  - **Export to CSV / Excel** and **Print Summary Report**
- **Salon Management**:
  - Add new barbers with custom photos, badge IDs, and commission rates
  - Add/edit salon services, categories, and prices
  - Configure Salon Name, Tagline, Phone, UPI ID, Currency (`₹`), and Owner PIN

---

## 🚀 Running the App

### Start the Local Server:
```bash
npm run dev
```
or to run the preview server:
```bash
npm run preview -- --port 3000 --host
```

### Accessing on a Tablet connected to the Salon Wi-Fi:
The server binds to `0.0.0.0` on port 3000. Open the browser on your tablet and enter the IP displayed in the terminal:
```
http://<YOUR_COMPUTER_IP>:3000/
```
*(Example: `http://192.168.1.28:3000/`)*

Tap the **Fullscreen** button in the top right corner to run it in immersive kiosk mode on the tablet counter!

---

## 🔒 Owner Access Credentials
- **Default Owner PIN**: `1234` (can be changed anytime in Owner Dashboard > Salon Settings).

---

## 💈 Links & Social
- **Google Maps**: [Fame City on Google Maps](https://maps.app.goo.gl/n9Um2shfRS3qMFbW9)
- **Instagram**: [@famecity7](https://www.instagram.com/famecity7)
