# Auto Credit Monitoring System - Frontend Integration Guide

## Overview

The enhanced auto credit monitoring system automatically deducts credits every 30 minutes and monitors stream inactivity. This prevents streams from running indefinitely when users leave without properly ending the stream.

## Key Features

### 1. Automatic Credit Deduction
- Credits are deducted automatically every 30 minutes
- No manual intervention required from frontend
- System handles multiple intervals if frontend is offline

### 2. Inactivity Monitoring
- Warns sellers after 10 minutes of inactivity
- Automatically ends streams after 15 minutes of inactivity
- Prevents abandoned streams from consuming credits indefinitely

### 3. Heartbeat System
- Frontend sends periodic "heartbeat" signals to show activity
- Resets inactivity timer
- Simple API call every 5-10 minutes

## Frontend Integration

### 1. Heartbeat Implementation

Add this to your livestream component:

```javascript
class LivestreamComponent {
    constructor() {
        this.heartbeatInterval = null;
        this.livestreamId = null;
        this.isStreaming = false;
    }
    
    // Start heartbeat when stream begins
    startHeartbeat(livestreamId) {
        this.livestreamId = livestreamId;
        this.isStreaming = true;
        
        // Send heartbeat every 5 minutes (300,000 ms)
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, 300000); // 5 minutes
        
        console.log('Heartbeat started for livestream:', livestreamId);
    }
    
    // Send heartbeat to server
    async sendHeartbeat() {
        if (!this.isStreaming || !this.livestreamId) {
            return;
        }
        
        try {
            const response = await fetch(`/api/livestreams/${this.livestreamId}/heartbeat/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Heartbeat sent successfully');
                
                // Update UI with current credit status
                this.updateCreditDisplay(data.remaining_credits);
            } else {
                console.error('Heartbeat failed:', response.status);
                
                // If stream was ended by server, handle it
                if (response.status === 400) {
                    const errorData = await response.json();
                    if (errorData.error.includes('not currently live')) {
                        this.handleStreamEnded('Server ended the stream');
                    }
                }
            }
        } catch (error) {
            console.error('Heartbeat error:', error);
        }
    }
    
    // Stop heartbeat when stream ends
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        this.isStreaming = false;
        console.log('Heartbeat stopped');
    }
    
    // Handle stream ended by server
    handleStreamEnded(reason) {
        this.stopHeartbeat();
        
        // Show notification to user
        this.showNotification('Stream Ended', reason, 'warning');
        
        // Redirect to dashboard or show end screen
        this.redirectToDashboard();
    }
    
    // Update credit display in UI
    updateCreditDisplay(remainingCredits) {
        const creditElement = document.getElementById('remaining-credits');
        if (creditElement) {
            creditElement.textContent = remainingCredits;
        }
        
        // Warn user if credits are low
        if (remainingCredits <= 2) {
            this.showLowCreditWarning(remainingCredits);
        }
    }
    
    // Show low credit warning
    showLowCreditWarning(credits) {
        this.showNotification(
            'Low Credits', 
            `You have only ${credits} credits remaining. Your stream will end automatically when credits run out.`,
            'warning'
        );
    }
}
```

### 2. Usage Example

```javascript
// When starting a livestream
const livestream = new LivestreamComponent();

