/**
 * Document Search Component
 * 
 * Provides search and filter functionality for the document list.
 */

import { useState, useEffect } from '@wordpress/element';
import {
    SearchControl,
    SelectControl,
    Card,
    CardHeader,
    CardBody,
    Flex,
    FlexItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Document Search component
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} Component
 */
const DocumentSearch = ({
    onSearch,
    searchTerm = '',
    metadataFields = [],
    onFilterChange,
    currentFilters = {},
}) => {
    // Local state for search input
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    
    // Get filterable metadata fields
    const filterableFields = metadataFields.filter(field => field.filterable);
    
    // Handle search term change with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(localSearchTerm);
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [localSearchTerm, onSearch]);
    
    // Handle filter change
    const handleFilterChange = (field, value) => {
        onFilterChange(field, value);
    };
    
    return (
        <Card className="document-search">
            <CardHeader>
                <h3>{__('Search and Filter', 'bcgov-design-system')}</h3>
            </CardHeader>
            
            <CardBody>
                <Flex gap={2} justify="flex-start" wrap>
                    <FlexItem className="search-input-container">
                        <SearchControl
                            placeholder={__('Search documents...', 'bcgov-design-system')}
                            value={localSearchTerm}
                            onChange={setLocalSearchTerm}
                            className="search-input"
                        />
                    </FlexItem>
                    
                    {filterableFields.map(field => {
                        if (field.type === 'select' && field.options) {
                            return (
                                <FlexItem key={field.id} className="filter-select-container">
                                    <SelectControl
                                        label={field.label}
                                        value={currentFilters[field.id] || ''}
                                        options={[
                                            { label: __('All', 'bcgov-design-system'), value: '' },
                                            ...Object.entries(field.options).map(([value, label]) => ({
                                                label,
                                                value,
                                            })),
                                        ]}
                                        onChange={(value) => handleFilterChange(field.id, value)}
                                    />
                                </FlexItem>
                            );
                        }
                        
                        return null;
                    })}
                </Flex>
            </CardBody>
        </Card>
    );
};

export default DocumentSearch; 