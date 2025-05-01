# Button Standards for Document Repository

This document outlines the new standardized approach for buttons in the Document Repository components.

## The New Button System

Our new button system uses a base class for shared properties, with specific classes for each button type.

### The Base Class: `doc-repo-button`

This class contains all shared button properties:
- Height, padding, font size
- Flexbox alignment
- Border radius
- Other common styles

### Type-Specific Classes

Each button type has its own class that adds the unique styling:

- `delete-button`: Red background for destructive actions
- `save-button`: Blue background for primary/save actions
- `cancel-button`: Gray background for cancel/back actions
- `edit-button`: Secondary blue for edit actions

### Icon Buttons

For icon-only buttons, use the `icon-button` class along with the base class.

## How to Use

Always include both the base class and a type class:

```jsx
// Delete button
<Button 
  className="doc-repo-button delete-button" 
  onClick={handleDelete}
>
  Delete
</Button>

// Save button
<Button
  className="doc-repo-button save-button"
  onClick={handleSave}
>
  Save Changes
</Button>

// Cancel button
<Button
  className="doc-repo-button cancel-button"
  onClick={handleCancel}
>
  Cancel
</Button>

// Icon button
<Button
  className="doc-repo-button icon-button delete-button"
  onClick={handleDelete}
  aria-label="Delete"
>
  <svg>...</svg>
</Button>
```

## Modal Button Order

Buttons in modals are automatically ordered thanks to CSS:
1. Cancel buttons on the left
2. Save buttons in the middle
3. Delete buttons on the right

## Benefits Over Previous Approach

1. **Simplified Classes**: No more complex selectors like `.components-modal__frame .components-button.is-destructive`
2. **Consistent Appearance**: Buttons look the same regardless of context
3. **No WordPress Props**: Removed dependency on WordPress `variant` and `isDestructive` props
4. **Easier Maintenance**: All button styles are defined in one file
5. **Clear Developer Intent**: The class names clearly indicate the button's purpose

## Implementation Notes

- The styles are defined in `_button-styles.scss`
- A lightweight `button-fix.js` script handles WordPress admin edge cases
- No need to use WordPress props like `variant="primary"` or `isDestructive` 