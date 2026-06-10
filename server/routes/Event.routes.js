const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

// ─── Events Routes ───────────────────────────────────────────

// Create a new event
router.post("/create", eventController.createEvent);

// Get all published events
router.get("/", eventController.getAllEvents);

// Get a specific event's full details
router.get("/:id", eventController.getEventById);

// Fetch logged-in user's tickets
router.get("/my-tickets/:userId", eventController.getUserTickets);

// Registration Endpoints
router.post("/:id/register-free", eventController.registerFreeEvent);
router.post("/:id/register-paid-init", eventController.createPaidEventOrder);
router.post("/:id/register-paid-verify", eventController.verifyAndConfirmPaidRegistration);

// Scan Ticket Endpoint
router.post("/scan-ticket", eventController.scanTicket);

// Organizer Registrations Endpoint
router.get("/organizer-registrations/:ownerId", eventController.getOrganizerRegistrations);

module.exports = router;
