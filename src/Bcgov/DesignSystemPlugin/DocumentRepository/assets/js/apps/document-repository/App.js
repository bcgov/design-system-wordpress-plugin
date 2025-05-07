/**
 * Document Repository - Main App Component
 *
 * This is the root component of the Document Repository application.
 * It sets up the application structure, context providers, and main routes.
 *
 * @example
 * <App />
 */

import { useState, useEffect } from '@wordpress/element';
import { Modal, Notice, Spinner, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import DocumentList from './components/DocumentList';
import DocumentUploader from './components/DocumentUploader';
import { useDocuments } from './hooks/useDocuments';
import AppErrorBoundary from '../../shared/components/AppErrorBoundary';

/**
 * Main App component
 *
 * Manages the document repository application state and UI.
 * Handles document listing, uploading, and metadata management.
 *
 * @return {JSX.Element} The rendered application
 */
const App = () => {
	// API data loading state
	const [ isInitializing, setIsInitializing ] = useState( true );
	const [ error, setError ] = useState( null );

	// Metadata fields configuration
	const [ metadataFields, setMetadataFields ] = useState( [] );

	// Modal state for document upload
	const [ showUploadModal, setShowUploadModal ] = useState( false );
	const [ showCancelConfirmModal, setShowCancelConfirmModal ] =
		useState( false );
	const [ selectedFileForUpload, setSelectedFileForUpload ] =
		useState( null );

	// Document data and operations from custom hook
	const {
		documents,
		totalDocuments,
		currentPage,
		totalPages,
		fetchDocuments,
		deleteDocument,
		isDeleting,
		isLoading: isLoadingDocuments,
		error: documentsError,
		setSearchParams,
	} = useDocuments();

	// Selected documents for bulk actions
	const [ selectedDocuments, setSelectedDocuments ] = useState( [] );

	// Initialize data on component mount
	useEffect( () => {
		const initializeData = async () => {
			try {
				setIsInitializing( true );
				setError( null );

				// Check for required settings
				const settings = window.documentRepositorySettings;
				if (
					! settings?.apiRoot ||
					! settings?.apiNamespace ||
					! settings?.nonce
				) {
					throw new Error(
						__(
							'Document Repository settings not found. Make sure the script is properly enqueued in WordPress.',
							'bcgov-design-system'
						)
					);
				}

				// Fetch metadata fields
				const response = await fetch(
					`${ settings.apiRoot }${ settings.apiNamespace }/metadata-fields`,
					{
						headers: {
							'X-WP-Nonce': settings.nonce,
						},
					}
				);

				if ( ! response.ok ) {
					let errorMessage;
					try {
						const errorData = await response.json();
						errorMessage = errorData.message || errorData.error;
					} catch ( e ) {
						errorMessage = response.statusText;
					}
					throw new Error(
						__(
							'Failed to fetch metadata fields: ',
							'bcgov-design-system'
						) + errorMessage
					);
				}

				const data = await response.json();
				setMetadataFields( data );

				// Fetch initial documents
				await fetchDocuments();
			} catch ( initError ) {
				setError(
					initError.message ||
						__(
							'Failed to initialize document repository',
							'bcgov-design-system'
						)
				);
			} finally {
				setIsInitializing( false );
			}
		};

		initializeData();
	}, [ fetchDocuments ] );

	/**
	 * Handle document selection for bulk actions
	 *
	 * @function handleDocumentSelection
	 * @param {number} documentId - ID of the document to select/deselect
	 */
	const handleDocumentSelection = ( documentId ) => {
		try {
			const newSelectedDocuments = selectedDocuments.includes(
				documentId
			)
				? selectedDocuments.filter( ( id ) => id !== documentId )
				: [ ...selectedDocuments, documentId ];
			setSelectedDocuments( newSelectedDocuments );
		} catch ( err ) {
			setError(
				__( 'Failed to select document', 'bcgov-design-system' )
			);
		}
	};

	/**
	 * Handle selecting all documents
	 *
	 * @function handleSelectAll
	 * @param {boolean} isSelected - Whether to select or deselect all documents
	 */
	const handleSelectAll = ( isSelected ) => {
		try {
			setSelectedDocuments(
				isSelected ? documents.map( ( doc ) => doc.id ) : []
			);
		} catch ( err ) {
			setError(
				__( 'Failed to select documents', 'bcgov-design-system' )
			);
		}
	};

	/**
	 * Handle page change in pagination
	 *
	 * @function handlePageChange
	 * @param {number} newPage - New page number to navigate to
	 */
	const handlePageChange = async ( newPage ) => {
		try {
			setError( null );

			// Update search params to include the new page number
			setSearchParams( ( prev ) => ( {
				...prev,
				page: newPage,
			} ) );

			// The fetchDocuments call will happen automatically due to the useEffect
			// in useDocuments that watches for searchParams changes
		} catch ( err ) {
			setError(
				err.message ||
					__( 'Failed to change page', 'bcgov-design-system' )
			);
			// If there's an error, revert to the previous page
			setSearchParams( ( prev ) => ( {
				...prev,
				page: currentPage,
			} ) );
		}
	};

	// Add new state for managing multiple file uploads
	const [ uploadQueue, setUploadQueue ] = useState( [] );
	const [ currentUploadIndex, setCurrentUploadIndex ] = useState( 0 );
	const [ uploadProgress, setUploadProgress ] = useState( 0 );

	/**
	 * Handle upload success and move to next file
	 *
	 * @function handleUploadSuccess
	 */
	const handleUploadSuccess = () => {
		// Update the document list by fetching the latest documents
		fetchDocuments();

		// Reset upload state
		setShowUploadModal( false );
		setSelectedFileForUpload( null );
		setUploadQueue( [] );
		setCurrentUploadIndex( 0 );
	};

	/**
	 * Handle file drop for document upload
	 *
	 * @async
	 * @function handleFileDrop
	 * @param {File} file - The file to upload
	 * @throws {Error} If upload fails
	 */
	const handleFileDrop = async ( file ) => {
		try {
			// Validate file type
			if (
				! file.type.includes( 'pdf' ) &&
				! file.name.toLowerCase().endsWith( '.pdf' )
			) {
				throw new Error( 'Only PDF files are allowed' );
			}

			// Create FormData object
			const formData = new FormData();
			formData.append( 'file', file );
			formData.append( 'title', file.name.split( '.' )[ 0 ] ); // Use filename without extension as title

			// Get the nonce from WordPress settings
			const nonce = window.documentRepositorySettings?.nonce;
			if ( ! nonce ) {
				throw new Error( 'Security token not found' );
			}

			// Create XMLHttpRequest for upload with progress tracking
			const xhr = new window.XMLHttpRequest();

			const uploadPromise = new Promise( ( resolve, reject ) => {
				xhr.open(
					'POST',
					`${ window.documentRepositorySettings.apiRoot }${ window.documentRepositorySettings.apiNamespace }/documents`
				);
				xhr.setRequestHeader( 'X-WP-Nonce', nonce );

				// Track upload progress
				xhr.upload.onprogress = ( event ) => {
					if ( event.lengthComputable ) {
						const progress = Math.round(
							( event.loaded / event.total ) * 100
						);
						setUploadProgress( progress );
					}
				};

				xhr.onload = () => {
					if ( xhr.status >= 200 && xhr.status < 300 ) {
						try {
							const response = JSON.parse( xhr.responseText );
							resolve( response );
						} catch ( parseErr ) {
							reject(
								new Error(
									`Error uploading "${ file.name }": Server returned invalid response`
								)
							);
						}
					} else {
						let errorMessage;
						try {
							const response = JSON.parse( xhr.responseText );
							errorMessage =
								response.message ||
								response.error ||
								xhr.statusText;
						} catch ( e ) {
							errorMessage = xhr.statusText || 'Server error';
						}
						reject(
							new Error(
								`Error uploading "${ file.name }": ${ errorMessage }`
							)
						);
					}
				};

				xhr.onerror = () => {
					reject(
						new Error(
							`Network error while uploading "${ file.name }". Please check your connection and try again.`
						)
					);
				};

				xhr.send( formData );
			} );

			// Wait for upload to complete
			await uploadPromise;

			// Handle successful upload
			handleUploadSuccess();
		} catch ( err ) {
			setError( err.message || 'Failed to upload file' );
			throw err;
		}
	};

	const handleCancelUpload = () => {
		setShowUploadModal( false );
		setSelectedFileForUpload( null );
		setUploadQueue( [] );
		setCurrentUploadIndex( 0 );
		setShowCancelConfirmModal( false );
	};

	// Show error if either initialization or documents error occurs
	const displayError = error || documentsError;

	// Handle error auto-dismissal
	useEffect( () => {
		if ( displayError ) {
			const timer = setTimeout( () => {
				setError( null );
			}, 3000 );

			return () => clearTimeout( timer );
		}
	}, [ displayError ] );

	// Loading state
	if ( isInitializing ) {
		return (
			<div className="dswp-document-repository-loading">
				<Spinner />
				<p>
					{ __(
						'Loading document repository…',
						'bcgov-design-system'
					) }
				</p>
			</div>
		);
	}

	// Main application render
	return (
		<AppErrorBoundary>
			<div className="dswp-document-repository">
				{ displayError && (
					<Notice
						status="error"
						isDismissible={ true }
						onDismiss={ () => setError( null ) }
						className="document-repository-error"
					>
						<p>{ displayError }</p>
					</Notice>
				) }

				<DocumentList
					documents={ documents || [] }
					isLoading={ isLoadingDocuments }
					totalItems={ totalDocuments }
					currentPage={ currentPage || 1 }
					totalPages={ totalPages || 1 }
					onPageChange={ handlePageChange }
					onDelete={ deleteDocument }
					isDeleting={ isDeleting }
					selectedDocuments={ selectedDocuments || [] }
					onSelectDocument={ handleDocumentSelection }
					onSelectAll={ handleSelectAll }
					metadataFields={ metadataFields || [] }
					onUploadSuccess={ handleUploadSuccess }
					onFileDrop={ handleFileDrop }
				/>

				{ /* Upload Modal */ }
				{ showUploadModal && selectedFileForUpload && (
					<Modal
						title={
							uploadQueue.length > 1
								? __(
										'Upload Documents',
										'bcgov-design-system'
								  )
								: __( 'Upload Document', 'bcgov-design-system' )
						}
						onRequestClose={ () =>
							setShowCancelConfirmModal( true )
						}
						className="document-upload-modal"
					>
						<div className="upload-progress-info">
							{ uploadQueue.length > 1 && (
								<p className="upload-queue-status">
									{ __(
										'Uploading file',
										'bcgov-design-system'
									) }{ ' ' }
									{ currentUploadIndex + 1 }{ ' ' }
									{ __( 'of', 'bcgov-design-system' ) }{ ' ' }
									{ uploadQueue.length }
								</p>
							) }
							<div className="progress-bar">
								<div
									className="progress-bar-fill"
									style={ { width: `${ uploadProgress }%` } }
								/>
							</div>
						</div>
						<DocumentUploader
							metadataFields={ metadataFields }
							onUploadSuccess={ handleUploadSuccess }
							selectedFile={ selectedFileForUpload }
							modalMode={ true }
							onFileDrop={ handleFileDrop }
						/>
					</Modal>
				) }

				{ /* Cancel Upload Confirmation Modal */ }
				{ showCancelConfirmModal && (
					<Modal
						title={ __( 'Cancel Upload', 'bcgov-design-system' ) }
						onRequestClose={ () =>
							setShowCancelConfirmModal( false )
						}
						className="cancel-upload-modal"
					>
						<p>
							{ __(
								'Are you sure you want to cancel the remaining uploads?',
								'bcgov-design-system'
							) }
						</p>
						<div className="modal-actions">
							<Button
								className="doc-repo-button"
								onClick={ () =>
									setShowCancelConfirmModal( false )
								}
							>
								{ __(
									'Continue Upload',
									'bcgov-design-system'
								) }
							</Button>
							<Button
								className="doc-repo-button"
								isDestructive
								onClick={ handleCancelUpload }
							>
								{ __( 'Cancel Upload', 'bcgov-design-system' ) }
							</Button>
						</div>
					</Modal>
				) }
			</div>
		</AppErrorBoundary>
	);
};

export default App;
