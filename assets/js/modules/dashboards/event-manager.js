import { supabase } from "../../core/supabase-init.js";

/**
 * Fetches events based on status.
 * @param {string} status - 'pending', 'approved', 'rejected'
 * @returns {Promise<Array>} List of events
 */
export async function fetchEventsByStatus(status = 'pending') {
    console.log(`Fetching events with status: ${status}`);
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error fetching ${status} events:`, error);
        alert(`Error fetching events: ${error.message}`); // Visible feedback
        return [];
    }
    console.log(`Found ${data.length} events for status ${status}`);
    return data;
}

/**
 * Updates the status of an event.
 * @param {number} eventId 
 * @param {string} newStatus - 'approved', 'rejected'
 * @returns {Promise<boolean>} success
 */
export async function updateEventStatus(eventId, newStatus) {
    const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', eventId);

    if (error) {
        console.error(`Error updating event ${eventId} to ${newStatus}:`, error);
        alert(`Failed to update event: ${error.message}`);
        return false;
    }
    return true;
}

/**
 * Renders the list of pending events into a container.
 * @param {HTMLElement} container 
 */
export async function renderPendingEvents(container) {
    if (!container) return;

    container.innerHTML = '<div class="loader">Loading pending events...</div>';

    const events = await fetchEventsByStatus('pending');

    if (events.length === 0) {
        container.innerHTML = '<div class="no-results">No pending events.</div>';
        return;
    }

    const listHtml = events.map(event => `
        <div class="event-approval-card" id="event-${event.id}" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="margin: 0 0 0.5rem 0;">${event.title}</h4>
                    <p style="margin: 0; color: #64748b; font-size: 0.9rem;">
                        <strong>Organizer Email:</strong> ${event.organizer || 'N/A'}<br>
                        <strong>Date:</strong> ${event.date} at ${event.time}<br>
                        <strong>Location:</strong> ${event.location}
                    </p>
                    <p style="margin-top: 0.5rem; color: #334155;">${event.description}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-approve" data-id="${event.id}" 
                        style="background: #22c55e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        Approve
                    </button>
                    <button class="btn-reject" data-id="${event.id}" 
                        style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        Reject
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = listHtml;

    // Attach event listeners
    container.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (await updateEventStatus(id, 'approved')) {
                document.getElementById(`event-${id}`).remove();
                if (container.children.length === 0) {
                    container.innerHTML = '<div class="no-results">No pending events.</div>';
                }
            }
        });
    });

    container.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (confirm('Are you sure you want to reject this event?')) {
                if (await updateEventStatus(id, 'rejected')) {
                    document.getElementById(`event-${id}`).remove();
                    if (container.children.length === 0) {
                        container.innerHTML = '<div class="no-results">No pending events.</div>';
                    }
                }
            }
        });
    });
}
