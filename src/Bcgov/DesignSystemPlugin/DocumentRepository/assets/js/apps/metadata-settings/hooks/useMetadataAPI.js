import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export const useMetadataAPI = () => {
    const { apiNamespace } = window.documentRepositorySettings;
    
    const fetchFields = useCallback(async () => {
        try {
            const fields = await apiFetch({
                path: `/${apiNamespace}/metadata-fields`,
            });
            return { success: true, data: fields };
        } catch (err) {
            return { 
                success: false, 
                error: err.message || __('Error loading metadata fields', 'bcgov-design-system')
            };
        }
    }, [apiNamespace]);
    
    const saveFields = useCallback(async (fields) => {
        try {
            await apiFetch({
                path: `/${apiNamespace}/metadata-fields`,
                method: 'PUT',
                data: { fields },
            });
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.message || __('Error saving metadata fields', 'bcgov-design-system')
            };
        }
    }, [apiNamespace]);
    
    return { fetchFields, saveFields };
}; 