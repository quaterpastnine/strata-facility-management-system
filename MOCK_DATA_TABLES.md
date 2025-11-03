# FacMan System - Mock Data Tables

## 1. RESIDENT DATA

| Field | Value |a
|-------|-------|
| Name | Willow Legg |
| Unit | Auto Spin Door |
| Initials | WL |
| Email | willow.legg@example.com |
| Phone | (555) 987-6543 |

### Resident Statistics
| Statistic | Count |
|-----------|-------|
| Total Bookings | 2 |
| Active Move Requests | 1 |
| Maintenance Tickets | 3 |
| Pending Approvals | 1 |

---

## 2. MAINTENANCE TICKETS (3 tickets)

| ID | Title | Category | Priority | Status | Date Submitted | Location | Assigned To | Description |
|----|-------|----------|----------|--------|----------------|----------|-------------|-------------|
| MNT-001 | AC Not Working | HVAC | High | In Progress | 2024-12-10 | Auto Spin Door - Bedroom | Tech #3 - John Smith | Air conditioner in bedroom stopped cooling effectively. Makes strange rattling noise when starting up. Issue began approximately 2 days ago. |
| MNT-002 | Leaking Faucet | Plumbing | Medium | Completed | 2024-11-20 | Auto Spin Door - Kitchen | Tech #1 - Mike Johnson | Kitchen faucet has been dripping constantly for the past week. Water leak appears to be coming from the base of the faucet handle. |
| MNT-003 | Broken Door Handle | Doors/Windows | Low | Open | 2024-12-15 | Auto Spin Door - Bathroom | (Not assigned) | Bathroom door handle is loose and wobbles when turned. The screws appear to need tightening or replacement. |

### Maintenance Categories Available
- Plumbing
- Electrical
- HVAC
- Appliances
- Structural
- Doors/Windows
- Other

### Maintenance Priority Levels
- Low
- Medium
- High
- Emergency

### Maintenance Status Values
- Open
- In Progress
- Completed
- Cancelled

---

## 3. MOVE REQUESTS (1 request)

| ID | Move Type | Status | Date | Time | Duration | Loading Dock | Service Elevator |
|----|-----------|--------|------|------|----------|--------------|------------------|
| MOVE-001 | Move In | Approved | 2024-11-28 | 09:00 - 15:00 | 6 hours | Dock 1 | Yes |

### Move Request Details - MOVE-001

**Resident Information:**
- Name: Willow Legg
- Unit: Auto Spin Door
- Email: willow.legg@example.com
- Phone: (555) 987-6543

**Facilities:**
- Loading Dock: Dock 1
- Service Elevator: Yes
- Visitor Parking Bay: Bay 5
- Moving Trolleys: 3
- Access Cards Needed: 3

**Moving Company:**
- Type: Professional
- Name: Swift Movers Ltd
- Phone: (555) 123-4567
- Has Insurance: Yes

**Insurance & Deposit:**
- Resident Insurance: Yes
- Insurance Provider: InsureAll
- Policy Number: POL-2024-567890
- Deposit Amount: R500
- Deposit Paid: Yes

**Additional Details:**
- Vehicle: Large moving truck - License ABC123
- Oversized Items: Yes (King size bed, Large wardrobe)
- Terms Accepted: Yes (2024-11-15)

**Approval:**
- Approved By: Facilities Manager - Sarah Johnson
- Approved Date: 2024-11-16
- Submitted Date: 2024-11-15

### Move Request Types
- Move In
- Move Out

### Move Request Status Values
- Pending
- Approved
- In Progress
- Completed
- Cancelled
- Rejected

---

## 4. FACILITY BOOKINGS (2 bookings)

| ID | Facility Name | Facility Type | Status | Date | Time | Duration | Guests | Special Requirements |
|----|---------------|---------------|--------|------|------|----------|--------|---------------------|
| BOOK-001 | Tennis Court 1 | Tennis Court | Confirmed | 2024-12-15 | 15:00 - 17:00 | 2 hours | 2 | Need tennis balls |
| BOOK-002 | Swimming Pool | Swimming Pool | Completed | 2024-12-05 | 14:00 - 16:00 | 2 hours | 4 | - |

### Facility Booking Details

**BOOK-001 - Tennis Court 1:**
- Resident: Willow Legg (Auto Spin Door)
- Submitted: 2024-12-01
- Confirmed: 2024-12-02
- Approved By: Facilities Manager - Sarah Johnson

**BOOK-002 - Swimming Pool:**
- Resident: Willow Legg (Auto Spin Door)
- Submitted: 2024-11-28
- Confirmed: 2024-11-29
- Completed: 2024-12-05
- Approved By: Facilities Manager - Sarah Johnson

### Facility Types Available
- Tennis Court
- Swimming Pool
- Gym
- BBQ Area
- Function Room
- Other

### Facility Booking Status Values
- Pending
- Confirmed
- In Progress
- Completed
- Cancelled
- Rejected

---

## 5. ACTIVITY HISTORY (5 activities)

| ID | Type | Title | Status | Date | Time/Assignee |
|----|------|-------|--------|------|---------------|
| ACT-001 | Booking | Tennis Court 1 | Confirmed | Dec 15, 2024 | 3:00 PM |
| ACT-002 | Maintenance | AC Not Working | In Progress | Dec 10, 2024 | Tech #3 |
| ACT-003 | Move | Move In - Auto Spin Door | Approved | Nov 28, 2024 | 9:00 AM |
| ACT-004 | Booking | Swimming Pool | Completed | Dec 5, 2024 | 2:00 PM |
| ACT-005 | Maintenance | Leaking Faucet | Completed | Nov 20, 2024 | Tech #1 |

### Activity Types
- booking
- maintenance
- move

---

## 6. SYSTEM CONFIGURATION

### ID Formats
| Entity | Format | Example |
|--------|--------|---------|
| Maintenance Ticket | MNT-XXX | MNT-001 |
| Move Request | MOVE-XXX | MOVE-001 |
| Facility Booking | BOOK-XXX | BOOK-001 |
| Activity | ACT-XXX or ACT-timestamp | ACT-001 |

### Auto-Increment Rules
- New tickets start at MNT-004
- New move requests start at MOVE-002
- New bookings start at BOOK-003
- Activities use timestamp for unique IDs

### Default Values
- New tickets default status: "Open"
- Move request deposit: R500
- Service elevator booking: Included
- Activity history limit: 20 items (oldest dropped)

---

## 7. DATA RELATIONSHIPS

```
Resident (1)
├── Maintenance Tickets (3) - MNT-001, MNT-002, MNT-003
├── Move Requests (1) - MOVE-001
├── Facility Bookings (2) - BOOK-001, BOOK-002
└── Activity History (5) - ACT-001 through ACT-005

All entities linked by:
- residentName: "Willow Legg"
- residentUnit: "Auto Spin Door"
```

---

## 8. SUMMARY STATISTICS

| Category | Total | Open/Active | Completed | Pending |
|----------|-------|-------------|-----------|---------|
| Maintenance Tickets | 3 | 2 | 1 | 0 |
| Move Requests | 1 | 0 | 0 | 0 (Approved) |
| Facility Bookings | 2 | 0 | 2 | 0 |
| **TOTAL** | **6** | **2** | **3** | **0** |

---

Generated: $(date)
Database: In-Memory (serverData.ts)
