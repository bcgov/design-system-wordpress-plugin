/**
 * DocumentUploader Component
 *
 * A comprehensive component for handling document uploads with metadata.
 * Supports both drag-and-drop and file selection, with progress tracking
 * and validation. Can operate in both modal and full-page modes.
 *
 * @param {Object}   props                   - Component props
 * @param {Array}    props.metadataFields    - Array of metadata field definitions
 * @param {Function} props.onUploadSuccess   - Callback when upload completes successfully
 * @param {File}     [props.selectedFile]    - Optional pre-selected file
 * @param {boolean}  [props.modalMode=false] - Whether to render in modal mode
 *
 * @example
 * // Example metadata fields structure
 * [
 *   { id: 'author', label: 'Author', type: 'text' },
 *   { id: 'publish_date', label: 'Publish Date', type: 'date' }
 * ]
 *
 * <DocumentUploader
 *   metadataFields={metadataFields}
 *   onUploadSuccess={(document) => handleDocumentUploaded(document)}
 *   modalMode={true}
 * />
 */

import { useState, useRef, useEffect, useCallback } from '@wordpress/element';
import {
	Button,
	FormFileUpload,
	TextControl,
	SelectControl,
	Notice,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * State Management
 *
 * The component manages several pieces of state:
 * - file: The currently selected file
 * - isUploading: Upload progress flag
 * - uploadProgress: Upload progress percentage
 * - error: Error message if any
 * - uploadSuccess: Success state flag
 * - isDragging: Drag-and-drop state
 * - title: Document title
 * - metadata: Document metadata values
 */

/**
 * Document Uploader component
 *
 * @param {Object}   props                 - Component props
 * @param {Array}    props.metadataFields  - Array of metadata field definitions
 * @param {Function} props.onUploadSuccess - Callback when upload completes successfully
 * @param {File}     props.selectedFile    - Optional pre-selected file
 * @param {boolean}  props.modalMode       - Whether to render in modal mode
 * @return {JSX.Element}                     - Component
 */
const DocumentUploader = ( {
	metadataFields,
	onUploadSuccess,
	selectedFile = null,
	modalMode = false,
} ) => {
	// File upload state
	const [ file, setFile ] = useState( selectedFile );
	const [ isUploading, setIsUploading ] = useState( false );
	const [ uploadProgress, setUploadProgress ] = useState( 0 );
	const [ error, setError ] = useState( null );
	const [ uploadSuccess, setUploadSuccess ] = useState( false );
	const [ isDragging, setIsDragging ] = useState( false );

	// Ref for the file input
	const fileInputRef = useRef( null );
	const dropzoneRef = useRef( null );

	// Document metadata state
	const [ title, setTitle ] = useState(
		selectedFile ? selectedFile.name.split( '.' )[ 0 ] : ''
	);
	const [ metadata, setMetadata ] = useState( {} );

	// Get settings from WordPress
	const { apiNamespace, maxFileSize, allowedMimeTypes } =
		window.documentRepositorySettings;

	/**
	 * File Validation
	 *
	 * Validates files based on:
	 * - File size limits
	 * - Allowed file types
	 * - Required metadata fields
	 *
	 * @param {File} fileToValidate - File to validate
	 * @return {boolean} Whether the file is valid
	 */
	const validateFile = useCallback(
		( fileToValidate ) => {
			if ( ! fileToValidate ) {
				return false;
			}

			// Check file size
			if ( fileToValidate.size > maxFileSize ) {
				const errorMsg = `File "${
					fileToValidate.name
				}" is too large (${ (
					fileToValidate.size /
					( 1024 * 1024 )
				).toFixed( 2 ) } MB). Maximum allowed size is ${ (
					maxFileSize /
					( 1024 * 1024 )
				).toFixed( 2 ) } MB.`;
				setError( errorMsg );
				return false;
			}

			// Check file type
			const fileExtension = fileToValidate.name
				.split( '.' )
				.pop()
				.toLowerCase();
			const allowedExtensions = Object.keys( allowedMimeTypes );

			if ( ! allowedExtensions.includes( fileExtension ) ) {
				const errorMsg = `File "${
					fileToValidate.name
				}" has an invalid file type. Allowed types are: ${ allowedExtensions.join(
					', '
				) }`;
				setError( errorMsg );
				return false;
			}

			setError( null );
			return true;
		},
		[ maxFileSize, allowedMimeTypes ]
	);

	// Handle file validation and selection
	const validateAndSetFile = useCallback(
		( fileToValidate ) => {
			if ( ! fileToValidate ) {
				return false;
			}

			if ( validateFile( fileToValidate ) ) {
				setFile( fileToValidate );

				// Set default title from filename
				const fileNameWithoutExt = fileToValidate.name.includes( '.' )
					? fileToValidate.name.substring(
							0,
							fileToValidate.name.lastIndexOf( '.' )
					  )
					: fileToValidate.name;

				setTitle( fileNameWithoutExt );
				return true;
			}

			return false;
		},
		[ validateFile ]
	);

	// Handle initial file setting from props
	useEffect( () => {
		if ( selectedFile ) {
			// Update the title state based on the selected file
			setTitle( selectedFile.name.replace( /\.[^/.]+$/, '' ) ); // Remove file extension

			// Also validate the file
			if ( ! validateFile( selectedFile ) ) {
				return {
					error: 'Initial file validation failed, but still setting file for UI',
				};
			}
		}
	}, [ selectedFile, validateFile ] );

	// Handle modal mode file setting
	useEffect( () => {
		if ( modalMode && ! file && selectedFile ) {
			setFile( selectedFile );
		}
	}, [ modalMode, selectedFile, file ] );

	// Handle file selection from input
	const handleFileChange = ( event ) => {
		const newFile = event.target.files[ 0 ];
		validateAndSetFile( newFile );
	};

	// Handle file selection directly (for drag & drop)
	const handleFileSelect = ( newFile ) => {
		validateAndSetFile( newFile );
	};

	// Handle drag events
	const handleDragEnter = ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging( true );
	};

	const handleDragOver = ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		// Keep setting isDragging to true to ensure state persists
		setIsDragging( true );
	};

	const handleDragLeave = ( e ) => {
		e.preventDefault();
		e.stopPropagation();

		// Only set isDragging to false if we're leaving the container
		const rect = dropzoneRef.current.getBoundingClientRect();
		if (
			e.clientX < rect.left ||
			e.clientX >= rect.right ||
			e.clientY < rect.top ||
			e.clientY >= rect.bottom
		) {
			setIsDragging( false );
		}
	};

	const handleDrop = ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging( false );

		const droppedFiles = Array.from( e.dataTransfer.files );

		if ( droppedFiles.length > 0 ) {
			handleFileSelect( droppedFiles[ 0 ] );
		}
	};

	// Click handler for the drop zone
	const handleDropzoneClick = () => {
		// Trigger the hidden file input's click event
		if ( fileInputRef.current ) {
			fileInputRef.current.click();
		}
	};

	// Handle metadata field change
	const handleMetadataChange = ( fieldId, value ) => {
		setMetadata( ( prev ) => ( {
			...prev,
			[ fieldId ]: value,
		} ) );
	};

	/**
	 * Upload Process
	 *
	 * Handles the document upload process:
	 * 1. Validates required fields
	 * 2. Creates FormData with file and metadata
	 * 3. Tracks upload progress
	 * 4. Handles success/error states
	 * 5. Notifies parent component on success
	 *
	 * @async
	 */
	const handleUpload = async () => {
		if ( ! file ) {
			setError( 'Please select a file to upload.' );
			return;
		}

		if ( ! validateFile( file ) ) {
			return;
		}

		setIsUploading( true );
		setError( null );
		setUploadProgress( 0 );

		const formData = new FormData();
		formData.append( 'file', file );
		formData.append( 'title', title );
		formData.append( '_wpnonce', window.documentRepositorySettings.nonce );

		// Add metadata as JSON with document_repository flag
		const metadataWithFlag = {
			...metadata,
			document_repository: true,
		};
		const metadataJson = JSON.stringify( metadataWithFlag );
		formData.append( 'metadata', metadataJson );

		try {
			const response = await fetch(
				`${ window.documentRepositorySettings.apiRoot }${ apiNamespace }/documents`,
				{
					method: 'POST',
					headers: {
						'X-WP-Nonce': window.documentRepositorySettings.nonce,
					},
					body: formData,
				}
			);

			if ( ! response.ok ) {
				const errorData = await response.json();
				throw new Error( errorData.message || 'Upload failed' );
			}

			const data = await response.json();

			setUploadSuccess( true );
			setIsUploading( false );

			// Notify parent of successful upload
			if ( onUploadSuccess ) {
				onUploadSuccess( data.document );
			}

			// Reset form if not in modal mode
			if ( ! modalMode ) {
				setFile( null );
				setTitle( '' );
				setMetadata( {} );
			}
		} catch ( err ) {
			setError(
				err.message || 'Failed to upload file. Please try again.'
			);
			setIsUploading( false );
		}
	};

	/**
	 * Metadata Field Rendering
	 *
	 * Dynamically renders form fields based on metadata field definitions:
	 * - Text fields
	 * - Select fields
	 * - Date fields
	 *
	 * @param {Object} field - Metadata field definition
	 * @return {JSX.Element} Rendered form field
	 */
	const renderField = ( field ) => {
		const { id, label: fieldLabel, type, options, required } = field;

		switch ( type ) {
			case 'text':
				return (
					<TextControl
						key={ id }
						label={ fieldLabel }
						value={ metadata[ id ] || '' }
						onChange={ ( value ) =>
							handleMetadataChange( id, value )
						}
						required={ required }
					/>
				);

			case 'date':
				return (
					<TextControl
						key={ id }
						label={ fieldLabel }
						type="date"
						value={ metadata[ id ] || '' }
						onChange={ ( value ) =>
							handleMetadataChange( id, value )
						}
						required={ required }
					/>
				);

			case 'taxonomy':
				return (
					<SelectControl
						key={ id }
						label={ fieldLabel }
						value={ metadata[ id ] || '' }
						options={ [
							{
								label: __( 'Select…', 'bcgov-design-system' ),
								value: '',
							},
							...( options || [] ).map( ( option ) => {
								// Handle both old format (string) and new format (object with id/name)
								if ( typeof option === 'string' ) {
									return {
										label: option,
										value: option,
									};
								}
								return {
									label: option.label || option.name,
									value: option.value || option.id,
								};
							} ),
						] }
						onChange={ ( value ) =>
							handleMetadataChange( id, value )
						}
						required={ required }
					/>
				);

			default:
				return null;
		}
	};

	/**
	 * Layout Modes
	 *
	 * The component supports two layout modes:
	 * 1. Modal Mode:
	 *    - Simplified interface
	 *    - Pre-selected file support
	 *    - Compact metadata form
	 *
	 * 2. Full Mode:
	 *    - Card-based layout
	 *    - Drag-and-drop support
	 *    - Full metadata form
	 */
	// Render content based on whether we're in modal mode or not
	const renderContent = () => {
		return (
			<>
				{ uploadSuccess && (
					<Notice
						status="success"
						isDismissible={ true }
						onRemove={ () => setUploadSuccess( false ) }
					>
						{ __(
							'Document uploaded successfully!',
							'bcgov-design-system'
						) }
					</Notice>
				) }

				{ error && (
					<Notice
						status="error"
						isDismissible={ true }
						onRemove={ () => setError( null ) }
					>
						{ error }
					</Notice>
				) }

				{ /* Drag & Drop Area - only show if not in modal mode and no file is selected */ }
				{ ! modalMode && ! file && (
					<div
						className={ `upload-area__container ${
							isDragging
								? 'upload-area__container--drag-active'
								: ''
						}` }
						onDragEnter={ handleDragEnter }
						onDragOver={ handleDragOver }
						onDragLeave={ handleDragLeave }
						onDrop={ handleDrop }
						onClick={ handleDropzoneClick }
						onKeyDown={ ( e ) => {
							if ( e.key === 'Enter' || e.key === ' ' ) {
								handleDropzoneClick();
							}
						} }
						role="button"
						tabIndex="0"
						ref={ dropzoneRef }
					>
						<input
							type="file"
							ref={ fileInputRef }
							onChange={ handleFileChange }
							className="upload-area__file-input"
							accept={ Object.values( allowedMimeTypes ).join(
								','
							) }
						/>

						<div className="upload-area__content">
							<div className="upload-area__icon">
								<svg viewBox="0 0 64 64" width="64" height="64">
									<path
										d="M32 16v24M20 28l12-12 12 12"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M16 48h32M12 20v28c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V20"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</div>
							<div className="upload-area__text">
								<p className="upload-area__text-primary">
									{ isDragging
										? __(
												'Drop file here',
												'bcgov-design-system'
										  )
										: __(
												'Drag & drop your file here or click to browse',
												'bcgov-design-system'
										  ) }
								</p>
								<p className="upload-area__help-text">
									{ __(
										'Accepted file types:',
										'bcgov-design-system'
									) }{ ' ' }
									{ Object.keys( allowedMimeTypes ).join(
										', '
									) }
								</p>
								<p className="upload-area__help-text">
									{ __(
										'Maximum file size:',
										'bcgov-design-system'
									) }{ ' ' }
									{ Math.round(
										maxFileSize / ( 1024 * 1024 )
									) }{ ' ' }
									MB
								</p>
							</div>
						</div>
					</div>
				) }

				{ /* File selection input for modal mode */ }
				{ modalMode && ! file && (
					<div className="document-uploader-file-select">
						<FormFileUpload
							accept={ Object.values( allowedMimeTypes ).join(
								','
							) }
							onChange={ handleFileChange }
						>
							{ __(
								'Select a different file',
								'bcgov-design-system'
							) }
						</FormFileUpload>
					</div>
				) }

				{ /* Selected file display */ }
				{ file && (
					<div className="selected-file-container">
						<div className="selected-file">
							<span className="file-name">{ file.name }</span>
							<button
								type="button"
								className="remove-file"
								onClick={ () => setFile( null ) }
							>
								✕
							</button>
						</div>

						{ ! modalMode && (
							<FormFileUpload
								accept={ Object.values( allowedMimeTypes ).join(
									','
								) }
								onChange={ handleFileChange }
							>
								{ __(
									'Select a different file',
									'bcgov-design-system'
								) }
							</FormFileUpload>
						) }
					</div>
				) }

				{ isUploading && (
					<div className="upload-progress">
						<progress value={ uploadProgress } max="100"></progress>
						<p>
							{ uploadProgress }%{ ' ' }
							{ __( 'Uploaded', 'bcgov-design-system' ) }
						</p>
					</div>
				) }

				<TextControl
					label={ __( 'Document Title', 'bcgov-design-system' ) }
					value={ title }
					onChange={ setTitle }
					disabled={ isUploading }
					required
				/>

				<h4>{ __( 'Document Metadata', 'bcgov-design-system' ) }</h4>

				<div
					className={ `metadata-fields ${
						modalMode ? 'modal-layout' : ''
					}` }
				>
					{ metadataFields.map( renderField ) }
				</div>
			</>
		);
	};

	// Helper functions to simplify the JSX
	const renderFileInfo = () => {
		if ( file ) {
			return (
				<p>
					<strong>File:</strong> { file.name } (
					{ Math.round( file.size / 1024 ) } KB)
				</p>
			);
		}
		if ( selectedFile ) {
			return (
				<p>
					<strong>File:</strong> { selectedFile.name } (
					{ Math.round( selectedFile.size / 1024 ) } KB)
				</p>
			);
		}
		return (
			<p>
				<strong>Warning:</strong> No file selected
			</p>
		);
	};

	const renderUploadButtonContent = () => {
		if ( isUploading ) {
			return (
				<>
					<Spinner />
					{ __( 'Uploading…', 'bcgov-design-system' ) }
				</>
			);
		}
		return __( 'Upload Document', 'bcgov-design-system' );
	};

	/**
	 * Layout Modes
	 *
	 * The component supports two layout modes:
	 * 1. Modal Mode:
	 *    - Simplified interface
	 *    - Pre-selected file support
	 *    - Compact metadata form
	 *
	 * 2. Full Mode:
	 *    - Card-based layout
	 *    - Drag-and-drop support
	 *    - Full metadata form
	 */
	// If in modal mode, return a simplified layout
	if ( modalMode ) {
		return (
			<div className="document-uploader-modal">
				{ error && (
					<Notice
						status="error"
						isDismissible={ true }
						onRemove={ () => setError( null ) }
					>
						{ error }
					</Notice>
				) }

				{ uploadSuccess && (
					<Notice
						status="success"
						isDismissible={ true }
						onRemove={ () => setUploadSuccess( false ) }
					>
						{ __(
							'Document uploaded successfully!',
							'bcgov-design-system'
						) }
					</Notice>
				) }

				{ /* File info - explicitly confirm we have the file */ }
				<div className="selected-file-info">{ renderFileInfo() }</div>

				{ /* Always show title field and metadata fields in modal mode */ }
				<TextControl
					label={ __( 'Document Title', 'bcgov-design-system' ) }
					value={ title }
					onChange={ setTitle }
					disabled={ isUploading }
					required
				/>

				<h4>{ __( 'Document Metadata', 'bcgov-design-system' ) }</h4>

				<div className="metadata-fields modal-layout">
					{ metadataFields.map( renderField ) }
				</div>

				{ isUploading && (
					<div className="upload-progress">
						<progress value={ uploadProgress } max="100"></progress>
						<p>
							{ uploadProgress }%{ ' ' }
							{ __( 'Uploaded', 'bcgov-design-system' ) }
						</p>
					</div>
				) }

				<div className="modal-actions">
					<Button
						isPrimary
						onClick={ handleUpload }
						disabled={
							( ! file && ! selectedFile ) ||
							! title ||
							isUploading
						}
					>
						{ renderUploadButtonContent() }
					</Button>
				</div>
			</div>
		);
	}

	// Full card layout for non-modal mode
	return (
		<Card className="document-uploader">
			<CardHeader>
				<h3>{ __( 'Upload Document', 'bcgov-design-system' ) }</h3>
			</CardHeader>

			<CardBody>{ renderContent() }</CardBody>

			<CardFooter>
				<div className="card-actions">
					<Button
						isPrimary
						onClick={ handleUpload }
						disabled={ ! file || ! title || isUploading }
					>
						{ renderUploadButtonContent() }
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default DocumentUploader;
