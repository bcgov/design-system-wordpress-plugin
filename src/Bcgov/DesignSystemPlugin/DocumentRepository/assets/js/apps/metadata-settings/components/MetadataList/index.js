/**
 * MetadataList Component
 * 
 * A simple wrapper component that provides a container for displaying
 * metadata fields in a list format. This component is used to maintain
 * consistent styling and layout for metadata field lists throughout the application.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to be rendered within the list
 * @returns {JSX.Element} A div element with the metadata-fields-list class containing the children
 * 
 * @example
 * <MetadataList>
 *   <MetadataField />
 *   <MetadataField />
 * </MetadataList>
 */

const MetadataList = ({ children }) => (
    <div className="metadata-fields-list">
        {children}
    </div>
);

export default MetadataList; 