// Start streaming
async function startStream(livestreamId) {
    try {
        // Call your existing start stream API
        const response = await fetch(`/api/livestreams/start/${livestreamId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            // Start heartbeat system
            livestream.startHeartbeat(livestreamId);
            
            console.log('Stream started successfully');
        }
    } catch (error) {
        console.error('Failed to start stream:', error);
    }
}

// When ending a livestream
async function endStream(livestreamId) {
    try {
        // Stop heartbeat first
        livestream.stopHeartbeat();
        
        // Call your existing end stream API
        const response = await fetch(`/api/livestreams/end/${livestreamId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            console.log('Stream ended successfully');
        }
    } catch (error) {
        console.error('Failed to end stream:', error);
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    livestream.stopHeartbeat();
});
```

### 3. React/Vue Integration

For React:
```jsx
import { useEffect, useRef } from 'react';

function LivestreamPage({ livestreamId }) {
    const heartbeatRef = useRef(null);
    
    useEffect(() => {
        if (livestreamId) {
            // Start heartbeat
            heartbeatRef.current = setInterval(async () => {
                await sendHeartbeat(livestreamId);
            }, 300000); // 5 minutes
        }
        
        return () => {
            // Cleanup on unmount
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
            }
        };
    }, [livestreamId]);
    
    const sendHeartbeat = async (id) => {
        // Implementation here
    };
    
    return (
        <div>
            {/* Your livestream UI */}
        </div>
    );
}
```

## API Endpoints

### Heartbeat Endpoint
```
POST /api/livestreams/{livestream_id}/heartbeat/
```

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Response:**
```json
{
    "message": "Heartbeat recorded successfully",
    "last_activity": "2025-09-01T07:05:15.041452Z",
    "remaining_credits": 4,
    "credits_consumed": 2
}
```

### Check Credits Endpoint (Optional)
```
POST /api/livestreams/{livestream_id}/check_credits/
```

**Response:**
```json
{
    "message": "Credits checked successfully",
    "livestream_ended": false,
    "remaining_credits": 4,
    "credits_consumed": 2,
    "time_until_next_deduction_minutes": 25
}
```

## Backend Monitoring

### Automatic Monitoring
The backend automatically monitors all streams. No frontend intervention required.

### Manual Monitoring Commands
```bash
# Run once
python manage.py monitor_credits --run-once

# Continuous monitoring
python manage.py monitor_credits

# Verbose output
python manage.py monitor_credits --verbose

# Custom check interval (default 5 minutes)
python manage.py monitor_credits --check-interval 180
```

### Windows Service
```powershell
# Setup automatic Windows task
.\setup_windows_task.ps1

# Run monitoring service
.\auto_credit_monitor.ps1

# Run once
.\auto_credit_monitor.ps1 -RunOnce
```

### Linux Service
```bash
# Run monitoring service
./auto_credit_monitor.sh

# Run once
./auto_credit_monitor.sh --once
```

## Configuration

### Credit Deduction Settings
In `livestreams/credit_monitor.py`:
```python
CREDIT_DEDUCTION_INTERVAL = 30  # minutes
INACTIVITY_WARNING_TIME = 10    # minutes
INACTIVITY_AUTO_END_TIME = 15   # minutes
```

### Frontend Settings
- **Heartbeat Interval**: 5 minutes (recommended)
- **Minimum Interval**: 2 minutes
- **Maximum Interval**: 10 minutes

## Troubleshooting

### Common Issues

1. **Stream ends unexpectedly**
   - Check if heartbeat is being sent
   - Verify user has sufficient credits
   - Check server logs for inactivity warnings

2. **Credits not deducted**
   - Ensure monitoring service is running
   - Check if stream status is 'live'
   - Verify time intervals are correct

3. **Heartbeat fails**
   - Check authentication token
   - Verify stream is still live
   - Check network connectivity

### Logs
Backend logs include:
- Credit deductions
- Inactivity warnings
- Stream auto-endings
- Heartbeat activity

## Best Practices

1. **Always send heartbeat** when user is actively streaming
2. **Stop heartbeat** when stream ends normally
3. **Handle server responses** for credit status updates
4. **Show warnings** when credits are low
5. **Gracefully handle** automatic stream endings
6. **Test thoroughly** with different scenarios

## Migration Notes

If upgrading from the old manual system:
1. Update frontend to include heartbeat calls
2. Remove manual `check_credits` polling (optional)
3. Set up automatic monitoring service
4. Test with low credit scenarios

The system is backward compatible - existing `check_credits` calls will still work.
