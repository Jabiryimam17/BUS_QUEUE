const Heap = require("heap");

function order_users(tickets) {
    // min-heap by effective position
    const pq = new Heap((a, b) =>
        a.effective_pos !== b.effective_pos
            ? a.effective_pos - b.effective_pos
            : a.original_index - b.original_index
    );

    let q = 1; // display position (1-based)
    const orders = [];
    const n = tickets.length;

    for (let i = 0; i < n; i++) {
        const t = tickets[i];

        // Place users whose effective position is ready
        while (!pq.empty() && pq.peek().effective_pos <= q) {
            const user = pq.pop();
            orders.push({
                user_id: user.id,
                ticket_no: q++
            });
        }

        // Your core idea (this part is GOOD)
        const effective_pos = t.max_penality==true?2*n:(i + 1) + t.penalty - pq.size();

        pq.push({
            id: t.user_id,
            effective_pos
        });
    }

    // Flush remaining users
    while (!pq.empty()) {
        const user = pq.pop();
        orders.push({
            user_id: user.id,
            ticket_no: q++
        });
    }

    return orders;
}
