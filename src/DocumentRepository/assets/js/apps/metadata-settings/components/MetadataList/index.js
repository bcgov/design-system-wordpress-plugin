/**
 * MetadataList Component
 *
 * A simple wrapper component that provides a container for displaying
 * metadata fields in a list format. This component is used to maintain
 * consistent styling and layout for metadata field lists throughout the application.
 *
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child elements to be rendered within the list
 * @return {JSX.Element} A div element with the metadata-fields-list class containing the children
 *
 * @example
 * <MetadataList>
 *   <MetadataField />
 *   <MetadataField />
 * </MetadataList>
 */

const MetadataList = ( { children } ) => (
	<div className="metadata-fields-list">{ children }</div>
);

export default MetadataList;
