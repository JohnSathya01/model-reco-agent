# Troubleshooting Guide - Daggr Workflow Display Issues

## Issue: Blank Canvas or Nodes Not Visible

If you see the Daggr canvas but no nodes are visible (just lines/edges), try these solutions:

### Solution 1: Zoom and Pan

The nodes might be positioned off-screen. Try:

1. **Zoom out** - Use mouse wheel or the zoom controls (bottom left)
2. **Pan the canvas** - Click and drag on the canvas
3. **Reset view** - Look for a "fit to screen" or reset button

### Solution 2: Try the Simple Test Workflow

Run a minimal workflow to verify Daggr is working:

```bash
source daggr/venv/bin/activate
daggr daggr/simple_test_workflow.py
```

This should show 2 nodes clearly visible.

### Solution 3: Check Browser Console

1. Open browser developer tools (F12 or Cmd+Option+I)
2. Check the Console tab for JavaScript errors
3. Look for any red error messages

### Solution 4: Clear Browser Cache

```bash
# Clear Daggr cache
rm -rf ~/.cache/huggingface/daggr

# Then restart the workflow
source daggr/venv/bin/activate
daggr daggr/model_retraining_workflow.py
```

### Solution 5: Try Different Browser

Sometimes browser-specific issues occur. Try:
- Chrome/Chromium
- Firefox
- Safari

### Solution 6: Check Terminal Output

Look at the terminal where you ran the workflow for any error messages.

### Solution 7: Restart with Fresh Session

```bash
# Stop any running Daggr processes
pkill -f daggr

# Clear cache
rm -rf ~/.cache/huggingface/daggr

# Restart
source daggr/venv/bin/activate
daggr daggr/model_retraining_workflow.py
```

### Solution 8: Use Explicit Port

```bash
source daggr/venv/bin/activate
daggr daggr/model_retraining_workflow.py --server-port 7861
```

Then open: http://127.0.0.1:7861

## Common Issues

### Issue: "Connection Refused"
- Check if the server is actually running
- Look for error messages in terminal
- Try a different port

### Issue: Nodes Appear Then Disappear
- This might be a rendering issue
- Try refreshing the page (Cmd+R or Ctrl+R)
- Check browser console for errors

### Issue: Canvas is Completely Black
- Try zooming out (scroll wheel)
- The nodes might be very far away
- Use the zoom controls in bottom left

## Testing Steps

1. **Test simple workflow first:**
   ```bash
   daggr/venv/bin/daggr daggr/simple_test_workflow.py
   ```

2. **If simple works, try main workflow:**
   ```bash
   daggr/venv/bin/daggr daggr/model_retraining_workflow.py
   ```

3. **Check what you see:**
   - ✅ Two nodes connected by a line = Working!
   - ❌ Just lines, no nodes = Zoom/pan issue
   - ❌ Blank screen = Connection issue

## Canvas Controls

- **Zoom:** Mouse wheel or zoom buttons (bottom left)
- **Pan:** Click and drag on empty space
- **Select node:** Click on a node card
- **Run node:** Click "Run" button on node card

## Expected View

You should see:
```
┌─────────────┐        ┌─────────────┐
│   Node 1    │───────▶│   Node 2    │
│  (inputs)   │        │  (inputs)   │
│   [Run]     │        │   [Run]     │
│  (outputs)  │        │  (outputs)  │
└─────────────┘        └─────────────┘
```

## Still Not Working?

1. **Check Python version:**
   ```bash
   python3 --version
   # Should be 3.10 or higher
   ```

2. **Reinstall dependencies:**
   ```bash
   source daggr/venv/bin/activate
   pip install --upgrade daggr gradio
   ```

3. **Check Daggr version:**
   ```bash
   source daggr/venv/bin/activate
   pip show daggr
   # Should be 0.5.4 or higher
   ```

4. **Try running Python directly:**
   ```bash
   source daggr/venv/bin/activate
   python daggr/simple_test_workflow.py
   ```

## Getting Help

If none of these solutions work:

1. Check terminal output for error messages
2. Check browser console for JavaScript errors
3. Try the simple test workflow
4. Check Daggr GitHub issues: https://github.com/gradio-app/daggr/issues

## Quick Fixes Summary

| Problem | Solution |
|---------|----------|
| Blank canvas | Zoom out, pan around |
| No nodes visible | Try simple_test_workflow.py |
| Connection error | Check terminal, try different port |
| Nodes disappear | Refresh page, check console |
| Slow loading | Wait 10-15 seconds, check terminal |

---

**Most Common Fix:** Zoom out using mouse wheel or zoom controls in bottom left corner!
