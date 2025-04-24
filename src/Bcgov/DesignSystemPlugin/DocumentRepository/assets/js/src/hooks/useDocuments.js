/**
 * Custom hook for managing document data and operations
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Hook to manage document data and operations
 * 
 * @returns {Object} Document data and operations
 */
export const useDocuments = () => {
    // Document data
    const [documents, setDocuments] = useState([]);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    
    // Search and filter parameters
    const [searchParams, setSearchParams] = useState({
        search: '',
        page: 1,
        per_page: window.documentRepositorySettings?.perPage || 20,
        orderby: 'date',
        order: 'DESC',
    });
    
    /**
     * Fetch documents from the API
     */
    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const { apiNamespace } = window.documentRepositorySettings;
            
            // Build query string for search and filters
            const queryParams = new URLSearchParams();
            
            // Add all search parameters to query
            Object.entries(searchParams).forEach(([key, value]) => {
                if (value) {
                    queryParams.append(key, value);
                }
            });
            
            // Fetch documents from API
            const response = await apiFetch({
                path: `/${apiNamespace}/documents?${queryParams.toString()}`,
            });
            
            // Validate the response structure
            if (!response || typeof response !== 'object') {
                throw new Error('Invalid response from server');
            }
            
            // Ensure documents is an array and each item has required properties
            const validDocuments = Array.isArray(response.documents) 
                ? response.documents.filter(doc => doc && typeof doc === 'object' && doc.id)
                : [];
            
            // Update state with fetched data
            setDocuments(validDocuments);
            setTotalDocuments(response.total || 0);
            setCurrentPage(response.current_page || 1);
            setTotalPages(response.total_pages || 1);
            setIsLoading(false);
        } catch (err) {
            setError(err.message || 'Error loading documents');
            setIsLoading(false);
        }
    }, [searchParams]);
    
    // Fetch documents when search parameters change
    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);
    
    /**
     * Delete a document
     * 
     * @param {number} documentId Document ID to delete
     * @returns {Promise<boolean>} Success status
     */
    const deleteDocument = async (documentId) => {
        setIsDeleting(true);
        
        try {
            const { apiNamespace } = window.documentRepositorySettings;
            
            // Delete document from API
            await apiFetch({
                path: `/${apiNamespace}/documents/${documentId}`,
                method: 'DELETE',
            });
            
            // Refresh documents list
            await fetchDocuments();
            setIsDeleting(false);
            return true;
        } catch (err) {
            setError(err.message || 'Error deleting document');
            setIsDeleting(false);
            return false;
        }
    };
    
    /**
     * Update a document
     * 
     * @param {number} documentId Document ID to update
     * @param {Object} data Document data to update
     * @returns {Promise<Object|null>} Updated document or null on error
     */
    const updateDocument = async (documentId, data) => {
        try {
            const { apiNamespace } = window.documentRepositorySettings;
            
            // Update document via API
            const response = await apiFetch({
                path: `/${apiNamespace}/documents/${documentId}`,
                method: 'PUT',
                data: data,
            });
            
            // Refresh documents list
            await fetchDocuments();
            return response;
        } catch (err) {
            setError(err.message || 'Error updating document');
            return null;
        }
    };
    
    /**
     * Bulk update documents
     * 
     * @param {Array<number>} documentIds Document IDs to update
     * @param {Object} data Data to update for all documents
     * @returns {Promise<boolean>} Success status
     */
    const bulkUpdateDocuments = async (documentIds, data) => {
        try {
            // Update each document sequentially
            for (const id of documentIds) {
                await updateDocument(id, data);
            }
            
            // Refresh documents list
            await fetchDocuments();
            return true;
        } catch (err) {
            setError(err.message || 'Error performing bulk update');
            return false;
        }
    };
    
    /**
     * Bulk delete documents
     * 
     * @param {Array<number>} documentIds Document IDs to delete
     * @returns {Promise<boolean>} Success status
     */
    const bulkDeleteDocuments = async (documentIds) => {
        try {
            // Delete each document sequentially
            for (const id of documentIds) {
                await deleteDocument(id);
            }
            
            return true;
        } catch (err) {
            setError(err.message || 'Error performing bulk delete');
            return false;
        }
    };
    
    return {
        // Document data
        documents,
        totalDocuments,
        currentPage,
        totalPages,
        
        // Loading states
        isLoading,
        isDeleting,
        error,
        
        // Search and filter parameters
        searchParams,
        setSearchParams,
        
        // Document operations
        fetchDocuments,
        deleteDocument,
        updateDocument,
        bulkUpdateDocuments,
        bulkDeleteDocuments,
    };
}; 