# Alfred Field App 🛡️

**"Cover your ass better than WhatsApp - with proof you can actually find later."**

Alfred is a specialized update tool designed for construction site teams. It bridges the gap between the informal, quick nature of WhatsApp and the structured, accountable data needs of Project Managers (PMs).

## Core Philosophy: Shield, not Shackles
Field teams adoption is the priority. Alfred succeeds only if it protects the field team from blame rather than exposing them to it. The record is their shield.

## Key Features (The "CYA" Pillars)
1. **Automatic Issue Flagging**: AI detects problems (like material delays) automatically, removing the need for teams to "rat" on suppliers.
2. **Historical Proof ("Show Timeline")**: One-tap defense with receipts for PM inquiries.
3. **Proactive Escalation**: Teams control the message before it reaches the PM.
4. **"I Told You" Search**: Instant proof in disputes with dated, searchable context.

## How it Works
1. **Input**: WhatsApp-like chat interface (Photos, Text).
2. **Magic Middle**: AI drafts structured updates from chat inputs.
3. **Review Window**: Field teams have a 2-hour window to review and approve drafts before they go to the PM.
4. **Output**: Structured, WBS-mapped data for PM dashboards.

## MVP Build Sequence
- **Phase 1**: Core Input/Output (WhatsApp UI, Photo Auto-tags, Review Screen).
- **Phase 2**: AI Structuring + CYA Features (Historical Proof, Auto-logging).
- **Phase 3**: Protection Features (Auto-flagging, Proactive Escalation).
- **Phase 4**: WBS Integration.

---

## Technical Setup
1. **Frontend**: Expo (React Native) with File-based Routing.
2. **Styling**: React Native StyleSheet (Flexbox).
3. **Navigation**: Expo Router (with `(auth)` and `(main)` groups).

## Getting Started
1. Install dependencies: `npm install`
2. Run on Android: `npm run android`
