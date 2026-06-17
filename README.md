# Whiteboard POC

A React-based interactive whiteboard application for visualizing and exploring clinical trial data from JSON files. Users can drag and drop data items from a left navigation panel onto a whiteboard, view them as listings or charts, resize items, and toggle between visualization types.

## Features

- **Left Navigation Panel**: Organizes data items by category (Subjects, Lab Tests, Adverse Events, Exposure)
- **Drag & Drop**: Drag items from navigation to the whiteboard
- **Multiple Visualizations**:
  - **Listings**: Display structured data as formatted lists
  - **Charts**: Line charts for lab values over time, bar charts for adverse event severity
- **Resizable Items**: Resize any card on the whiteboard for better viewing
- **Toggle Visualization Types**: Switch between list and chart views for any item
- **Close Items**: Remove items from the whiteboard with the close button
- **Icons**: Visual indicators for data types (list, chart, activity icons)

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Left sidebar with data items
│   ├── NavItem.tsx      # Individual navigation item
│   ├── Whiteboard.tsx   # Drop area and item container
│   ├── WhiteboardItem.tsx # Resizable item card
│   ├── Visualization.tsx # Chart and list rendering
│   └── index.ts         # Component exports
├── utils/
│   └── dataLoader.ts    # Data fetching and processing
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx             # React entry point
└── index.css            # Tailwind CSS styles

public/
├── subjects.json        # Clinical trial subjects data
├── labs.json            # Laboratory test results
├── ae.json              # Adverse events data
└── ex.json              # Drug exposure data
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## Usage

1. **Browse Data**: The left panel shows all available data items organized by category
2. **Drag Items**: Click and drag any item from the left panel onto the whiteboard
3. **Resize Cards**: Use the resize handles (bottom-right corner) to adjust card size
4. **Toggle Visualization**: Click the chart/list icon in the card header to switch view types
5. **Remove Items**: Click the X button to remove an item from the whiteboard

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React DnD**: Drag and drop functionality
- **React Resizable Box**: Resizable components
- **Recharts**: Chart library
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## Data Format

### Subjects
Information about clinical trial participants with demographics and status.

### Lab Tests
Laboratory test results with values, reference ranges, and study day.

### Adverse Events
Reported adverse events with severity and relatedness to treatment.

### Exposure
Drug exposure/dosing information with dose, frequency, and duration.

## Features in Detail

### Navigation Panel
- Categorized by data type
- Collapsible categories to save space
- Drag-enabled items with visual feedback

### Whiteboard
- Unlimited drag-and-drop additions
- Positioned at drop coordinates
- Visual feedback when hovering over drop area

### Cards
- Header with title and icons
- Resizable to any size (minimum 300x250px)
- Icon toggle to switch between list and chart views
- Close button to remove from whiteboard

### Visualizations
- **Lab Tests**: Line chart showing values over time with reference limits
- **Adverse Events**: Bar chart showing event severity distribution
- **Subjects**: Detailed information display
- **Exposure**: Summary of drug dosing information

## License

MIT
