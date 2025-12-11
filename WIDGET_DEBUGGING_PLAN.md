# Widget Debugging Plan - Notion Wiz

## Overview
This document outlines a comprehensive plan to debug and test all widgets in the Notion Wiz application to ensure they work with zero issues.

## Widget Inventory

Based on the current codebase, we have **8 widgets** to debug:

1. **Clock Widget** (`src/widgets/clock-widget/`)
2. **Countdown Widget** (`src/widgets/countdown-widget/`)
3. **Counter Widget** (`src/widgets/counter-widget/`)
4. **Image Gallery Widget** (`src/widgets/image-gallery-widget/`)
5. **Life Progress Bar Widget** (`src/widgets/life-progress-bar-widget/`)
6. **Button Generator Widget** (`src/widgets/new-button-generator-widget/`)
7. **Quotes Widget** (`src/widgets/quotes-widget/`)
8. **Weather Widget** (`src/widgets/weather-widget/`)

---

## Testing Strategy

### Phase 1: Individual Widget Testing
Each widget will be tested for:
- ✅ **Functionality** - Core features work as expected
- ✅ **Configuration** - All config options are valid and work
- ✅ **Edge Cases** - Handles invalid inputs, extreme values, and errors
- ✅ **Performance** - Renders efficiently without lag
- ✅ **Memory Leaks** - Proper cleanup on unmount

### Phase 2: Integration Testing
- ✅ **Theme Integration** - Works with JaZeR Neon theme and brand themes
- ✅ **Export Functionality** - Generates valid HTML/CSS for Notion
- ✅ **Cross-Widget Compatibility** - No conflicts between widgets
- ✅ **App Context** - Works properly within the main App component

### Phase 3: User Experience Testing
- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **Accessibility** - Keyboard navigation, screen readers, ARIA labels
- ✅ **Browser Compatibility** - Chrome, Firefox, Safari, Edge
- ✅ **Notion Integration** - Works when embedded in Notion pages

---

## Detailed Testing Checklist

### 1. Clock Widget
**File Structure:**
- `ClockWidget.jsx` - Component implementation
- `config.js` - Widget configuration
- `export.js` - Export functionality

**Tests to Perform:**
- [ ] Displays current time correctly
- [ ] Updates every second without lag
- [ ] Supports 12-hour and 24-hour formats
- [ ] Shows date correctly with various format options
- [ ] Timezone handling works correctly
- [ ] Analog/Digital display modes work
- [ ] Theme customization applies correctly
- [ ] No memory leaks from interval timers
- [ ] Exports valid standalone HTML

**Edge Cases:**
- [ ] Midnight transition (23:59:59 → 00:00:00)
- [ ] Daylight saving time changes
- [ ] Different browser timezone settings
- [ ] Tab inactive/background behavior

---

### 2. Countdown Widget
**File Structure:**
- `CountdownWidget.jsx` - Component implementation
- `config.js` - Widget configuration
- `export.js` - Export functionality

**Tests to Perform:**
- [ ] Countdown calculates time remaining correctly
- [ ] Updates every second accurately
- [ ] Handles past dates (shows "Expired" or countdown complete)
- [ ] Displays days, hours, minutes, seconds correctly
- [ ] Custom target date input works
- [ ] Theme customization applies correctly
- [ ] Timer stops when countdown reaches zero
- [ ] No memory leaks from interval timers
- [ ] Exports valid standalone HTML

**Edge Cases:**
- [ ] Target date in the past
- [ ] Target date more than 1 year away
- [ ] Invalid date inputs
- [ ] Leap year handling
- [ ] Tab inactive/background behavior
- [ ] Timezone considerations

---

### 3. Counter Widget
**File Structure:**
- `CounterWidget.jsx` - Component implementation
- `config.js` - Widget configuration
- `export.js` - Export functionality

