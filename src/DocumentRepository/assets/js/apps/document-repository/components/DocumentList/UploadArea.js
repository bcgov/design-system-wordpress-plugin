import { useRef, useCallback, useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Upload Area Component
 *
 * Provides a drag-and-drop area for file uploads
 *
 * @param {Object}   props
 * @param {Function} props.onFilesSelected - Callback when files are selected
 * @param {string}   props.acceptMimeTypes - MIME types to accept (e.g. 'application/pdf')
 */
const UploadArea = ( {
	onFilesSelected,
	acceptMimeTypes = 'application/pdf',
} ) => {
	const [ isDragging, setIsDragging ] = useState( false );
	const fileInputRef = useRef( null );
	const dragTimeoutRef = useRef( null );

	// Cleanup drag timeout on unmount
	useEffect( () => {
		return () => {
			if ( dragTimeoutRef.current ) {
				clearTimeout( dragTimeoutRef.current );
			}
		};
	}, [] );

	const handleDragEnter = useCallback( ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging( true );
	}, [] );

	const handleDragOver = useCallback(
		( e ) => {
			e.preventDefault();
			e.stopPropagation();
			if ( ! isDragging ) {
				setIsDragging( true );
			}
		},
		[ isDragging ]
	);

	const handleDragLeave = useCallback( ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		const isLeavingContainer = ! e.currentTarget.contains(
			e.relatedTarget
		);
		if ( isLeavingContainer ) {
			// Use timeout to prevent flickering
			dragTimeoutRef.current = setTimeout( () => {
				setIsDragging( false );
			}, 50 );
		}
	}, [] );

	const handleDrop = useCallback(
		( e ) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging( false );

			const droppedFiles = e.dataTransfer.files;
			if ( droppedFiles && droppedFiles.length > 0 ) {
				onFilesSelected( Array.from( droppedFiles ) );
			}
		},
		[ onFilesSelected ]
	);

	const handleFileInputChange = useCallback(
		( e ) => {
			const files = Array.from( e.target.files );
			if ( files.length > 0 ) {
				onFilesSelected( files );
			}
		},
		[ onFilesSelected ]
	);

	const handleUploadClick = useCallback(
		( e ) => {
			// If event exists, prevent it from bubbling up to parent elements
			if ( e ) {
				e.stopPropagation();
			}

			if ( fileInputRef.current ) {
				fileInputRef.current.click();
			}
		},
		[ fileInputRef ]
	);

	const handleKeyDown = useCallback(
		( e ) => {
			// Handle Enter and Space keys
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				handleUploadClick();
			}
		},
		[ handleUploadClick ]
	);

	return (
		<div
			className={ `upload-area__container ${
				isDragging ? 'upload-area__container--drag-active' : ''
			}` }
			onDragEnter={ handleDragEnter }
			onDragOver={ handleDragOver }
			onDragLeave={ handleDragLeave }
			onDrop={ handleDrop }
			onClick={ handleUploadClick }
			onKeyDown={ handleKeyDown }
			tabIndex="0"
			role="button"
			aria-label={ __(
				'Click or drag files to upload',
				'bcgov-design-system'
			) }
		>
			<input
				type="file"
				ref={ fileInputRef }
				className="upload-area__file-input"
				onChange={ handleFileInputChange }
				multiple
				accept={ acceptMimeTypes }
				aria-hidden="true"
			/>
			<div className="upload-area__content">
				<div className="upload-area__icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="48"
						height="48"
					>
						<path
							d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
							fill="currentColor"
						/>
					</svg>
				</div>
				<h3 className="upload-area__text">
					{ __(
						'Drag & Drop or Click to Upload',
						'bcgov-design-system'
					) }
				</h3>
				<p className="upload-area__help-text">
					{ __(
						'Upload PDF documents to the repository',
						'bcgov-design-system'
					) }
				</p>
				<Button
					className="upload-area__button"
					onClick={ ( e ) => {
						e.stopPropagation();
						handleUploadClick();
					} }
				>
					{ __( 'Choose Files', 'bcgov-design-system' ) }
				</Button>
			</div>
		</div>
	);
};

export default UploadArea;
