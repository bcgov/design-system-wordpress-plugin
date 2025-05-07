import { useState, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Custom hook for handling file uploads
 *
 * @param {Object}   options                    Options for the hook
 * @param {Function} options.onFileDrop         Callback to handle file upload
 * @param {Function} options.onShowNotification Callback for showing notifications
 * @param {Function} options.onError            Callback for error handling
 * @return {Object} File handling state and functions
 */
const useFileHandling = ( { onFileDrop, onShowNotification, onError } ) => {
	const [ uploadingFiles, setUploadingFiles ] = useState( [] );
	const [ showUploadFeedback, setShowUploadFeedback ] = useState( false );

	/**
	 * Handle files selected for upload
	 * @param {Array} files Array of File objects
	 */
	const handleFiles = useCallback(
		( files ) => {
			// Show immediate feedback before any processing
			setShowUploadFeedback( true );

			if ( ! files || files.length === 0 ) {
				if ( onShowNotification ) {
					onShowNotification(
						'error',
						__(
							'No files were selected for upload.',
							'bcgov-design-system'
						)
					);
				}
				setShowUploadFeedback( false );
				return;
			}

			// Display placeholder while processing files
			setUploadingFiles( [
				{
					id: 'placeholder',
					name: sprintf(
						/* translators: %d: number of files being prepared */
						__( 'Preparing %d files…', 'bcgov-design-system' ),
						files.length
					),
					status: 'processing',
					error: null,
					isPlaceholder: true,
				},
			] );

			// Process files and create file objects for display
			const processedFiles = files.map( ( file ) => ( {
				id: Math.random().toString( 36 ).substr( 2, 9 ),
				name: file.name,
				originalFile: file,
				status: 'processing',
				error: null,
			} ) );

			// Update UI with processing files
			setUploadingFiles( processedFiles );

			// Filter for PDF files and check file types
			const pdfFiles = [];
			const nonPdfFiles = [];

			files.forEach( ( file ) => {
				if (
					file.type === 'application/pdf' ||
					file.name.toLowerCase().endsWith( '.pdf' )
				) {
					pdfFiles.push( file );
				} else {
					nonPdfFiles.push( file );
				}
			} );

			// Update UI with file validation results
			setUploadingFiles( ( prev ) =>
				prev.map( ( f ) => {
					const originalFile = files.find(
						( file ) => file.name === f.name
					);
					const isPdf =
						originalFile &&
						( originalFile.type === 'application/pdf' ||
							originalFile.name
								.toLowerCase()
								.endsWith( '.pdf' ) );

					return {
						...f,
						status: isPdf ? 'uploading' : 'error',
						error: isPdf
							? null
							: __(
									'Not a PDF file. Only PDF files are allowed.',
									'bcgov-design-system'
							  ),
					};
				} )
			);

			// Show error notice if any files were skipped
			if ( nonPdfFiles.length > 0 && onShowNotification ) {
				onShowNotification(
					'warning',
					sprintf(
						/* translators: %1$d: number of skipped files, %2$d: total number of files */
						__(
							'%1$d of %2$d files were skipped because they are not PDFs.',
							'bcgov-design-system'
						),
						nonPdfFiles.length,
						files.length
					)
				);
			}

			// If no valid files, return
			if ( pdfFiles.length === 0 ) {
				return;
			}

			// Upload each valid PDF file
			pdfFiles.forEach( ( file ) => {
				onFileDrop( file )
					.then( () => {
						// Update UI with success
						setUploadingFiles( ( prev ) =>
							prev.map( ( f ) =>
								f.name === file.name
									? { ...f, status: 'success' }
									: f
							)
						);
					} )
					.catch( ( error ) => {
						// Update UI with error details
						setUploadingFiles( ( prev ) =>
							prev.map( ( f ) =>
								f.name === file.name
									? {
											...f,
											status: 'error',
											error:
												error.message ||
												__(
													'Upload failed. Please try again.',
													'bcgov-design-system'
												),
									  }
									: f
							)
						);

						// Handle error
						if ( onError ) {
							onError( 'upload', file.name, error, {
								addToRetryQueue: false,
								customMessage: sprintf(
									/* translators: %1$s: file name, %2$s: error message */
									__(
										'Error uploading "%1$s": %2$s',
										'bcgov-design-system'
									),
									file.name,
									error.message ||
										__(
											'Upload failed',
											'bcgov-design-system'
										)
								),
							} );
						}
					} );
			} );
		},
		[ onFileDrop, onShowNotification, onError ]
	);

	/**
	 * Close the upload feedback UI
	 */
	const closeUploadFeedback = useCallback( () => {
		setShowUploadFeedback( false );
		setUploadingFiles( [] );
	}, [] );

	return {
		uploadingFiles,
		showUploadFeedback,
		handleFiles,
		closeUploadFeedback,
	};
};

export default useFileHandling;
