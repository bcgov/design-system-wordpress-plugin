# design-system-wordpress-plugin
This repo contains the code for the design-system-wordpress-plugin for WordPress.

## Custom Hooks

### bcgov_document_repository_metadata_fields_updated

**Description:**  
Triggered whenever the metadata fields for the Document Repository are updated (e.g., when a field is added, edited, or deleted).

**When it's triggered:**  
- After saving, updating, or deleting a metadata field.

**Parameters:**  
None.

**Usage Example:**
```php
add_action( 'bcgov_document_repository_metadata_fields_updated', function() {
    // Your custom logic here, e.g., flush cache or re-register fields.
} );