**Tests to Perform:**
- [ ] Increment button increases count
- [ ] Decrement button decreases count
- [ ] Reset button sets count to initial value
- [ ] Custom increment/decrement values work
- [ ] Min/max value constraints work
- [ ] Display formatting options work
- [ ] Theme customization applies correctly
- [ ] State persists correctly (if applicable)
- [ ] Exports valid standalone HTML

**Edge Cases:**
- [ ] Very large numbers (999,999+)
- [ ] Negative numbers
- [ ] Decimal increments
- [ ] Rapid clicking/double-click behavior
- [ ] Min/max boundary testing

---

### 4. Image Gallery Widget
**File Structure:**
- `ImageGalleryWidget.jsx` - Component implementation
- `config.js` - Widget configuration
- `export.js` - Export functionality

**Tests to Perform:**
- [ ] Images load correctly from URLs
- [ ] Multiple images display in gallery format
- [ ] Image navigation works (next/prev)
- [ ] Lightbox/modal view works
- [ ] Thumbnail generation works
- [ ] Layout options (grid, carousel, masonry) work
- [ ] Image captions display correctly
- [ ] Loading states show appropriately
- [ ] Theme customization applies correctly
- [ ] Exports valid standalone HTML with images

**Edge Cases:**
- [ ] Invalid/broken image URLs
- [ ] Very large images (5MB+)
- [ ] Mixed image sizes and aspect ratios
- [ ] Single image vs. many images (100+)
- [ ] Slow network/loading behavior
- [ ] Empty gallery (no images)

---

### 5. Life Progress Bar Widget
**File Structure:**
- `LifeProgressWidget.jsx` - Component implementation
- `config.js` - Widget configuration
- `export.js` - Export functionality

**Tests to Perform:**
- [ ] Calculates progress percentage correctly
- [ ] Displays visual progress bar
- [ ] Shows time elapsed and remaining
- [ ] Custom start/end dates work
- [ ] Multiple timeframes (year, month, week, day)
- [ ] Progress updates in real-time
- [ ] Theme customization applies correctly
- [ ] Motivational messages display correctly
- [ ] Exports valid standalone HTML

**Edge Cases:**
- [ ] Birth date input validation
- [ ] Future dates for "end of life"
- [ ] Leap year calculations
- [ ] Very young (<1 year) or very old (>100 years)
- [ ] Different calendar systems
- [ ] Negative progress scenarios

---

### 6. Button Generator Widget
**File Structure:**
- `ButtonGeneratorWidget.jsx` - Component implementation
- `ButtonGeneratorWidget.css` - Widget styles
- `config.js` - Widget configuration
- `export.js` - Export functionality

**Tests to Perform:**
- [ ] Generates button with custom text
- [ ] Custom link/URL works
- [ ] Button style options work (filled, outline, ghost)
- [ ] Size options work (small, medium, large)
- [ ] Color customization works
- [ ] Icon support works
- [ ] Hover states work correctly
- [ ] Copy-to-clipboard functionality works
- [ ] Theme customization applies correctly
- [ ] Exports valid standalone HTML with all styles

**Edge Cases:**
- [ ] Very long button text (100+ characters)
- [ ] Special characters in text/URLs
- [ ] Invalid URLs
- [ ] No text provided
- [ ] Extremely small or large sizes
- [ ] Color contrast accessibility

---

### 7. Quotes Widget
**File Structure:**
- `QuotesWidget.jsx` - Component implementation
- `config.js` - Widget configuration
- `export.js` - Export functionality

**Tests to Perform:**
- [ ] Displays random quote on load
- [ ] "New Quote" button fetches different quote
- [ ] Quote and author display correctly
- [ ] Custom quote list works
- [ ] API integration works (if applicable)
- [ ] Loading states show appropriately
- [ ] Theme customization applies correctly
- [ ] Quote formatting works (long quotes, special characters)
- [ ] Exports valid standalone HTML

**Edge Cases:**
- [ ] Very long quotes (500+ characters)
- [ ] Quotes with special characters/emojis
- [ ] Empty author field
- [ ] API failure/offline mode
- [ ] Single quote in list
- [ ] Duplicate quotes

---

