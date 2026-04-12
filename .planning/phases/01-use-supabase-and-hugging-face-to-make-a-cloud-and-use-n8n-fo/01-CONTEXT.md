# Phase 1 Context

## Decisions

- **Cloud Execution Architecture**: The platform will act as an execution cloud by leveraging Hugging Face Docker Spaces for compute and Supabase for persistence and orchestration.
- **Execution Languages Supported**: Python only. The sandbox MUST include complete support and visual rendering for graphical libraries: `turtle`, `matplotlib`, and `pygame`.
- **Container Lifecycle**: **Stateless HTTP execution**. The Next.js frontend will send the code payload to the Hugging Face Space, which instantly executes it, returns any logs/graphical outputs, and stops. This avoids tricky active session management and saves cost.
- **Code Storage Strategy**: Real-time auto-save. The student's code will automatically save to the Supabase database as they type in the browser editor.
- **n8n Notifications & Analytics**:
  - n8n will process Gmail notifications for new free class bookings.
  - n8n will also receive telemetry from student executions (e.g., repeated errors or successes) to determine if a student is "below the course, above the course, or on track" and notify the host.
- **AI Integration**: The Hugging Face API will power the built-in "help AI" directly inside the CodingCanvas cloud execution environment to assist students when they are stuck.

## Deferred Ideas
None.
