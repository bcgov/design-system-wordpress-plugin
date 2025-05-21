import { __, sprintf } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * UploadFeedback Component
 *
 * Displays the status of file uploads in a modal-like interface.
 * Shows individual file status, progress, and error messages.
 * Provides a summary of upload results and allows closing when complete.
 *
 * @param {Object}   props                    - Component props
 * @param {Array}    props.uploadingFiles     - Array of files being uploaded with their status
 * @param {boolean}  props.showUploadFeedback - Flag to control visibility of the feedback UI
 * @param {Function} props.onClose            - Callback function to close the feedback UI
 *
 * @example
 * const files = [
 *   { id: '1', name: 'document.pdf', status: 'uploading' },
 *   { id: '2', name: 'report.pdf', status: 'success' }
 * ];
 * <UploadFeedback
 *   uploadingFiles={files}
 *   showUploadFeedback={true}
 *   onClose={() => setShowUploadFeedback(false)}
 * />
 */
const UploadFeedback = ( { uploadingFiles, showUploadFeedback, onClose } ) => {
	// Count files by their status for summary display
	const successCount = uploadingFiles.filter(
		( f ) => f.status === 'success'
	).length;
	const errorCount = uploadingFiles.filter(
		( f ) => f.status === 'error'
	).length;
	const uploadingCount = uploadingFiles.filter(
		( f ) => f.status === 'uploading'
	).length;
	const processingCount = uploadingFiles.filter(
		( f ) => f.status === 'processing'
	).length;
	const hasPlaceholder = uploadingFiles.some( ( f ) => f.isPlaceholder );

	// Auto-close after 3 seconds only when all uploads are complete or have errors
	useEffect( () => {
		if (
			showUploadFeedback &&
			uploadingCount === 0 &&
			processingCount === 0 &&
			! hasPlaceholder &&
			uploadingFiles.length > 0
		) {
			const timer = setTimeout( () => {
				onClose();
			}, 3000 ); // 3 seconds to match error notice timing

			return () => clearTimeout( timer );
		}
	}, [
		showUploadFeedback,
		uploadingCount,
		processingCount,
		hasPlaceholder,
		onClose,
		uploadingFiles.length,
	] );

	// Return null if feedback should not be shown or no files are being uploaded
	if ( ! showUploadFeedback || uploadingFiles.length === 0 ) {
		return null;
	}

	return (
		<div className="upload-feedback">
			{ /* Header with title and close button */ }
			<div className="upload-feedback-header">
				<div className="upload-feedback-title">
					<svg viewBox="0 0 24 24" width="16" height="16">
						<path
							d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
							fill="currentColor"
						/>
					</svg>
					{ __( 'Document Upload Status', 'bcgov-design-system' ) }
				</div>
				<button
					className="upload-feedback-close"
					onClick={ () => {
						// Only allow closing if no files are being processed or uploaded
						if ( uploadingCount === 0 && processingCount === 0 ) {
							onClose();
						}
					} }
				>
					<svg viewBox="0 0 24 24" width="16" height="16">
						<path
							d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>

			{ /* List of files being uploaded with their individual status */ }
			<div className="upload-feedback-items">
				{ uploadingFiles.map( ( file ) => (
					<div
						key={ file.id }
						className={ `upload-feedback-item ${ file.status } ${
							file.isPlaceholder ? 'placeholder' : ''
						}` }
					>
						<span className="upload-feedback-item-name">
							{ file.name }
						</span>
						{ file.status === 'processing' && (
							<>{ __( 'Processing…', 'bcgov-design-system' ) }</>
						) }
						{ file.status === 'uploading' && (
							<>{ __( 'Uploading…', 'bcgov-design-system' ) }</>
						) }
						{ file.status === 'success' && (
							<svg viewBox="0 0 24 24" width="16" height="16">
								<path
									d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
									fill="currentColor"
								/>
							</svg>
						) }
						{ file.status === 'error' && (
							<>
								<svg viewBox="0 0 24 24" width="16" height="16">
									<path
										d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
										fill="currentColor"
									/>
								</svg>
								{ file.error && (
									<span className="upload-feedback-item-error">
										{ file.error }
									</span>
								) }
							</>
						) }
					</div>
				) ) }
			</div>

			{ /* Summary section showing counts of files in each status */ }
			<div className="upload-feedback-summary">
				{ hasPlaceholder ? (
					<div className="processing">
						<svg viewBox="0 0 24 24" width="16" height="16">
							<path
								d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
								fill="currentColor"
							/>
						</svg>
						{ __( 'Preparing files…', 'bcgov-design-system' ) }
					</div>
				) : (
					<>
						{ processingCount > 0 && (
							<div className="processing">
								<svg viewBox="0 0 24 24" width="16" height="16">
									<path
										d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
										fill="currentColor"
									/>
								</svg>
								{ sprintf(
									/* translators: %d: number of files being processed */
									__(
										'Processing %d files…',
										'bcgov-design-system'
									),
									processingCount
								) }
							</div>
						) }
						{ uploadingCount > 0 && (
							<div className="uploading">
								<svg viewBox="0 0 24 24" width="16" height="16">
									<path
										d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
										fill="currentColor"
									/>
								</svg>
								{ sprintf(
									/* translators: %d: number of files being uploaded */
									__(
										'Uploading %d files…',
										'bcgov-design-system'
									),
									uploadingCount
								) }
							</div>
						) }
						{ successCount > 0 && (
							<div className="success">
								<svg viewBox="0 0 24 24" width="16" height="16">
									<path
										d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
										fill="currentColor"
									/>
								</svg>
								{ sprintf(
									/* translators: %d: number of files that were successfully uploaded */
									__(
										'%d files uploaded successfully',
										'bcgov-design-system'
									),
									successCount
								) }
							</div>
						) }
						{ errorCount > 0 && (
							<div className="error">
								<svg viewBox="0 0 24 24" width="16" height="16">
									<path
										d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
										fill="currentColor"
									/>
								</svg>
								{ sprintf(
									/* translators: %d: number of files that failed to upload */
									__(
										'%d files failed to upload',
										'bcgov-design-system'
									),
									errorCount
								) }
							</div>
						) }
					</>
				) }
			</div>
		</div>
	);
};

export default UploadFeedback;