### 8. Weather Widget
**File Structure:**
- `WeatherWidget.jsx` - Component implementation
- `config.js` - Widget configuration
- `export.js` - Export functionality

**Tests to Perform:**
- [ ] Fetches weather data correctly
- [ ] Location input/detection works
- [ ] Current weather displays correctly
- [ ] Temperature units (°C/°F) toggle works
- [ ] Weather icons display correctly
- [ ] Forecast display works (if applicable)
- [ ] Loading states show appropriately
- [ ] Error handling for invalid locations
- [ ] Theme customization applies correctly
- [ ] API key configuration works
- [ ] Exports valid standalone HTML

**Edge Cases:**
- [ ] Invalid location names
- [ ] Non-existent cities
- [ ] Special characters in location
- [ ] API rate limiting
- [ ] API failure/timeout
- [ ] No internet connection
- [ ] Extreme weather conditions
- [ ] Different timezone display

---

## Cross-Widget Testing

### Theme Integration
**Tests:**
- [ ] All widgets respect JaZeR Neon theme
- [ ] Brand theme generator works with all widgets
- [ ] Dark/Light mode toggles work
- [ ] Custom color overrides work
- [ ] Theme persistence across page reloads

### Export Functionality
**Tests:**
- [ ] Each widget exports standalone HTML
- [ ] Exported HTML works in Notion
- [ ] All styles are inlined correctly
- [ ] JavaScript is properly embedded
- [ ] No external dependencies fail
- [ ] Export button copies to clipboard

### Performance Testing
**Tests:**
- [ ] Initial page load < 3 seconds
- [ ] Widget rendering < 500ms
- [ ] No janky animations (60fps)
- [ ] Memory usage stays reasonable
- [ ] No console errors or warnings
- [ ] Bundle size is optimized

---

## Browser & Device Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari (iOS)
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Screen Sizes
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px - 1920px)
- [ ] Large Desktop (1921px+)

---

## Bug Tracking Template

When bugs are found, document them using this template:

```markdown
### Bug #[NUMBER]
**Widget:** [Widget Name]
**Severity:** [Critical/High/Medium/Low]
**Description:** [What's wrong]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. ...

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happens]
**Screenshots:** [If applicable]
**Environment:** [Browser, OS, Screen size]
**Status:** [Open/In Progress/Fixed/Closed]
```

---

## Testing Timeline

### Week 1: Individual Widget Testing
- Days 1-2: Clock, Countdown, Counter widgets
- Days 3-4: Image Gallery, Life Progress, Button Generator
- Days 5-6: Quotes, Weather widgets
- Day 7: Documentation and bug triage

### Week 2: Integration & Polish
- Days 1-2: Theme integration testing
- Days 3-4: Export functionality testing
- Days 5-6: Cross-browser and responsive testing
- Day 7: Final bug fixes and regression testing

---

## Success Criteria

✅ **Zero Critical Bugs** - No bugs that prevent core functionality
✅ **Zero Console Errors** - Clean console on all widgets
✅ **100% Feature Coverage** - All advertised features work
✅ **95%+ Browser Compatibility** - Works on all major browsers
✅ **<3s Load Time** - Fast initial load
✅ **Notion Compatible** - All exports work in Notion
✅ **Accessible** - WCAG 2.1 AA compliance
✅ **Documented** - All bugs tracked and resolved

---

## Tools & Scripts

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

### Testing Utilities Needed
- [ ] Create manual test scripts
- [ ] Set up error logging
- [ ] Create widget test page (all widgets on one page)
- [ ] Set up performance monitoring
- [ ] Create accessibility checker integration

---

## Notes

- Test in **incognito/private mode** to avoid cached data
- Test with **browser extensions disabled** first
- Use **DevTools Performance tab** for performance testing
- Use **DevTools Network tab** for API testing
- Document all issues in GitHub Issues or bug tracker
- Prioritize critical bugs before medium/low priority

---

**Last Updated:** 2025-12-05
**Document Owner:** Development Team
**Next Review:** After each testing phase
