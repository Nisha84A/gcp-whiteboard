# Quick Start Guide

## Installation

```bash
cd /Users/aadelanishat/Documents/Mine/GoogleWhiteboardPOC
npm install
npm run dev
```

Then open: **http://localhost:5173**

## What You Can Do

### 1. Explore the Data
The left sidebar contains all clinical trial data organized into categories:
- **Subjects**: 8 patient records with demographics
- **Lab Tests**: ALT, AST, and Creatinine measurements
- **Adverse Events**: Reported adverse events with severity
- **Exposure**: Drug dosing information

### 2. Add Items to Whiteboard
Drag any item from the left panel to the right whiteboard area. Items appear with:
- A blue header showing the item name
- A visualization icon (chart or list)
- Toggle button to switch views
- Close button (X) to remove

### 3. Visualize Your Data

#### Lab Tests
Shows line charts with:
- Blue line: Actual lab values
- Orange dashed line: Upper normal limit
- Green dashed line: Lower normal limit
- X-axis: Study day
- Y-axis: Lab value

#### Adverse Events
Shows bar charts with:
- Bar height: Number of events at each severity level
- Categories: MILD, MODERATE, SEVERE

#### Subjects
Shows formatted data:
- Subject ID
- Treatment arm
- Age and sex
- Site location
- Status (Completed/Discontinued)

#### Exposure
Shows dosing summary:
- Subject ID
- Drug name
- Dose and frequency
- Duration

### 4. Customize Your View
- **Resize**: Drag the bottom-right corner of any card
- **Toggle View**: Click the chart/list icon to switch visualization type
- **Remove**: Click X button to delete from whiteboard
- **Organize**: Collapse/expand categories in navigation

### 5. Best Practices

#### For Lab Analysis
1. Drag "Lab: ALT" for liver function
2. Drag "Lab: AST" for additional liver markers
3. Compare trends across subjects
4. Toggle to list view to see exact values

#### For Safety Monitoring
1. Drag adverse events to monitor safety signals
2. View severity distribution with bar charts
3. Cross-reference with subject information
4. Check exposure/dosing correlations

#### For Study Overview
1. Add multiple subject cards
2. View treatment arms and status
3. Check enrollment site distribution
4. Monitor completion rates

## Sample Workflow

1. Start by dragging **SUBJ-001** to see subject demographics
2. Add **Lab: ALT** to view their liver function trends
3. Drag **AE: Headache** to check adverse event patterns
4. Add **Treatment: Drug ABC** to see dosing info
5. Resize cards to compare information side-by-side
6. Toggle visualizations to explore data different ways

## Troubleshooting

**Items not dragging?**
- Make sure you click on the item and hold
- Drag to the whiteboard area (right side)
- Release to drop

**Chart not showing?**
- The whiteboard must be large enough
- Resize the card if needed
- Try toggling visualization type

**App not loading?**
- Check that npm run dev is running
- Try refreshing the browser
- Clear browser cache and reload

**Missing data?**
- Check the browser console for errors
- Verify JSON files are in /public directory
- Check network tab in DevTools

## Features Demo

### Feature: Drag & Drop
- Smooth dragging from navigation to whiteboard
- Visual feedback while dragging
- Position detection on drop

### Feature: Resizable
- Drag bottom-right corner to resize
- Minimum size: 300x250px
- Smooth resizing

### Feature: Multi-visualization
- Toggle between list and chart views
- Auto-select best visualization based on data type
- Dynamic chart scaling

### Feature: Data Organization
- Hierarchical navigation structure
- Collapsible categories
- Quick access to all data types

## Performance Tips

1. Start with 3-5 items on whiteboard
2. Use larger whiteboard windows for better visibility
3. Collapse unused categories to reduce clutter
4. Close items you're not viewing to improve responsiveness

## Getting Help

For issues or questions:
1. Check this guide
2. Review the PROJECT_SUMMARY.md file
3. Check the browser console for error messages
4. Review the React components in src/components/

## Next Steps

Now that you have the whiteboard running:
1. Try adding multiple items
2. Experiment with resizing
3. Compare different visualizations
4. Analyze patterns in the clinical trial data
5. Customize the layout for your workflow

Enjoy exploring your clinical trial data! 📊
