import { useState, useCallback } from '@wordpress/element';

/**
 * Custom hook for managing notifications.
 *
 * @return {Object} Notification state and functions
 * @return {Object|null} Object.notice - Current notification object or null
 * @return {Function} Object.showNotification - Function to show a notification
 * @return {Function} Object.clearNotification - Function to clear the notification
 */
const useNotifications = () => {
	const [ notice, setNotice ] = useState( null );

	/**
	 * Display a notification message
	 * @param {string} status  - Status of the notification (success, error, warning)
	 * @param {string} message - Message to display
	 * @param {number} timeout - Time in ms before auto-dismissing (0 to disable)
	 */
	const showNotification = useCallback(
		( status, message, timeout = 3000 ) => {
			setNotice( { status, message } );

			if ( timeout > 0 ) {
				setTimeout( () => setNotice( null ), timeout );
			}
		},
		[]
	);

	/**
	 * Clear the current notification
	 */
	const clearNotification = useCallback( () => {
		setNotice( null );
	}, [] );

	return {
		notice,
		showNotification,
		clearNotification,
	};
};

export default useNotifications;
