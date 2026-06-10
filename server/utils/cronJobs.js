const cron = require('node-cron');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const cloudinary = require('cloudinary').v2; // Assuming it's configured in utils/uploadToCloudinary or main index

// Cleanup completed events older than 30 days
const setupCronJobs = () => {
    console.log("Setting up daily cleanup cron jobs...");

    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log("Running daily cleanup job for old events...");
        
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Find completed events older than 30 days
            const oldEvents = await Event.find({
                status: 'completed',
                updatedAt: { $lt: thirtyDaysAgo }
            });

            if (oldEvents.length === 0) {
                console.log("No old events to clean up today.");
                return;
            }

            for (const event of oldEvents) {
                console.log(`Deleting old event: ${event.eventName} (${event._id})`);

                // Optionally, delete image from Cloudinary if needed
                // E.g., Extract public_id from bannerUrl and cloudinary.uploader.destroy(public_id);
                // For safety, skipping actual cloudinary deletion unless public_id is explicitly stored
                
                // Delete associated registrations
                const regResult = await EventRegistration.deleteMany({ eventId: event._id });
                console.log(`Deleted ${regResult.deletedCount} registrations for event ${event._id}`);

                // Delete the event
                await Event.findByIdAndDelete(event._id);
            }

            console.log(`Successfully cleaned up ${oldEvents.length} old events.`);

        } catch (error) {
            console.error("Error in daily cleanup cron job:", error);
        }
    });
};

module.exports = setupCronJobs;
